package com.fsalazar.unihikerdb.service.impl;

import com.fsalazar.unihikerdb.dto.AuditUpdateResult;
import com.fsalazar.unihikerdb.model.Audit;
import com.fsalazar.unihikerdb.repository.AuditRepository;
import com.fsalazar.unihikerdb.service.AuditService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class AuditServiceImpl implements AuditService {

    private static final String DEFAULT_DEVICE_KEY = "__default__";

    private final AuditRepository auditRepository;
    private final ObjectMapper objectMapper;
    private final Map<String, Audit> pendingByDevice = new ConcurrentHashMap<>();
    private final Object lock = new Object();

    public AuditServiceImpl(AuditRepository auditRepository, ObjectMapper objectMapper) {
        this.auditRepository = auditRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public AuditUpdateResult applyUpdate(Map<String, Object> payload) {
        if (payload == null || payload.isEmpty()) {
            throw new IllegalArgumentException("payload must contain at least one field");
        }

        String deviceId = stringValue(payload.get("device_id"));
        synchronized (lock) {
            Audit audit = resolveAudit(deviceId);
            applyPayload(audit, payload);
            List<String> missing = missingRequiredFields(audit);

            if (missing.isEmpty()) {
                Long savedId = auditRepository.insertAudit(audit);
                pendingByDevice.remove(auditKey(audit.getDeviceId()));
                return AuditUpdateResult.saved(savedId);
            }

            return AuditUpdateResult.pending(missing);
        }
    }

    @Override
    public Optional<Audit> findLatestByCompanyName(String companyName) {
        if (isBlank(companyName)) {
            throw new IllegalArgumentException("companyName is required");
        }

        return auditRepository.findLatestByCompanyName(companyName.trim());
    }

    private Audit resolveAudit(String deviceId) {
        if (!isBlank(deviceId)) {
            Audit byDevice = pendingByDevice.get(deviceId);
            if (byDevice != null) {
                return byDevice;
            }

            Audit defaultAudit = pendingByDevice.get(DEFAULT_DEVICE_KEY);
            if (defaultAudit != null && isBlank(defaultAudit.getDeviceId())) {
                pendingByDevice.remove(DEFAULT_DEVICE_KEY);
                defaultAudit.setDeviceId(deviceId);
                pendingByDevice.put(deviceId, defaultAudit);
                return defaultAudit;
            }
        }

        return pendingByDevice.computeIfAbsent(auditKey(deviceId), key -> createNewAudit(deviceId));
    }

    private Audit createNewAudit(String deviceId) {
        Audit audit = new Audit();
        audit.setDeviceId(deviceId);
        audit.setCreatedAt(LocalDateTime.now());
        return audit;
    }

    private String auditKey(String deviceId) {
        return isBlank(deviceId) ? DEFAULT_DEVICE_KEY : deviceId;
    }

    private void applyPayload(Audit audit, Map<String, Object> payload) {
        for (Map.Entry<String, Object> entry : payload.entrySet()) {
            String key = entry.getKey();
            Object value = entry.getValue();
            if (key == null) {
                continue;
            }

            switch (key) {
                case "company_name" -> audit.setCompanyName(stringValue(value));
                case "device_id" -> audit.setDeviceId(stringValue(value));
                case "temp_c" -> audit.setTempC(toBigDecimal(value, "temp_c"));
                case "temp_c_desc" -> audit.setTempCDesc(stringValue(value));
                case "temp_f" -> audit.setTempF(toBigDecimal(value, "temp_f"));
                case "temp_f_desc" -> audit.setTempFDesc(stringValue(value));
                case "humidity" -> audit.setHumidity(toBigDecimal(value, "humidity"));
                case "humidity_desc" -> audit.setHumidityDesc(stringValue(value));
                case "accelerometer" -> audit.setAccelerometer(stringValue(value));
                case "accelerometer_desc" -> audit.setAccelerometerDesc(stringValue(value));
                case "light" -> audit.setLight(stringValue(value));
                case "light_desc" -> audit.setLightDesc(stringValue(value));
                case "questions" -> audit.setQuestions(stringValue(value));
                case "questions_desc" -> audit.setQuestionsDesc(stringValue(value));
                case "calidadaire" -> audit.setCalidadaire(stringValue(value));
                case "calidadaire_desc" -> audit.setCalidadaireDesc(stringValue(value));
                case "riesgobiologico" -> audit.setRiesgobiologico(stringValue(value));
                case "riesgobiologico_desc" -> audit.setRiesgobiologicoDesc(stringValue(value));
                case "materialespeligrosos" -> audit.setMaterialespeligrosos(stringValue(value));
                case "materialespeligrosos_desc" -> audit.setMaterialespeligrososDesc(stringValue(value));
                case "gestionresiduos" -> audit.setGestionresiduos(stringValue(value));
                case "gestionresiduos_desc" -> audit.setGestionresiduosDesc(stringValue(value));
                case "consumoenergetico" -> audit.setConsumoenergetico(toBigDecimal(value, "consumoenergetico"));
                case "consumoenergetico_desc" -> audit.setConsumoenergeticoDesc(stringValue(value));
                case "biodiversidad" -> audit.setBiodiversidad(stringValue(value));
                case "biodiversidad_desc" -> audit.setBiodiversidadDesc(stringValue(value));
                case "gestionagua" -> audit.setGestionagua(stringValue(value));
                case "gestionagua_desc" -> audit.setGestionaguaDesc(stringValue(value));
                case "contaminacionauditiva" -> audit.setContaminacionauditiva(stringValue(value));
                case "contaminacionauditiva_desc" -> audit.setContaminacionauditivaDesc(stringValue(value));
                case "conclusions" -> audit.setConclusions(stringValue(value));
                case "id", "created_at" -> {
                }
                default -> {
                }
            }
        }
    }

    private List<String> missingRequiredFields(Audit audit) {
        List<String> missing = new ArrayList<>();
        if (isBlank(audit.getCompanyName())) missing.add("company_name");
        if (isBlank(audit.getDeviceId())) missing.add("device_id");
        if (audit.getTempC() == null) missing.add("temp_c");
        if (isBlank(audit.getTempCDesc())) missing.add("temp_c_desc");
        if (audit.getTempF() == null) missing.add("temp_f");
        if (isBlank(audit.getTempFDesc())) missing.add("temp_f_desc");
        if (audit.getHumidity() == null) missing.add("humidity");
        if (isBlank(audit.getHumidityDesc())) missing.add("humidity_desc");
        if (isBlank(audit.getAccelerometer())) missing.add("accelerometer");
        if (isBlank(audit.getAccelerometerDesc())) missing.add("accelerometer_desc");
        if (isBlank(audit.getLight())) missing.add("light");
        if (isBlank(audit.getLightDesc())) missing.add("light_desc");
        if (isBlank(audit.getQuestions())) missing.add("questions");
        if (isBlank(audit.getQuestionsDesc())) missing.add("questions_desc");
        if (isBlank(audit.getCalidadaire())) missing.add("calidadaire");
        if (isBlank(audit.getCalidadaireDesc())) missing.add("calidadaire_desc");
        if (isBlank(audit.getRiesgobiologico())) missing.add("riesgobiologico");
        if (isBlank(audit.getRiesgobiologicoDesc())) missing.add("riesgobiologico_desc");
        if (isBlank(audit.getMaterialespeligrosos())) missing.add("materialespeligrosos");
        if (isBlank(audit.getMaterialespeligrososDesc())) missing.add("materialespeligrosos_desc");
        if (isBlank(audit.getGestionresiduos())) missing.add("gestionresiduos");
        if (isBlank(audit.getGestionresiduosDesc())) missing.add("gestionresiduos_desc");
        if (audit.getConsumoenergetico() == null) missing.add("consumoenergetico");
        if (isBlank(audit.getConsumoenergeticoDesc())) missing.add("consumoenergetico_desc");
        if (isBlank(audit.getBiodiversidad())) missing.add("biodiversidad");
        if (isBlank(audit.getBiodiversidadDesc())) missing.add("biodiversidad_desc");
        if (isBlank(audit.getGestionagua())) missing.add("gestionagua");
        if (isBlank(audit.getGestionaguaDesc())) missing.add("gestionagua_desc");
        if (isBlank(audit.getContaminacionauditiva())) missing.add("contaminacionauditiva");
        if (isBlank(audit.getContaminacionauditivaDesc())) missing.add("contaminacionauditiva_desc");
        return missing;
    }

    private BigDecimal toBigDecimal(Object value, String fieldName) {
        if (value == null) {
            return null;
        }
        if (value instanceof BigDecimal bigDecimal) {
            return bigDecimal;
        }
        try {
            return new BigDecimal(value.toString());
        } catch (NumberFormatException ex) {
            throw new IllegalArgumentException(fieldName + " must be a number");
        }
    }

    private String stringValue(Object value) {
        if (value == null) {
            return null;
        }
        if (value instanceof String string) {
            return string;
        }
        if (value instanceof Iterable<?> || value instanceof Map<?, ?>) {
            try {
                return objectMapper.writeValueAsString(value);
            } catch (Exception ignored) {
                return value.toString();
            }
        }
        return value.toString();
    }

    private boolean isBlank(String value) {
        return value == null || value.trim().isEmpty();
    }
}
