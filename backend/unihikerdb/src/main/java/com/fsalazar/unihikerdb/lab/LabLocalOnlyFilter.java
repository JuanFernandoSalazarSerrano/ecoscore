package com.fsalazar.unihikerdb.lab;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;

@Component
@Order(Ordered.HIGHEST_PRECEDENCE)
@ConditionalOnProperty(prefix = "lab", name = "mode", havingValue = "true")
public class LabLocalOnlyFilter extends OncePerRequestFilter {

    private static final Logger log = LoggerFactory.getLogger(LabLocalOnlyFilter.class);

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) {
        String path = request.getRequestURI();
        return path == null || !path.startsWith("/lab/");
    }

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {
        String remoteAddr = request.getRemoteAddr();
        if (!isLocalOrPrivate(remoteAddr)) {
            log.warn(
                    "LAB blocked non-local request remoteAddr={} method={} path={}",
                    remoteAddr,
                    request.getMethod(),
                    request.getRequestURI()
            );
            response.sendError(
                    HttpServletResponse.SC_FORBIDDEN,
                    "Lab endpoints are only available from localhost or a private network."
            );
            return;
        }

        filterChain.doFilter(request, response);
    }

    private boolean isLocalOrPrivate(String remoteAddr) {
        if (remoteAddr == null || remoteAddr.isBlank()) {
            return false;
        }

        try {
            InetAddress address = InetAddress.getByName(remoteAddr);
            return address.isLoopbackAddress() || address.isSiteLocalAddress();
        } catch (UnknownHostException e) {
            return false;
        }
    }
}
