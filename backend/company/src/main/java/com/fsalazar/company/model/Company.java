package com.fsalazar.company.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;

@Entity
@Table(name = "company")
public class Company {

    @Id
    private Long id;

    @Column(nullable = false, length = 255)
    private String name;

    private String industry;

    @Column(name = "is_verified")
    private Boolean verified;

    private String website;

    @Column(columnDefinition = "TEXT")
    private String description;

    private String city;
    private String state;
    private String country;

    @Column(name = "overall_score")
    private Integer overallScore;

    @Column(name = "score_label")
    private String scoreLabel;

    @Column(name = "carbon_score")
    private Integer carbonScore;

    @Column(name = "water_score")
    private Integer waterScore;

    @Column(name = "energy_score")
    private Integer energyScore;

    @Column(name = "waste_score")
    private Integer wasteScore;

    private Integer employees;

    @Column(name = "employees_growth_pct", precision = 10, scale = 2)
    private BigDecimal employeesGrowthPct;

    @Column(name = "esg_allocation_pct", precision = 10, scale = 2)
    private BigDecimal esgAllocationPct;

    @Column(name = "esg_allocation_growth_pct", precision = 10, scale = 2)
    private BigDecimal esgAllocationGrowthPct;

    @Column(name = "green_projects")
    private Integer greenProjects;

    @Column(name = "green_projects_growth")
    private Integer greenProjectsGrowth;

    public Company() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public Boolean getVerified() {
        return verified;
    }

    public void setVerified(Boolean verified) {
        this.verified = verified;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getCity() {
        return city;
    }

    public void setCity(String city) {
        this.city = city;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }

    public String getCountry() {
        return country;
    }

    public void setCountry(String country) {
        this.country = country;
    }

    public Integer getOverallScore() {
        return overallScore;
    }

    public void setOverallScore(Integer overallScore) {
        this.overallScore = overallScore;
    }

    public String getScoreLabel() {
        return scoreLabel;
    }

    public void setScoreLabel(String scoreLabel) {
        this.scoreLabel = scoreLabel;
    }

    public Integer getCarbonScore() {
        return carbonScore;
    }

    public void setCarbonScore(Integer carbonScore) {
        this.carbonScore = carbonScore;
    }

    public Integer getWaterScore() {
        return waterScore;
    }

    public void setWaterScore(Integer waterScore) {
        this.waterScore = waterScore;
    }

    public Integer getEnergyScore() {
        return energyScore;
    }

    public void setEnergyScore(Integer energyScore) {
        this.energyScore = energyScore;
    }

    public Integer getWasteScore() {
        return wasteScore;
    }

    public void setWasteScore(Integer wasteScore) {
        this.wasteScore = wasteScore;
    }

    public Integer getEmployees() {
        return employees;
    }

    public void setEmployees(Integer employees) {
        this.employees = employees;
    }

    public BigDecimal getEmployeesGrowthPct() {
        return employeesGrowthPct;
    }

    public void setEmployeesGrowthPct(BigDecimal employeesGrowthPct) {
        this.employeesGrowthPct = employeesGrowthPct;
    }

    public BigDecimal getEsgAllocationPct() {
        return esgAllocationPct;
    }

    public void setEsgAllocationPct(BigDecimal esgAllocationPct) {
        this.esgAllocationPct = esgAllocationPct;
    }

    public BigDecimal getEsgAllocationGrowthPct() {
        return esgAllocationGrowthPct;
    }

    public void setEsgAllocationGrowthPct(BigDecimal esgAllocationGrowthPct) {
        this.esgAllocationGrowthPct = esgAllocationGrowthPct;
    }

    public Integer getGreenProjects() {
        return greenProjects;
    }

    public void setGreenProjects(Integer greenProjects) {
        this.greenProjects = greenProjects;
    }

    public Integer getGreenProjectsGrowth() {
        return greenProjectsGrowth;
    }

    public void setGreenProjectsGrowth(Integer greenProjectsGrowth) {
        this.greenProjectsGrowth = greenProjectsGrowth;
    }
}
