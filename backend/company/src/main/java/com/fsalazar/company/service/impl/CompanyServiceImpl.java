package com.fsalazar.company.service.impl;

import com.fsalazar.company.model.Company;
import com.fsalazar.company.repository.CompanyRepository;
import com.fsalazar.company.service.CompanyService;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class CompanyServiceImpl implements CompanyService {

    private final CompanyRepository companyRepository;

    public CompanyServiceImpl(CompanyRepository companyRepository) {
        this.companyRepository = companyRepository;
    }

    @Override
    public List<Company> getAllCompanies() {
        return companyRepository.findAll();
    }

    @Override
    @PreAuthorize("""
        authentication != null &&
        authentication.tokenAttributes['company_id'] != null &&
        #id == T(java.lang.Long).valueOf(authentication.tokenAttributes['company_id'].toString())
    """)
    public Optional<Company> getCompanyById(Long id) {
        return companyRepository.findById(id);
    }
}
