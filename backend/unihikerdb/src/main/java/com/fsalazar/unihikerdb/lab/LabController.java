package com.fsalazar.unihikerdb.lab;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.util.HtmlUtils;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.io.InputStream;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;
import java.time.Duration;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

@RestController
@CrossOrigin(origins = "*")
@RequestMapping("/lab")
@ConditionalOnProperty(prefix = "lab", name = "mode", havingValue = "true")
public class LabController {

    // WARNING: Intentionally vulnerable training endpoints.
    // WARNING: Never deploy this controller publicly.

    private static final Logger log = LoggerFactory.getLogger(LabController.class);
    private static final int MAX_BODY_BYTES = 64 * 1024;
    private static final Duration CONNECT_TIMEOUT = Duration.ofSeconds(3);
    private static final Duration REQUEST_TIMEOUT = Duration.ofSeconds(6);

    private final HttpClient httpClient;
    private final Set<String> ssrfAllowlist;
    private final Map<String, List<String>> commandAllowlist;

    public LabController(
            @Value("${lab.secure.ssrf.allowlist:example.com,localhost}") String allowlist
    ) {
        this.httpClient = HttpClient.newBuilder()
                .connectTimeout(CONNECT_TIMEOUT)
                .followRedirects(HttpClient.Redirect.NEVER)
                .build();
        this.ssrfAllowlist = parseAllowlist(allowlist);
        this.commandAllowlist = buildCommandAllowlist();
    }

    @GetMapping(value = "/xss", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> reflectedXss(
            @RequestParam(name = "input", defaultValue = "") String input
    ) {
        // WARNING: Intentionally reflects untrusted input for XSS training.
        log.warn("LAB XSS payload received input={}", input);
        String body = "<html><body><h1>Reflected XSS Lab</h1><p>Input: "
                + input
                + "</p></body></html>";
        return ResponseEntity.ok(body);
    }

    @GetMapping(value = "/secure/xss", produces = MediaType.TEXT_HTML_VALUE)
    public ResponseEntity<String> secureXss(
            @RequestParam(name = "input", defaultValue = "") String input
    ) {
        log.info("LAB secure XSS input received input={}", input);
        String safe = HtmlUtils.htmlEscape(input);
        String body = "<html><body><h1>Secure XSS Lab</h1><p>Input: "
                + safe
                + "</p></body></html>";
        return ResponseEntity.ok(body);
    }

    @GetMapping("/ssrf")
    public ResponseEntity<Map<String, Object>> ssrf(
            @RequestParam("url") String url
    ) {
        // WARNING: Intentionally vulnerable URL fetch for SSRF training.
        log.warn("LAB SSRF fetch requested url={}", url);
        URI uri = parseUri(url);
        if (uri == null || !isHttpScheme(uri)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Only http/https URLs are supported",
                    "url", url
            ));
        }

        try {
            return ResponseEntity.ok(fetchUri(uri));
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("LAB SSRF fetch failed url={} error={}", url, e.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", "Failed to fetch URL",
                    "url", url,
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/secure/ssrf")
    public ResponseEntity<Map<String, Object>> secureSsrf(
            @RequestParam("url") String url
    ) {
        URI uri = parseUri(url);
        if (uri == null || !isHttpScheme(uri)) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Only http/https URLs are supported",
                    "url", url
            ));
        }

        String host = uri.getHost();
        if (host == null || !isHostAllowed(host)) {
            log.info("LAB secure SSRF blocked url={} host={}", url, host);
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(Map.of(
                    "message", "Host is not allowlisted",
                    "url", url
            ));
        }

