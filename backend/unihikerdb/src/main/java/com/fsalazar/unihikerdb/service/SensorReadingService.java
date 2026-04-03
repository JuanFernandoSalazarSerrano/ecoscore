package com.fsalazar.unihikerdb.service;

import com.fsalazar.unihikerdb.dto.SensorReadingRequest;
import com.fsalazar.unihikerdb.dto.InterviewAnswerRequest;
import java.math.BigDecimal;

public interface SensorReadingService {

    int saveReading(SensorReadingRequest request);

    int saveInterviewAnswer(InterviewAnswerRequest request);

    /**
     * Compute the average of the last N temp_c readings. Returns null if no readings.
     */
    BigDecimal averageLastTempC(int limit);

    /**
     * Convenience: average of last 5 readings.
     */
    default BigDecimal averageLastTempC() {
        return averageLastTempC(5);
    }

    /**
     * Compute the average of the last N humidity readings. Returns null if no readings.
     */
    BigDecimal averageLastHumidity(int limit);

    /**
     * Convenience: average humidity of last 5 readings.
     */
    default BigDecimal averageLastHumidity() {
        return averageLastHumidity(5);
    }
}
