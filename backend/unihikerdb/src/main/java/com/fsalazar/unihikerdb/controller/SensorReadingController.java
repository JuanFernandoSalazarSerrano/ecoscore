package com.fsalazar.unihikerdb.controller;

import com.fsalazar.unihikerdb.dto.AccelerometerReadingRequest;
import com.fsalazar.unihikerdb.dto.InterviewAnswerRequest;
import com.fsalazar.unihikerdb.dto.SensorReadingRequest;
import com.fsalazar.unihikerdb.service.SensorReadingService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;

@RestController
@RequestMapping("/api/sensor-readings")
public class SensorReadingController {

    private static final String MESSAGE = "message";

    private final SensorReadingService sensorReadingService;
    private final List<List<BigDecimal>> accelerometerReadings = new CopyOnWriteArrayList<>();

    public SensorReadingController(SensorReadingService sensorReadingService) {
        this.sensorReadingService = sensorReadingService;
    }

    @PostMapping
    public ResponseEntity<Map<String, Object>> createReading(@RequestBody SensorReadingRequest request) {
        try {
            int rows = sensorReadingService.saveReading(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    MESSAGE, "Sensor reading saved",
                    "rowsInserted", rows
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    MESSAGE, e.getMessage()
            ));
        }
    }

    @PostMapping("/interview-answer")
    public ResponseEntity<Map<String, Object>> createInterviewAnswer(@RequestBody InterviewAnswerRequest request) {
        try {
            int rows = sensorReadingService.saveInterviewAnswer(request);
            return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                    MESSAGE, "Interview answer saved",
                    "rowsInserted", rows
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    MESSAGE, e.getMessage()
            ));
        }
    }

    @PostMapping("/accelerometer")
    public ResponseEntity<Map<String, Object>> createAccelerometerReading(
            @RequestBody AccelerometerReadingRequest request
    ) {
        if (request == null || request.values() == null || request.values().size() != 3) {
            return ResponseEntity.badRequest().body(Map.of(
                    MESSAGE, "values must be a list of 3 numbers"
            ));
        }

        for (BigDecimal value : request.values()) {
            if (value == null) {
                return ResponseEntity.badRequest().body(Map.of(
                        MESSAGE, "values must not contain nulls"
                ));
            }
        }

        accelerometerReadings.add(List.copyOf(request.values()));
        return ResponseEntity.status(HttpStatus.CREATED).body(Map.of(
                MESSAGE, "Accelerometer reading saved",
                "reading", request.values(),
                "storedCount", accelerometerReadings.size()
        ));
    }

    @GetMapping("/temperature")
    public ResponseEntity<Map<String, Object>> getAverageTemperature() {
        try {
            var avg = sensorReadingService.averageLastTempC();
            if (avg == null) {
                return ResponseEntity.noContent().build();
            }

                return ResponseEntity.ok(Map.of(
                    "average_c", avg,
                    "unit", "C",
                    "samples_count", 5
                ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(MESSAGE, e.getMessage()));
        }
    }

    @GetMapping("/humidity")
    public ResponseEntity<Map<String, Object>> getAverageHumidity() {
        try {
            var avg = sensorReadingService.averageLastHumidity();
            if (avg == null) {
                return ResponseEntity.noContent().build();
            }

            return ResponseEntity.ok(Map.of(
                    "average_humidity", avg,
                    "unit", "%",
                    "samples_count", 5
            ));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(MESSAGE, e.getMessage()));
        }
    }
}
