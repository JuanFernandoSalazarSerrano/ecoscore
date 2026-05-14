package com.fsalazar.unihikerdb.service.impl;

import com.fsalazar.unihikerdb.model.AuditSolicitation;
import com.fsalazar.unihikerdb.repository.AuditSolicitationRepository;
import com.fsalazar.unihikerdb.service.AuditSolicitationService;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class AuditSolicitationServiceImpl implements AuditSolicitationService {

    private final AuditSolicitationRepository auditSolicitationRepository;

    public AuditSolicitationServiceImpl(AuditSolicitationRepository auditSolicitationRepository) {
        this.auditSolicitationRepository = auditSolicitationRepository;
    }

    @Override
    public List<AuditSolicitation> findAll() {
        return auditSolicitationRepository.findAll();
    }

    @Override
    public Optional<AuditSolicitation> findById(Long id) {
        if (id == null || id <= 0) {
            throw new IllegalArgumentException("id must be a positive number");
        }
        return auditSolicitationRepository.findById(id);
    }

    @Override
    public Optional<AuditSolicitation> findLatestByCompanyId(Long companyId) {
        if (companyId == null || companyId <= 0) {
            throw new IllegalArgumentException("companyId must be a positive number");
        }
        return auditSolicitationRepository.findLatestByCompanyId(companyId);
    }

    @Override
    public AuditSolicitation create(AuditSolicitation solicitation) {
        if (solicitation == null) {
            throw new IllegalArgumentException("solicitation payload is required");
        }
        if (solicitation.getCompanyId() == null || solicitation.getCompanyId() <= 0) {
            throw new IllegalArgumentException("companyId must be a positive number");
        }
        if (!Boolean.TRUE.equals(solicitation.getAgreedToTerms())) {
            throw new IllegalArgumentException("agreedToTerms must be true");
        }
        if (isBlank(solicitation.getFacilityName())) {
            throw new IllegalArgumentException("facilityName is required");
        }
        if (isBlank(solicitation.getFacilityType())) {
            throw new IllegalArgumentException("facilityType is required");
        }
        if (isBlank(solicitation.getFacilityDescription())) {
            throw new IllegalArgumentException("facilityDescription is required");
        }
        if (isBlank(solicitation.getContactName())) {
            throw new IllegalArgumentException("contactName is required");
        }
        if (isBlank(solicitation.getContactEmail())) {
            throw new IllegalArgumentException("contactEmail is required");
        }
        if (isBlank(solicitation.getAuditTypes())) {
            throw new IllegalArgumentException("auditTypes is required");
        }

        if (solicitation.getSolved() == null) {
            solicitation.setSolved(false);
        }

        auditSolicitationRepository.insert(solicitation);
        return solicitation;
    }

    private static boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
