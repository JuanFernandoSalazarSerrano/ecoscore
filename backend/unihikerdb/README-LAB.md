# UnihikerDB Lab Mode

WARNING: This lab exposes intentionally vulnerable endpoints for defensive training.
WARNING: Never deploy this lab publicly or expose it to untrusted networks.

## What this is
- /lab endpoints that simulate XSS, SSRF, and RCE in a controlled way.
- Secure companion endpoints that show proper mitigations.
- Disabled by default unless LAB_MODE=true is set.

## Enable lab mode (local only)
- Export LAB_MODE=true before starting the app.
- Endpoints are blocked unless the request is from localhost or a private network.

## Docker on an isolated network
1. Build the image from this folder:
   docker build -t ecoscore-unihikerdb-lab .
2. Create a dedicated network:
   docker network create ecoscore-lab
3. Run the container bound to localhost only:
   docker run --rm --name ecoscore-lab \
     --network ecoscore-lab \
     -p 127.0.0.1:8080:8080 \
     -e LAB_MODE=true \
     ecoscore-unihikerdb-lab

## Lab endpoints
- /lab/xss?input=...
- /lab/secure/xss?input=...
- /lab/ssrf?url=...
- /lab/secure/ssrf?url=...
- /lab/rce?cmd=...
- /lab/secure/rce?cmd=...

## Secure endpoint settings
- SSRF allowlist: lab.secure.ssrf.allowlist (comma-separated hosts)
- RCE allowlist (demo): date, whoami, uptime, id

## Frontend tabs (business-themed)
The lab UI exposes three business-style pages so the training flow feels realistic. Each page has two actions: a
"draft/preview" path that hits the intentionally vulnerable endpoint, and a "policy" path that calls the secure
endpoint for comparison.

### Water Operations (SSRF)
- URL: http://localhost:4200/water
- Business framing: "Source intake preview" for vendor registry data.
- Vulnerable action: Preview feed -> /lab/ssrf (URL fetch without allowlist).
- Secure action: Policy preview -> /lab/secure/ssrf (allowlist enforced).

### Floral Protection (XSS)
- URL: http://localhost:4200/floralprotection
- Business framing: "Partner memo preview" for field notes.
- Vulnerable action: Draft preview -> /lab/xss (raw HTML render).
- Secure action: Policy preview -> /lab/secure/xss (HTML escaped/sanitized).

### Energy Resources (RCE)
- URL: http://localhost:4200/energyresources
- Business framing: "Utility diagnostics" for operational checks.
- Vulnerable action: Run diagnostics -> /lab/rce (allowlisted command execution).
- Secure action: Policy run -> /lab/secure/rce (execution disabled).

## Examples (testing)
Assumes the app is running on http://localhost:8080 with LAB_MODE=true.

### Reflected XSS (vulnerable)
- Browser:
  http://localhost:8080/lab/xss?input=%3Cscript%3Ealert(1)%3C/script%3E
- curl:
  curl -G "http://localhost:8080/lab/xss" --data-urlencode "input=<script>alert(1)</script>"

### Reflected XSS (secure)
- Browser:
  http://localhost:8080/lab/secure/xss?input=%3Cscript%3Ealert(1)%3C/script%3E
- curl:
  curl -G "http://localhost:8080/lab/secure/xss" --data-urlencode "input=<script>alert(1)</script>"

### SSRF (vulnerable)
- curl:
  curl "http://localhost:8080/lab/ssrf?url=http://example.com"

### SSRF (secure)
- Allowed host:
  curl "http://localhost:8080/lab/secure/ssrf?url=http://example.com"
- Blocked host (not in allowlist):
  curl "http://localhost:8080/lab/secure/ssrf?url=http://example.org"

### RCE (vulnerable)
- curl:
  curl "http://localhost:8080/lab/rce?cmd=date"
  curl "http://localhost:8080/lab/rce?cmd=whoami"

### RCE (secure)
- curl:
  curl "http://localhost:8080/lab/secure/rce?cmd=date"