package com.fsalazar.unihikerdb.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public class AuditSolicitation {

    private Long id;
    private String facilityName;
    private String facilityType;
    private String facilityDescription;
    private String streetAddress;
    private String city;
    private String state;
    private String country;
    private String postalCode;
    private BigDecimal totalArea;
    private String areaUnit;
    private Integer numberOfFloors;
    private Integer numberOfEmployees;
    private String operatingHours;
    private Integer yearBuilt;
    private Integer lastRenovationYear;
    private String existingCertifications;
    private LocalDate previousAuditDate;
    private String auditTypes;
    private LocalDate preferredStartDate;
    private LocalDate preferredEndDate;
    private String preferredTimeSlot;
    private String accessRestrictions;
    private String specialInstructions;
    private String contactName;
    private String contactTitle;
    private String contactEmail;
    private String contactPhone;
    private String alternateContactName;
    private String alternateContactPhone;
    private String website;
    private Boolean agreedToTerms;
    private Boolean solved;
    private Long companyId;
    private LocalDateTime createdAt;

    public AuditSolicitation() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFacilityName() {
        return facilityName;
    }

    public void setFacilityName(String facilityName) {
        this.facilityName = facilityName;
    }

    public String getFacilityType() {
        return facilityType;
    }

    public void setFacilityType(String facilityType) {
        this.facilityType = facilityType;
    }

    public String getFacilityDescription() {
        return facilityDescription;
    }

    public void setFacilityDescription(String facilityDescription) {
        this.facilityDescription = facilityDescription;
    }

    public String getStreetAddress() {
        return streetAddress;
    }

    public void setStreetAddress(String streetAddress) {
        this.streetAddress = streetAddress;
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

    public String getPostalCode() {
        return postalCode;
    }

    public void setPostalCode(String postalCode) {
        this.postalCode = postalCode;
    }

    public BigDecimal getTotalArea() {
        return totalArea;
    }

    public void setTotalArea(BigDecimal totalArea) {
        this.totalArea = totalArea;
    }

    public String getAreaUnit() {
        return areaUnit;
    }

    public void setAreaUnit(String areaUnit) {
        this.areaUnit = areaUnit;
    }

    public Integer getNumberOfFloors() {
        return numberOfFloors;
    }

    public void setNumberOfFloors(Integer numberOfFloors) {
        this.numberOfFloors = numberOfFloors;
    }

    public Integer getNumberOfEmployees() {
        return numberOfEmployees;
    }

    public void setNumberOfEmployees(Integer numberOfEmployees) {
        this.numberOfEmployees = numberOfEmployees;
    }

    public String getOperatingHours() {
        return operatingHours;
    }

    public void setOperatingHours(String operatingHours) {
        this.operatingHours = operatingHours;
    }

    public Integer getYearBuilt() {
        return yearBuilt;
    }

    public void setYearBuilt(Integer yearBuilt) {
        this.yearBuilt = yearBuilt;
    }

    public Integer getLastRenovationYear() {
        return lastRenovationYear;
    }

    public void setLastRenovationYear(Integer lastRenovationYear) {
        this.lastRenovationYear = lastRenovationYear;
    }

    public String getExistingCertifications() {
        return existingCertifications;
    }

    public void setExistingCertifications(String existingCertifications) {
        this.existingCertifications = existingCertifications;
    }

    public LocalDate getPreviousAuditDate() {
        return previousAuditDate;
    }

    public void setPreviousAuditDate(LocalDate previousAuditDate) {
        this.previousAuditDate = previousAuditDate;
    }

    public String getAuditTypes() {
        return auditTypes;
    }

    public void setAuditTypes(String auditTypes) {
        this.auditTypes = auditTypes;
    }

    public LocalDate getPreferredStartDate() {
        return preferredStartDate;
    }

    public void setPreferredStartDate(LocalDate preferredStartDate) {
        this.preferredStartDate = preferredStartDate;
    }

    public LocalDate getPreferredEndDate() {
        return preferredEndDate;
    }

    public void setPreferredEndDate(LocalDate preferredEndDate) {
        this.preferredEndDate = preferredEndDate;
    }

    public String getPreferredTimeSlot() {
        return preferredTimeSlot;
    }

    public void setPreferredTimeSlot(String preferredTimeSlot) {
        this.preferredTimeSlot = preferredTimeSlot;
    }

    public String getAccessRestrictions() {
        return accessRestrictions;
    }

    public void setAccessRestrictions(String accessRestrictions) {
        this.accessRestrictions = accessRestrictions;
    }

    public String getSpecialInstructions() {
        return specialInstructions;
    }

    public void setSpecialInstructions(String specialInstructions) {
        this.specialInstructions = specialInstructions;
    }

    public String getContactName() {
        return contactName;
    }

    public void setContactName(String contactName) {
        this.contactName = contactName;
    }

    public String getContactTitle() {
        return contactTitle;
    }

    public void setContactTitle(String contactTitle) {
        this.contactTitle = contactTitle;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getContactPhone() {
        return contactPhone;
    }

    public void setContactPhone(String contactPhone) {
        this.contactPhone = contactPhone;
    }

    public String getAlternateContactName() {
        return alternateContactName;
    }

    public void setAlternateContactName(String alternateContactName) {
        this.alternateContactName = alternateContactName;
    }

    public String getAlternateContactPhone() {
        return alternateContactPhone;
    }

    public void setAlternateContactPhone(String alternateContactPhone) {
        this.alternateContactPhone = alternateContactPhone;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public Boolean getAgreedToTerms() {
        return agreedToTerms;
    }

    public void setAgreedToTerms(Boolean agreedToTerms) {
        this.agreedToTerms = agreedToTerms;
    }

    public Boolean getSolved() {
        return solved;
    }

    public void setSolved(Boolean solved) {
        this.solved = solved;
    }

    public Long getCompanyId() {
        return companyId;
    }

    public void setCompanyId(Long companyId) {
        this.companyId = companyId;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
