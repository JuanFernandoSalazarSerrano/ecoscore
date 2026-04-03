package com.fsalazar.unihikerdb.service.impl;

import com.fsalazar.unihikerdb.dto.InterviewAnswerRequest;
import com.fsalazar.unihikerdb.dto.SensorReadingRequest;
import com.fsalazar.unihikerdb.repository.SensorReadingRepository;
import com.fsalazar.unihikerdb.service.SensorReadingService;
import org.springframework.stereotype.Service;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.List;
@Service
public class SensorReadingServiceImpl implements SensorReadingService {

    private final SensorReadingRepository sensorReadingRepository;

    public SensorReadingServiceImpl(SensorReadingRepository sensorReadingRepository) {
        this.sensorReadingRepository = sensorReadingRepository;
    }

    @Override
    public int saveReading(SensorReadingRequest request) {
        if (request == null || request.temp_c() == null || request.temp_f() == null || request.humidity() == null) {
            throw new IllegalArgumentException("temp_c, temp_f and humidity are required");
        }

        return sensorReadingRepository.insertReading(
                request.temp_c(),
                request.temp_f(),
                request.humidity()
        );
    }

    @Override
    public int saveInterviewAnswer(InterviewAnswerRequest request) {
        if (request == null || request.value() == null) {
            throw new IllegalArgumentException("value is required");
        }

        if (request.value() != 0 && request.value() != 1) {
            throw new IllegalArgumentException("value must be 0 or 1");
        }

        return sensorReadingRepository.insertInterviewAnswer(request.value());
    }

    @Override
    public BigDecimal averageLastTempC(int limit) {
        List<BigDecimal> temps = sensorReadingRepository.findLastTempC(limit);
        return calculateAverage(temps);
    }

    @Override
    public BigDecimal averageLastHumidity(int limit) {
        List<BigDecimal> humidities = sensorReadingRepository.findLastHumidity(limit);
        return calculateAverage(humidities);
    }

    private BigDecimal calculateAverage(List<BigDecimal> values) {
        if (values == null || values.isEmpty()) return null;

        BigDecimal sum = BigDecimal.ZERO;
        int count = 0;
        for (BigDecimal value : values) {
            if (value != null) {
                sum = sum.add(value);
                count++;
            }
        }

        if (count == 0) return null;

        return sum.divide(BigDecimal.valueOf(count), 2, RoundingMode.HALF_UP);
    }
}
