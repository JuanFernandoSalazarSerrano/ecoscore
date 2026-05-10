package com.fsalazar.unihikerdb.service;

import com.fsalazar.unihikerdb.dto.AuditUpdateResult;
import com.fsalazar.unihikerdb.model.Audit;

import java.util.Map;
import java.util.Optional;

public interface AuditService {

    AuditUpdateResult applyUpdate(Map<String, Object> payload);

    Optional<Audit> findLatestByCompanyName(String companyName);
}
