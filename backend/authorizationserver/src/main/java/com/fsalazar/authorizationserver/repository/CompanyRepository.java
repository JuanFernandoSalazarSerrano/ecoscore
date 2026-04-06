package com.fsalazar.authorizationserver.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.Repository;
import org.springframework.data.repository.query.Param;

import com.fsalazar.authorizationserver.model.Company;

public interface CompanyRepository extends Repository<Company, Long> {

	@Query("select c.id from Company c where lower(c.name) = lower(:name)")
	Optional<Long> findCompanyIdByNameIgnoreCase(@Param("name") String name);
}
