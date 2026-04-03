package com.fsalazar.unihikerdb.repository;

import java.math.BigDecimal;
import java.util.List;

public interface SensorReadingRepository {

    int insertReading(BigDecimal tempC, BigDecimal tempF, BigDecimal humidity);

    int insertInterviewAnswer(Integer value);

    List<BigDecimal> findLastTempC(int limit);

    List<BigDecimal> findLastHumidity(int limit);
}
