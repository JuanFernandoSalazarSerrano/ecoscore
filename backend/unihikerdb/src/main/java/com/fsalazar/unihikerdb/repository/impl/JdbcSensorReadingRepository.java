package com.fsalazar.unihikerdb.repository.impl;

import com.fsalazar.unihikerdb.repository.SensorReadingRepository;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

@Repository
public class JdbcSensorReadingRepository implements SensorReadingRepository {

    private final JdbcTemplate jdbcTemplate;

    public JdbcSensorReadingRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public int insertReading(BigDecimal tempC, BigDecimal tempF, BigDecimal humidity) {
        String sql = "INSERT INTO sensor_readings (temp_c, temp_f, humidity) VALUES (?, ?, ?)";
        return jdbcTemplate.update(sql, tempC, tempF, humidity);
    }

    @Override
    public int insertInterviewAnswer(Integer value) {
        String sql = "INSERT INTO interview_answers (interview_answer) VALUES (?)";
        return jdbcTemplate.update(sql, value);
    }

    @Override
    public List<BigDecimal> findLastTempC(int limit) {
        String sql = "SELECT temp_c FROM sensor_readings ORDER BY id DESC LIMIT ?";
        return jdbcTemplate.queryForList(sql, BigDecimal.class, limit);
    }

    @Override
    public List<BigDecimal> findLastHumidity(int limit) {
        String sql = "SELECT humidity FROM sensor_readings ORDER BY id DESC LIMIT ?";
        return jdbcTemplate.queryForList(sql, BigDecimal.class, limit);
    }
}
