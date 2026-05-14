package com.fsalazar.unihikerdb.controller;

import com.fsalazar.unihikerdb.model.AuditSolicitation;
import com.fsalazar.unihikerdb.service.AuditSolicitationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/audit-solicitations")
public class AuditSolicitationController {

    private static final String MESSAGE = "message";

    private final AuditSolicitationService auditSolicitationService;

    public AuditSolicitationController(AuditSolicitationService auditSolicitationService) {
        this.auditSolicitationService = auditSolicitationService;
    }

    @GetMapping
    public ResponseEntity<List<AuditSolicitation>> getAll() {
        return ResponseEntity.ok(auditSolicitationService.findAll());
    }

    @PostMapping
    public ResponseEntity<?> create(@RequestBody AuditSolicitation solicitation) {
        try {
            AuditSolicitation saved = auditSolicitationService.create(solicitation);
            return ResponseEntity.status(HttpStatus.CREATED).body(saved);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    MESSAGE, e.getMessage()
            ));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getById(@PathVariable Long id) {
        try {
            return auditSolicitationService.findById(id)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                            MESSAGE, "Audit solicitation not found"
                    )));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    MESSAGE, e.getMessage()
            ));
        }
    }

    @GetMapping("/company/{companyId}/latest")
    public ResponseEntity<?> getLatestByCompanyId(@PathVariable Long companyId) {
        try {
            return auditSolicitationService.findLatestByCompanyId(companyId)
                    .<ResponseEntity<?>>map(ResponseEntity::ok)
                    .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
                            MESSAGE, "Audit solicitation not found"
                    )));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    MESSAGE, e.getMessage()
            ));
        }
    }
}
