package com.fsalazar.unihikerdb.dto;

import java.math.BigDecimal;
import java.util.List;

public record AccelerometerReadingRequest(
        List<BigDecimal> values
) {
}
