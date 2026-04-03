package com.fsalazar.unihikerdb.dto;

import java.math.BigDecimal;

public record SensorReadingRequest(
        BigDecimal temp_c,
        BigDecimal temp_f,
        BigDecimal humidity
) {
}
