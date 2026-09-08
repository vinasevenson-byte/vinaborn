package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.AntiScalpingAlert;
import com.curitiba360.curitiba360_api.repository.AntiScalpingRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/anti-scalping")
@RequiredArgsConstructor
public class AntiScalpingController {

    private final AntiScalpingRepository antiScalpingRepository;

    @GetMapping("/alerts")
    public ResponseEntity<List<AntiScalpingAlert>> getAllAlerts() {
        return ResponseEntity.ok(antiScalpingRepository.findAllByOrderByFlaggedAtDesc());
    }

    @PutMapping("/block/{id}")
    public ResponseEntity<?> blockCpf(@PathVariable Long id, @RequestBody(required = false) Map<String, String> body) {
        String adminName = body != null ? body.getOrDefault("blockedBy", "Administrador") : "Administrador";

        return antiScalpingRepository.findById(id).map(alert -> {
            alert.setBlocked(true);
            alert.setRiskLevel("BLOCKED");
            alert.setBlockedAt(LocalDateTime.now());
            alert.setBlockedBy(adminName);
            antiScalpingRepository.save(alert);
            return ResponseEntity.ok(alert);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/unblock/{id}")
    public ResponseEntity<?> unblockCpf(@PathVariable Long id) {
        return antiScalpingRepository.findById(id).map(alert -> {
            alert.setBlocked(false);
            alert.setRiskLevel("LOW");
            alert.setBlockedAt(null);
            alert.setBlockedBy(null);
            antiScalpingRepository.save(alert);
            return ResponseEntity.ok(alert);
        }).orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/stats")
    public ResponseEntity<?> getStats() {
        List<AntiScalpingAlert> all = antiScalpingRepository.findAll();
        long blockedCount = all.stream().filter(AntiScalpingAlert::isBlocked).count();
        long highRiskCount = all.stream().filter(a -> "HIGH".equalsIgnoreCase(a.getRiskLevel())).count();
        int interceptedTickets = all.stream().mapToInt(AntiScalpingAlert::getPurchasesThisMonth).sum();

        return ResponseEntity.ok(Map.of(
                "monitoredCpfs", all.size(),
                "blockedCpfs", blockedCount,
                "highRiskAlerts", highRiskCount,
                "interceptedTickets", interceptedTickets
        ));
    }
}
