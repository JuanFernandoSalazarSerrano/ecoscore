package com.fsalazar.company.service;

import com.fsalazar.company.model.Company;

import java.util.List;
import java.util.Optional;

public interface CompanyService {

    List<Company> getAllCompanies();

    Optional<Company> getCompanyById(Long id);
}
