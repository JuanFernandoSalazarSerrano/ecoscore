package com.fsalazar.unihikerdb.model;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public class Audit {

    private Long id;
    private String deviceId;
    private String companyName;
    private BigDecimal tempC;
    private String tempCDesc;
    private BigDecimal tempF;
    private String tempFDesc;
    private BigDecimal humidity;
    private String humidityDesc;
    private String accelerometer;
    private String accelerometerDesc;
    private String light;
    private String lightDesc;
    private String questions;
    private String questionsDesc;
    private String calidadaire;
    private String calidadaireDesc;
    private String riesgobiologico;
    private String riesgobiologicoDesc;
    private String materialespeligrosos;
    private String materialespeligrososDesc;
    private String gestionresiduos;
    private String gestionresiduosDesc;
    private BigDecimal consumoenergetico;
    private String consumoenergeticoDesc;
    private String biodiversidad;
    private String biodiversidadDesc;
    private String gestionagua;
    private String gestionaguaDesc;
    private String contaminacionauditiva;
    private String contaminacionauditivaDesc;
    private String conclusions;
    private LocalDateTime createdAt;

    public Audit() {
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public BigDecimal getTempC() {
        return tempC;
    }

    public void setTempC(BigDecimal tempC) {
        this.tempC = tempC;
    }

    public String getTempCDesc() {
        return tempCDesc;
    }

    public void setTempCDesc(String tempCDesc) {
        this.tempCDesc = tempCDesc;
    }

    public BigDecimal getTempF() {
        return tempF;
    }

    public void setTempF(BigDecimal tempF) {
        this.tempF = tempF;
    }

    public String getTempFDesc() {
        return tempFDesc;
    }

    public void setTempFDesc(String tempFDesc) {
        this.tempFDesc = tempFDesc;
    }

    public BigDecimal getHumidity() {
        return humidity;
    }

    public void setHumidity(BigDecimal humidity) {
        this.humidity = humidity;
    }

    public String getHumidityDesc() {
        return humidityDesc;
    }

    public void setHumidityDesc(String humidityDesc) {
        this.humidityDesc = humidityDesc;
    }

    public String getAccelerometer() {
        return accelerometer;
    }

    public void setAccelerometer(String accelerometer) {
        this.accelerometer = accelerometer;
    }

    public String getAccelerometerDesc() {
        return accelerometerDesc;
    }

    public void setAccelerometerDesc(String accelerometerDesc) {
        this.accelerometerDesc = accelerometerDesc;
    }

    public String getLight() {
        return light;
    }

    public void setLight(String light) {
        this.light = light;
    }

    public String getLightDesc() {
        return lightDesc;
    }

    public void setLightDesc(String lightDesc) {
        this.lightDesc = lightDesc;
    }

    public String getQuestions() {
        return questions;
    }

    public void setQuestions(String questions) {
        this.questions = questions;
    }

    public String getQuestionsDesc() {
        return questionsDesc;
    }

    public void setQuestionsDesc(String questionsDesc) {
        this.questionsDesc = questionsDesc;
    }

    public String getCalidadaire() {
        return calidadaire;
    }

    public void setCalidadaire(String calidadaire) {
        this.calidadaire = calidadaire;
    }

    public String getCalidadaireDesc() {
        return calidadaireDesc;
    }

    public void setCalidadaireDesc(String calidadaireDesc) {
        this.calidadaireDesc = calidadaireDesc;
    }

    public String getRiesgobiologico() {
        return riesgobiologico;
    }

    public void setRiesgobiologico(String riesgobiologico) {
        this.riesgobiologico = riesgobiologico;
    }

    public String getRiesgobiologicoDesc() {
        return riesgobiologicoDesc;
    }

    public void setRiesgobiologicoDesc(String riesgobiologicoDesc) {
        this.riesgobiologicoDesc = riesgobiologicoDesc;
    }

    public String getMaterialespeligrosos() {
        return materialespeligrosos;
    }

    public void setMaterialespeligrosos(String materialespeligrosos) {
        this.materialespeligrosos = materialespeligrosos;
    }

    public String getMaterialespeligrososDesc() {
        return materialespeligrososDesc;
    }

    public void setMaterialespeligrososDesc(String materialespeligrososDesc) {
        this.materialespeligrososDesc = materialespeligrososDesc;
    }

    public String getGestionresiduos() {
        return gestionresiduos;
    }

    public void setGestionresiduos(String gestionresiduos) {
        this.gestionresiduos = gestionresiduos;
    }

    public String getGestionresiduosDesc() {
        return gestionresiduosDesc;
    }

    public void setGestionresiduosDesc(String gestionresiduosDesc) {
        this.gestionresiduosDesc = gestionresiduosDesc;
    }

    public BigDecimal getConsumoenergetico() {
        return consumoenergetico;
    }

    public void setConsumoenergetico(BigDecimal consumoenergetico) {
        this.consumoenergetico = consumoenergetico;
    }

    public String getConsumoenergeticoDesc() {
        return consumoenergeticoDesc;
    }

    public void setConsumoenergeticoDesc(String consumoenergeticoDesc) {
        this.consumoenergeticoDesc = consumoenergeticoDesc;
    }

    public String getBiodiversidad() {
        return biodiversidad;
    }

    public void setBiodiversidad(String biodiversidad) {
        this.biodiversidad = biodiversidad;
    }

    public String getBiodiversidadDesc() {
        return biodiversidadDesc;
    }

    public void setBiodiversidadDesc(String biodiversidadDesc) {
        this.biodiversidadDesc = biodiversidadDesc;
    }

    public String getGestionagua() {
        return gestionagua;
    }

    public void setGestionagua(String gestionagua) {
        this.gestionagua = gestionagua;
    }

    public String getGestionaguaDesc() {
        return gestionaguaDesc;
    }

    public void setGestionaguaDesc(String gestionaguaDesc) {
        this.gestionaguaDesc = gestionaguaDesc;
    }

    public String getContaminacionauditiva() {
        return contaminacionauditiva;
    }

    public void setContaminacionauditiva(String contaminacionauditiva) {
        this.contaminacionauditiva = contaminacionauditiva;
    }

    public String getContaminacionauditivaDesc() {
        return contaminacionauditivaDesc;
    }

    public void setContaminacionauditivaDesc(String contaminacionauditivaDesc) {
        this.contaminacionauditivaDesc = contaminacionauditivaDesc;
    }

    public String getConclusions() {
        return conclusions;
    }

    public void setConclusions(String conclusions) {
        this.conclusions = conclusions;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
