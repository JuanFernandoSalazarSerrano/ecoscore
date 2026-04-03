package com.fsalazar.unihikerdb.controller;

import com.fsalazar.unihikerdb.service.TestNumberService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping("/api/test")
public class TestNumberController {

    private final TestNumberService testNumberService;

    public TestNumberController(TestNumberService testNumberService) {
        this.testNumberService = testNumberService;
    }

    @GetMapping("/savenumber")
    public ResponseEntity<Map<String, Object>> saveNumber28() {
        int savedNumber = testNumberService.saveNumber28();
        return ResponseEntity.ok(Map.of(
                "message", "Number saved successfully",
                "number", savedNumber
        ));
    }
}
