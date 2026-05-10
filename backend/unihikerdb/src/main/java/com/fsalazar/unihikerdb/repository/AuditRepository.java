package com.fsalazar.unihikerdb.repository;

import com.fsalazar.unihikerdb.model.Audit;

import java.util.Optional;

public interface AuditRepository {

    Long insertAudit(Audit audit);

    Optional<Audit> findLatestByCompanyName(String companyName);
}
