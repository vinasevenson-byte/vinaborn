package com.curitiba360.curitiba360_api.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.*;

@RestController
@RequestMapping("/api/agents")
public class AgentController {

    private static final List<Map<String, Object>> AGENTS = new ArrayList<>();

    static {
        Map<String, Object> a1 = new HashMap<>();
        a1.put("id", 1L);
        a1.put("name", "Rodrigo C. Silveira");
        a1.put("email", "rodrigo.agente@cwbtours.com.br");
        a1.put("cpf", "111.444.777-88");
        a1.put("phone", "(41) 98822-4411");
        a1.put("agencyName", "CWB City Tours");
        a1.put("agencyId", 1L);
        a1.put("agentCode", "AGT-CWB-001");
        a1.put("commissionRate", new BigDecimal("4.00"));
        a1.put("totalSales", new BigDecimal("18450.00"));
        a1.put("active", true);

        Map<String, Object> a2 = new HashMap<>();
        a2.put("id", 2L);
        a2.put("name", "Camila Fagundes");
        a2.put("email", "camila.vendas@cwbtours.com.br");
        a2.put("cpf", "222.555.888-99");
        a2.put("phone", "(41) 99111-3322");
        a2.put("agencyName", "CWB City Tours");
        a2.put("agencyId", 1L);
        a2.put("agentCode", "AGT-CWB-002");
        a2.put("commissionRate", new BigDecimal("5.00"));
        a2.put("totalSales", new BigDecimal("30150.00"));
        a2.put("active", true);

        Map<String, Object> a3 = new HashMap<>();
        a3.put("id", 3L);
        a3.put("name", "Felipe Antunes");
        a3.put("email", "felipe@paranaviagens.com.br");
        a3.put("cpf", "333.666.999-00");
        a3.put("phone", "(41) 99222-6677");
        a3.put("agencyName", "Paraná Viagens");
        a3.put("agencyId", 2L);
        a3.put("agentCode", "AGT-PR-001");
        a3.put("commissionRate", new BigDecimal("4.50"));
        a3.put("totalSales", new BigDecimal("12600.00"));
        a3.put("active", true);

        AGENTS.add(a1);
        AGENTS.add(a2);
        AGENTS.add(a3);
    }

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>> getAllAgents() {
        return ResponseEntity.ok(AGENTS);
    }

    @PostMapping
    public ResponseEntity<?> createAgent(@RequestBody Map<String, Object> agentData) {
        long newId = AGENTS.size() + 1L;
        agentData.put("id", newId);
        agentData.put("active", true);
        agentData.put("totalSales", BigDecimal.ZERO);
        if (!agentData.containsKey("agentCode")) {
            agentData.put("agentCode", "AGT-CWB-" + String.format("%03d", newId));
        }
        AGENTS.add(new HashMap<>(agentData));
        return ResponseEntity.ok(agentData);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleAgentStatus(@PathVariable Long id) {
        for (Map<String, Object> a : AGENTS) {
            if (a.get("id").equals(id)) {
                boolean active = (boolean) a.get("active");
                a.put("active", !active);
                return ResponseEntity.ok(a);
            }
        }
        return ResponseEntity.notFound().build();
    }
}
