package com.fsalazar.unihikerdb.controller;

import com.fsalazar.unihikerdb.dto.AuditUpdateResult;
import com.fsalazar.unihikerdb.service.AuditService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/audit")
public class AuditController {

	private static final String MESSAGE = "message";

	private final AuditService auditService;

	public AuditController(AuditService auditService) {
		this.auditService = auditService;
	}

	@PostMapping
	public ResponseEntity<Map<String, Object>> updateAudit(@RequestBody Map<String, Object> payload) {
		try {
			AuditUpdateResult result = auditService.applyUpdate(payload);
			if (result.saved()) {
				return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
						MESSAGE, "Audit saved",
						"auditId", result.savedId()
				));
			}

			return ResponseEntity.ok(Map.of(
					MESSAGE, "Audit updated",
					"missingFields", result.missingFields()
			));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Map.of(
					MESSAGE, e.getMessage()
			));
		}
	}

	@GetMapping("/{companyName}")
	public ResponseEntity<?> getAuditByCompanyName(@PathVariable String companyName) {
		try {
			return auditService.findLatestByCompanyName(companyName)
					.<ResponseEntity<?>>map(ResponseEntity::ok)
					.orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).body(Map.of(
							MESSAGE, "Audit not found"
					)));
		} catch (IllegalArgumentException e) {
			return ResponseEntity.badRequest().body(Map.of(
					MESSAGE, e.getMessage()
			));
		}
	}
}
