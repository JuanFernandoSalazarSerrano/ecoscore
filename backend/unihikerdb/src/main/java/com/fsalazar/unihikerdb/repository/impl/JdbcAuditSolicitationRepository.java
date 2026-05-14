package com.fsalazar.unihikerdb.repository.impl;

import com.fsalazar.unihikerdb.model.AuditSolicitation;
import com.fsalazar.unihikerdb.repository.AuditSolicitationRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.jdbc.support.GeneratedKeyHolder;
import org.springframework.jdbc.support.KeyHolder;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.sql.Timestamp;
import java.sql.Types;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public class JdbcAuditSolicitationRepository implements AuditSolicitationRepository {

    private static final String SELECT_ALL_SQL = "SELECT * FROM auditsolicitation ORDER BY created_at DESC, id DESC";
    private static final String SELECT_BY_ID_SQL = "SELECT * FROM auditsolicitation WHERE id = ?";
    private static final String SELECT_LATEST_BY_COMPANY_ID_SQL = "SELECT * FROM auditsolicitation WHERE company_id = ? ORDER BY created_at DESC, id DESC LIMIT 1";
    private static final String INSERT_SQL = "INSERT INTO auditsolicitation ("
            + "facility_name, facility_type, facility_description, street_address, city, state, country, postal_code, "
            + "total_area, area_unit, number_of_floors, number_of_employees, operating_hours, year_built, "
            + "last_renovation_year, existing_certifications, previous_audit_date, audit_types, preferred_start_date, "
            + "preferred_end_date, preferred_time_slot, access_restrictions, special_instructions, contact_name, "
            + "contact_title, contact_email, contact_phone, alternate_contact_name, alternate_contact_phone, "
            + "website, agreed_to_terms, created_at, solved, company_id"
            + ") VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
    private static final RowMapper<AuditSolicitation> ROW_MAPPER = (rs, rowNum) -> mapRow(rs);

    private final JdbcTemplate jdbcTemplate;

    public JdbcAuditSolicitationRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public List<AuditSolicitation> findAll() {
        return jdbcTemplate.query(SELECT_ALL_SQL, ROW_MAPPER);
    }

    @Override
    public Optional<AuditSolicitation> findById(Long id) {
        List<AuditSolicitation> results = jdbcTemplate.query(SELECT_BY_ID_SQL, ROW_MAPPER, id);
        return results.stream().findFirst();
    }

    @Override
    public Optional<AuditSolicitation> findLatestByCompanyId(Long companyId) {
        List<AuditSolicitation> results = jdbcTemplate.query(SELECT_LATEST_BY_COMPANY_ID_SQL, ROW_MAPPER, companyId);
        return results.stream().findFirst();
    }

    @Override
    public Long insert(AuditSolicitation solicitation) {
        LocalDateTime createdAt = solicitation.getCreatedAt() != null
                ? solicitation.getCreatedAt()
                : LocalDateTime.now();
        solicitation.setCreatedAt(createdAt);
        if (solicitation.getSolved() == null) {
            solicitation.setSolved(false);
        }

        KeyHolder keyHolder = new GeneratedKeyHolder();
        jdbcTemplate.update(connection -> {
            PreparedStatement statement = connection.prepareStatement(INSERT_SQL, Statement.RETURN_GENERATED_KEYS);
            int index = 1;
            statement.setString(index++, solicitation.getFacilityName());
            statement.setString(index++, solicitation.getFacilityType());
            statement.setString(index++, solicitation.getFacilityDescription());
            statement.setString(index++, solicitation.getStreetAddress());
            statement.setString(index++, solicitation.getCity());
            statement.setString(index++, solicitation.getState());
            statement.setString(index++, solicitation.getCountry());
            statement.setString(index++, solicitation.getPostalCode());
            statement.setBigDecimal(index++, solicitation.getTotalArea());
            statement.setString(index++, solicitation.getAreaUnit());
            setNullableInteger(statement, index++, solicitation.getNumberOfFloors());
            setNullableInteger(statement, index++, solicitation.getNumberOfEmployees());
            statement.setString(index++, solicitation.getOperatingHours());
            setNullableInteger(statement, index++, solicitation.getYearBuilt());
            setNullableInteger(statement, index++, solicitation.getLastRenovationYear());
            statement.setString(index++, solicitation.getExistingCertifications());
            setNullableDate(statement, index++, solicitation.getPreviousAuditDate());
            statement.setString(index++, solicitation.getAuditTypes());
            setNullableDate(statement, index++, solicitation.getPreferredStartDate());
            setNullableDate(statement, index++, solicitation.getPreferredEndDate());
            statement.setString(index++, solicitation.getPreferredTimeSlot());
            statement.setString(index++, solicitation.getAccessRestrictions());
            statement.setString(index++, solicitation.getSpecialInstructions());
            statement.setString(index++, solicitation.getContactName());
            statement.setString(index++, solicitation.getContactTitle());
            statement.setString(index++, solicitation.getContactEmail());
            statement.setString(index++, solicitation.getContactPhone());
            statement.setString(index++, solicitation.getAlternateContactName());
            statement.setString(index++, solicitation.getAlternateContactPhone());
            statement.setString(index++, solicitation.getWebsite());
            setNullableBoolean(statement, index++, solicitation.getAgreedToTerms());
            statement.setTimestamp(index++, Timestamp.valueOf(createdAt));
            setNullableBoolean(statement, index++, solicitation.getSolved());
            setNullableLong(statement, index, solicitation.getCompanyId());
            return statement;
        }, keyHolder);

        Number key = keyHolder.getKey();
        if (key != null) {
            solicitation.setId(key.longValue());
        }
        return solicitation.getId();
    }

    private static AuditSolicitation mapRow(ResultSet rs) throws SQLException {
        AuditSolicitation solicitation = new AuditSolicitation();
        solicitation.setId(toLong(rs, "id"));
        solicitation.setFacilityName(rs.getString("facility_name"));
        solicitation.setFacilityType(rs.getString("facility_type"));
        solicitation.setFacilityDescription(rs.getString("facility_description"));
        solicitation.setStreetAddress(rs.getString("street_address"));
        solicitation.setCity(rs.getString("city"));
        solicitation.setState(rs.getString("state"));
        solicitation.setCountry(rs.getString("country"));
        solicitation.setPostalCode(rs.getString("postal_code"));
        solicitation.setTotalArea(rs.getBigDecimal("total_area"));
        solicitation.setAreaUnit(rs.getString("area_unit"));
        solicitation.setNumberOfFloors(toInteger(rs, "number_of_floors"));
        solicitation.setNumberOfEmployees(toInteger(rs, "number_of_employees"));
        solicitation.setOperatingHours(rs.getString("operating_hours"));
        solicitation.setYearBuilt(toInteger(rs, "year_built"));
        solicitation.setLastRenovationYear(toInteger(rs, "last_renovation_year"));
        solicitation.setExistingCertifications(rs.getString("existing_certifications"));
        solicitation.setPreviousAuditDate(toLocalDate(rs, "previous_audit_date"));
        solicitation.setAuditTypes(rs.getString("audit_types"));
        solicitation.setPreferredStartDate(toLocalDate(rs, "preferred_start_date"));
        solicitation.setPreferredEndDate(toLocalDate(rs, "preferred_end_date"));
        solicitation.setPreferredTimeSlot(rs.getString("preferred_time_slot"));
        solicitation.setAccessRestrictions(rs.getString("access_restrictions"));
        solicitation.setSpecialInstructions(rs.getString("special_instructions"));
        solicitation.setContactName(rs.getString("contact_name"));
        solicitation.setContactTitle(rs.getString("contact_title"));
        solicitation.setContactEmail(rs.getString("contact_email"));
        solicitation.setContactPhone(rs.getString("contact_phone"));
        solicitation.setAlternateContactName(rs.getString("alternate_contact_name"));
        solicitation.setAlternateContactPhone(rs.getString("alternate_contact_phone"));
        solicitation.setWebsite(rs.getString("website"));
        solicitation.setAgreedToTerms(toBoolean(rs, "agreed_to_terms"));
        solicitation.setSolved(toBoolean(rs, "solved"));
        solicitation.setCompanyId(toLong(rs, "company_id"));
        solicitation.setCreatedAt(toLocalDateTime(rs, "created_at"));
        return solicitation;
    }

    private static Integer toInteger(ResultSet rs, String column) throws SQLException {
        int value = rs.getInt(column);
        return rs.wasNull() ? null : value;
    }

    private static Long toLong(ResultSet rs, String column) throws SQLException {
        long value = rs.getLong(column);
        return rs.wasNull() ? null : value;
    }

    private static Boolean toBoolean(ResultSet rs, String column) throws SQLException {
        boolean value = rs.getBoolean(column);
        return rs.wasNull() ? null : value;
    }

    private static LocalDate toLocalDate(ResultSet rs, String column) throws SQLException {
        Date value = rs.getDate(column);
        return value != null ? value.toLocalDate() : null;
    }

    private static LocalDateTime toLocalDateTime(ResultSet rs, String column) throws SQLException {
        Timestamp value = rs.getTimestamp(column);
        return value != null ? value.toLocalDateTime() : null;
    }

    private static void setNullableInteger(PreparedStatement statement, int index, Integer value) throws SQLException {
        if (value == null) {
            statement.setNull(index, Types.INTEGER);
        } else {
            statement.setInt(index, value);
        }
    }

    private static void setNullableLong(PreparedStatement statement, int index, Long value) throws SQLException {
        if (value == null) {
            statement.setNull(index, Types.BIGINT);
        } else {
            statement.setLong(index, value);
        }
    }

    private static void setNullableBoolean(PreparedStatement statement, int index, Boolean value) throws SQLException {
        if (value == null) {
            statement.setNull(index, Types.BOOLEAN);
        } else {
            statement.setBoolean(index, value);
        }
    }

    private static void setNullableDate(PreparedStatement statement, int index, LocalDate value) throws SQLException {
        if (value == null) {
            statement.setNull(index, Types.DATE);
        } else {
            statement.setDate(index, Date.valueOf(value));
        }
    }
}
