package com.fsalazar.unihikerdb.service.impl;

import com.fsalazar.unihikerdb.repository.TestNumberRepository;
import com.fsalazar.unihikerdb.service.TestNumberService;
import org.springframework.stereotype.Service;

@Service
public class TestNumberServiceImpl implements TestNumberService {

    private static final int TEST_NUMBER = 28;

    private final TestNumberRepository testNumberRepository;

    public TestNumberServiceImpl(TestNumberRepository testNumberRepository) {
        this.testNumberRepository = testNumberRepository;
    }

    @Override
    public int saveNumber28() {
        testNumberRepository.insertNumber(TEST_NUMBER);
        return TEST_NUMBER;
    }
}
