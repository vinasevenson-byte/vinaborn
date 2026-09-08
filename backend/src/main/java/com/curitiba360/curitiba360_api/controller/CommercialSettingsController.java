package com.curitiba360.curitiba360_api.controller;

import lombok.Data;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class CommercialSettingsController {

    private static final Map<String, Object> SETTINGS = new HashMap<>(Map.of(
            "serviceFeePercentage", new BigDecimal("10.00"), // Taxa da plataforma 10%
            "pixFeeRate", new BigDecimal("0.99"), // 0.99% PIX
            "creditCardFeeRate", new BigDecimal("2.89"), // 2.89% Cartão
            "refundDeadlineDays", 7, // 7 dias CDC
            "maxTicketsPerCpfPerMonth", 6, // RN-038 Anti-cambista
            "maxTransfersPerTicket", 2, // RN-038
            "docusignEnabled", true,
            "docusignAccountId", "DOCU-ACC-4892-CWB",
            "gatewayEnvironment", "PRODUCTION",
            "curitibaIssPercentage", new BigDecimal("2.00")
    ));

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(SETTINGS);
    }

    @PutMapping
    public ResponseEntity<Map<String, Object>> updateSettings(@RequestBody Map<String, Object> newSettings) {
        SETTINGS.putAll(newSettings);
        return ResponseEntity.ok(SETTINGS);
    }
}