        try {
            return ResponseEntity.ok(fetchUri(uri));
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("LAB secure SSRF fetch failed url={} error={}", url, e.toString());
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(Map.of(
                    "message", "Failed to fetch URL",
                    "url", url,
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/rce")
    public ResponseEntity<Map<String, Object>> rce(
            @RequestParam(name = "cmd", defaultValue = "") String cmd
    ) {
        // WARNING: Intentionally executes an allowlisted command for RCE training.
        log.warn("LAB RCE request cmd={}", cmd);
        List<String> command = commandAllowlist.get(cmd.toLowerCase(Locale.ROOT));
        if (command == null) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Unsupported command",
                    "allowed", commandAllowlist.keySet()
            ));
        }

        try {
            ProcessBuilder builder = new ProcessBuilder(command);
            builder.redirectErrorStream(true);
            Process process = builder.start();
            byte[] outputBytes = readMax(process.getInputStream(), MAX_BODY_BYTES);
            int exitCode = process.waitFor();

            return ResponseEntity.ok(Map.of(
                    "command", cmd,
                    "exit_code", exitCode,
                    "output", new String(outputBytes, StandardCharsets.UTF_8)
            ));
        } catch (IOException | InterruptedException e) {
            if (e instanceof InterruptedException) {
                Thread.currentThread().interrupt();
            }
            log.warn("LAB RCE execution failed cmd={} error={}", cmd, e.toString());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                    "message", "Command execution failed",
                    "error", e.getMessage()
            ));
        }
    }

    @GetMapping("/secure/rce")
    public ResponseEntity<Map<String, Object>> secureRce(
            @RequestParam(name = "cmd", defaultValue = "") String cmd
    ) {
        log.info("LAB secure RCE blocked cmd={}", cmd);
        return ResponseEntity.ok(Map.of(
                "message", "Command execution is disabled in the secure endpoint."
        ));
    }

    private Map<String, Object> fetchUri(URI uri) throws IOException, InterruptedException {
        HttpRequest request = HttpRequest.newBuilder(uri)
                .timeout(REQUEST_TIMEOUT)
                .header("User-Agent", "ecoscore-lab/1.0")
                .GET()
                .build();
        HttpResponse<InputStream> response = httpClient.send(request, HttpResponse.BodyHandlers.ofInputStream());
        byte[] bodyBytes = readMax(response.body(), MAX_BODY_BYTES);
        String body = new String(bodyBytes, StandardCharsets.UTF_8);

        Map<String, Object> payload = new LinkedHashMap<>();
        payload.put("url", uri.toString());
        payload.put("status", response.statusCode());
        payload.put("body", body);
        payload.put("truncated", bodyBytes.length >= MAX_BODY_BYTES);
        return payload;
    }

    private byte[] readMax(InputStream inputStream, int maxBytes) throws IOException {
        byte[] buffer = new byte[4096];
        int total = 0;
        int read;

        try (InputStream in = inputStream) {
            java.io.ByteArrayOutputStream out = new java.io.ByteArrayOutputStream();
            while ((read = in.read(buffer)) != -1) {
                int remaining = maxBytes - total;
                if (remaining <= 0) {
                    break;
                }

                int toWrite = Math.min(read, remaining);
                out.write(buffer, 0, toWrite);
                total += toWrite;

                if (total >= maxBytes) {
                    break;
                }
            }
            return out.toByteArray();
        }
    }

    private URI parseUri(String url) {
        try {
            return URI.create(url);
        } catch (IllegalArgumentException ex) {
            return null;
        }
    }

    private boolean isHttpScheme(URI uri) {
        String scheme = uri.getScheme();
        if (scheme == null) {
            return false;
        }

        String normalized = scheme.toLowerCase(Locale.ROOT);
        return "http".equals(normalized) || "https".equals(normalized);
    }

    private boolean isHostAllowed(String host) {
        String normalized = host.toLowerCase(Locale.ROOT);
        return ssrfAllowlist.contains(normalized);
    }

    private Set<String> parseAllowlist(String allowlist) {
        return List.of(allowlist.split(","))
                .stream()
                .map(String::trim)
                .filter(value -> !value.isEmpty())
                .map(value -> value.toLowerCase(Locale.ROOT))
                .collect(Collectors.toSet());
    }

    private Map<String, List<String>> buildCommandAllowlist() {
        Map<String, List<String>> allowlist = new LinkedHashMap<>();
        allowlist.put("date", List.of("date"));
        allowlist.put("whoami", List.of("whoami"));
        allowlist.put("uptime", List.of("uptime"));
        allowlist.put("id", List.of("id"));
        return allowlist;
    }
}
