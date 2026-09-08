package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Role;
import com.curitiba360.curitiba360_api.model.User;
import com.curitiba360.curitiba360_api.repository.UserRepository;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping
    public ResponseEntity<List<User>> getAllUsers(
            @RequestParam(required = false) String role,
            @RequestParam(required = false) String query
    ) {
        List<User> users = userRepository.findAll();

        return ResponseEntity.ok(users.stream().filter(u -> {
            boolean matchRole = role == null || role.isBlank() || role.equalsIgnoreCase("ALL") ||
                    u.getRole().name().equalsIgnoreCase(role);
            boolean matchQuery = query == null || query.isBlank() ||
                    u.getName().toLowerCase().contains(query.toLowerCase()) ||
                    u.getEmail().toLowerCase().contains(query.toLowerCase()) ||
                    (u.getCpf() != null && u.getCpf().contains(query));
            return matchRole && matchQuery;
        }).toList());
    }

    @PostMapping
    public ResponseEntity<?> createUser(@RequestBody CreateUserRequest request) {
        if (request.getEmail() == null || request.getEmail().isBlank()) {
            return ResponseEntity.badRequest().body(Map.of("message", "E-mail é obrigatório"));
        }

        if (userRepository.findByEmail(request.getEmail().trim().toLowerCase()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Já existe um usuário com este e-mail"));
        }

        Role roleEnum = Role.TOURIST;
        try {
            if (request.getRole() != null) {
                roleEnum = Role.valueOf(request.getRole().toUpperCase());
            }
        } catch (Exception ignored) {}

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail().trim().toLowerCase())
                .password(passwordEncoder.encode(request.getPassword() != null ? request.getPassword() : "cwb360@123"))
                .cpf(request.getCpf())
                .phone(request.getPhone())
                .role(roleEnum)
                .active(true)
                .build();

        User saved = userRepository.save(user);
        return ResponseEntity.ok(saved);
    }

    @PutMapping("/{id}/toggle-status")
    public ResponseEntity<?> toggleUserStatus(@PathVariable Long id) {
        return userRepository.findById(id).map(user -> {
            user.setActive(!user.isActive());
            userRepository.save(user);
            return ResponseEntity.ok(user);
        }).orElse(ResponseEntity.notFound().build());
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateUserRole(@PathVariable Long id, @RequestBody Map<String, String> body) {
        String newRole = body.get("role");
        return userRepository.findById(id).map(user -> {
            try {
                user.setRole(Role.valueOf(newRole.toUpperCase()));
                userRepository.save(user);
                return ResponseEntity.ok(user);
            } catch (Exception e) {
                return ResponseEntity.badRequest().body(Map.of("message", "Perfil inválido"));
            }
        }).orElse(ResponseEntity.notFound().build());
    }

    @Data
    public static class CreateUserRequest {
        private String name;
        private String email;
        private String password;
        private String cpf;
        private String phone;
        private String role;
    }
}
