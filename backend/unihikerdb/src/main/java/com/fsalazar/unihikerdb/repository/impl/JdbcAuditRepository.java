package com.fsalazar.unihikerdb.repository.impl;

import com.fsalazar.unihikerdb.model.Audit;
import com.fsalazar.unihikerdb.repository.AuditRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcAuditRepository implements AuditRepository {

        private static final String INSERT_SQL = "INSERT INTO sensor_readings ("
            + "company_name, device_id, temp_c, temp_c_desc, temp_f, temp_f_desc, humidity, humidity_desc, "
            + "accelerometer, accelerometer_desc, light, light_desc, questions, questions_desc, "
            + "calidadaire, calidadaire_desc, riesgobiologico, riesgobiologico_desc, "
            + "materialespeligrosos, materialespeligrosos_desc, gestionresiduos, gestionresiduos_desc, "
            + "consumoenergetico, consumoenergetico_desc, biodiversidad, biodiversidad_desc, "
            + "gestionagua, gestionagua_desc, contaminacionauditiva, contaminacionauditiva_desc, conclusions, created_at"
            + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        private static final RowMapper<Audit> AUDIT_ROW_MAPPER = (rs, rowNum) -> mapAudit(rs);

    private final JdbcTemplate jdbcTemplate;

    public JdbcAuditRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public Long insertAudit(Audit audit) {
        LocalDateTime createdAt = audit.getCreatedAt() != null ? audit.getCreatedAt() : LocalDateTime.now();
        audit.setCreatedAt(createdAt);

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            int index = 1;
            statement.setString(index++, audit.getCompanyName());
            statement.setString(index++, audit.getDeviceId());
            statement.setBigDecimal(index++, audit.getTempC());
            statement.setString(index++, audit.getTempCDesc());
            statement.setBigDecimal(index++, audit.getTempF());
            statement.setString(index++, audit.getTempFDesc());
            statement.setBigDecimal(index++, audit.getHumidity());
            statement.setString(index++, audit.getHumidityDesc());
            statement.setString(index++, audit.getAccelerometer());
            statement.setString(index++, audit.getAccelerometerDesc());
            statement.setString(index++, audit.getLight());
            statement.setString(index++, audit.getLightDesc());
            statement.setString(index++, audit.getQuestions());
            statement.setString(index++, audit.getQuestionsDesc());
            statement.setString(index++, audit.getCalidadaire());
            statement.setString(index++, audit.getCalidadaireDesc());
            statement.setString(index++, audit.getRiesgobiologico());
            statement.setString(index++, audit.getRiesgobiologicoDesc());
            statement.setString(index++, audit.getMaterialespeligrosos());
            statement.setString(index++, audit.getMaterialespeligrososDesc());
            statement.setString(index++, audit.getGestionresiduos());
            statement.setString(index++, audit.getGestionresiduosDesc());
            statement.setBigDecimal(index++, audit.getConsumoenergetico());
            statement.setString(index++, audit.getConsumoenergeticoDesc());
            statement.setString(index++, audit.getBiodiversidad());
            statement.setString(index++, audit.getBiodiversidadDesc());
            statement.setString(index++, audit.getGestionagua());
            statement.setString(index++, audit.getGestionaguaDesc());
            statement.setString(index++, audit.getContaminacionauditiva());
            statement.setString(index++, audit.getContaminacionauditivaDesc());
            statement.setString(index++, audit.getConclusions());
            statement.setTimestamp(index, Timestamp.valueOf(createdAt));
            return statement;
        }, keyHolder);

        Number key = keyHolder.getKey();
        return key != null ? key.longValue() : null;
    }

    @Override
    public Optional<Audit> findLatestByCompanyName(String companyName) {
        String sql = "SELECT * FROM sensor_readings WHERE company_name = ? ORDER BY created_at DESC, id DESC LIMIT 1";
        List<Audit> results = jdbcTemplate.query(sql, AUDIT_ROW_MAPPER, companyName);
        return results.stream().findFirst();
    }

    private static Audit mapAudit(ResultSet rs) throws SQLException {
        Audit audit = new Audit();
        long id = rs.getLong("id");
        audit.setId(rs.wasNull() ? null : id);
        audit.setCompanyName(rs.getString("company_name"));
        audit.setDeviceId(rs.getString("device_id"));
        audit.setTempC(rs.getBigDecimal("temp_c"));
        audit.setTempCDesc(rs.getString("temp_c_desc"));
        audit.setTempF(rs.getBigDecimal("temp_f"));
        audit.setTempFDesc(rs.getString("temp_f_desc"));
        audit.setHumidity(rs.getBigDecimal("humidity"));
        audit.setHumidityDesc(rs.getString("humidity_desc"));
        audit.setAccelerometer(rs.getString("accelerometer"));
        audit.setAccelerometerDesc(rs.getString("accelerometer_desc"));
        audit.setLight(rs.getString("light"));
        audit.setLightDesc(rs.getString("light_desc"));
        audit.setQuestions(rs.getString("questions"));
        audit.setQuestionsDesc(rs.getString("questions_desc"));
        audit.setCalidadaire(rs.getString("calidadaire"));
        audit.setCalidadaireDesc(rs.getString("calidadaire_desc"));
        audit.setRiesgobiologico(rs.getString("riesgobiologico"));
        audit.setRiesgobiologicoDesc(rs.getString("riesgobiologico_desc"));
        audit.setMaterialespeligrosos(rs.getString("materialespeligrosos"));
        audit.setMaterialespeligrososDesc(rs.getString("materialespeligrosos_desc"));
        audit.setGestionresiduos(rs.getString("gestionresiduos"));
        audit.setGestionresiduosDesc(rs.getString("gestionresiduos_desc"));
        audit.setConsumoenergetico(rs.getBigDecimal("consumoenergetico"));
        audit.setConsumoenergeticoDesc(rs.getString("consumoenergetico_desc"));
        audit.setBiodiversidad(rs.getString("biodiversidad"));
        audit.setBiodiversidadDesc(rs.getString("biodiversidad_desc"));
        audit.setGestionagua(rs.getString("gestionagua"));
        audit.setGestionaguaDesc(rs.getString("gestionagua_desc"));
        audit.setContaminacionauditiva(rs.getString("contaminacionauditiva"));
        audit.setContaminacionauditivaDesc(rs.getString("contaminacionauditiva_desc"));
        audit.setConclusions(rs.getString("conclusions"));
        Timestamp createdAt = rs.getTimestamp("created_at");
        if (createdAt != null) {
            audit.setCreatedAt(createdAt.toLocalDateTime());
        }
        return audit;
    }
}
