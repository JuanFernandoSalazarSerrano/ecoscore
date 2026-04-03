package com.fsalazar.unihikerdb.repository.impl;

import com.fsalazar.unihikerdb.repository.TestNumberRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

@Repository
public class JdbcTestNumberRepository implements TestNumberRepository {

    private final JdbcTemplate jdbcTemplate;
    private final String insertSql;

    public JdbcTestNumberRepository(
            JdbcTemplate jdbcTemplate,
            @Value("${app.new-table.insert-sql:INSERT INTO new_table (number) VALUES (?)}") String insertSql
    ) {
        this.jdbcTemplate = jdbcTemplate;
        this.insertSql = insertSql;
    }

    @Override
    public int insertNumber(int value) {
        return jdbcTemplate.update(insertSql, value);
    }
}
