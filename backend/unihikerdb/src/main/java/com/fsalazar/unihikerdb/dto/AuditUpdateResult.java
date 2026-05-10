package com.fsalazar.unihikerdb.dto;

import java.util.List;

public record AuditUpdateResult(
        boolean saved,
        Long savedId,
        List<String> missingFields
) {

    public static AuditUpdateResult pending(List<String> missingFields) {
        return new AuditUpdateResult(false, null, List.copyOf(missingFields));
    }

    public static AuditUpdateResult saved(Long savedId) {
        return new AuditUpdateResult(true, savedId, List.of());
    }
}
