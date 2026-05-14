package com.fsalazar.unihikerdb.repository;

import com.fsalazar.unihikerdb.model.AuditSolicitation;

import java.util.List;
import java.util.Optional;

public interface AuditSolicitationRepository {

    List<AuditSolicitation> findAll();

    Optional<AuditSolicitation> findById(Long id);

    Optional<AuditSolicitation> findLatestByCompanyId(Long companyId);

    Long insert(AuditSolicitation solicitation);
}
