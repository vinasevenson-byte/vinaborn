package com.curitiba360.curitiba360_api.controller;

import com.curitiba360.curitiba360_api.model.Attraction;
import com.curitiba360.curitiba360_api.repository.AttractionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/attractions")
@RequiredArgsConstructor
public class AttractionController {

    private final AttractionRepository attractionRepository;

    @GetMapping
    public ResponseEntity<List<Attraction>> getAllAttractions(@RequestParam(required = false) String category) {
        if (category != null && !category.isBlank()) {
            return ResponseEntity.ok(attractionRepository.findByCategoryAndActiveTrue(category.toUpperCase()));
        }
        return ResponseEntity.ok(attractionRepository.findByActiveTrue());
    }

    @GetMapping("/featured")
    public ResponseEntity<List<Attraction>> getFeaturedAttractions() {
        return ResponseEntity.ok(attractionRepository.findByFeaturedTrueAndActiveTrue());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Attraction> getAttractionById(@PathVariable Long id) {
        return attractionRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/slug/{slug}")
    public ResponseEntity<Attraction> getAttractionBySlug(@PathVariable String slug) {
        return attractionRepository.findBySlug(slug)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public ResponseEntity<Attraction> createAttraction(@RequestBody Attraction attraction) {
        if (attraction.getSlug() == null || attraction.getSlug().isBlank()) {
            attraction.setSlug(attraction.getName().toLowerCase().replaceAll("[^a-z0-9]+", "-"));
        }
        Attraction saved = attractionRepository.save(attraction);
        return ResponseEntity.ok(saved);
    }
}
