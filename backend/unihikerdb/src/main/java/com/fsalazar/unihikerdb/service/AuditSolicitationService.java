package com.fsalazar.unihikerdb.service;

import com.fsalazar.unihikerdb.model.AuditSolicitation;

import java.util.List;
import java.util.Optional;

public interface AuditSolicitationService {

    List<AuditSolicitation> findAll();

    Optional<AuditSolicitation> findById(Long id);

    Optional<AuditSolicitation> findLatestByCompanyId(Long companyId);

    AuditSolicitation create(AuditSolicitation solicitation);
}
