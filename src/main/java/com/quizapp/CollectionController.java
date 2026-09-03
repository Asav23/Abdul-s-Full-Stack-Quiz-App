package com.quizapp;

import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/collections")
public class CollectionController {

    private final CollectionService collectionService;

    public CollectionController(CollectionService collectionService) {
        this.collectionService = collectionService;
    }

    @GetMapping
    public List<Collection> getAllCollections() {
        return collectionService.getAllCollections();
    }

    @GetMapping("/{id}")
    public Collection getCollectionById(@PathVariable Long id) {
        return collectionService.getCollectionById(id);
    }

    @PostMapping
    public Collection createCollection(@RequestBody Map<String, String> body) {
        return collectionService.createCollection(body.get("name"));
    }

    @PutMapping("/{id}")
    public Collection renameCollection(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return collectionService.renameCollection(id, body.get("name"));
    }

    @DeleteMapping("/{id}")
    public void deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
    }

    @PostMapping("/{id}/quizzes/{quizId}")
    public Collection addQuizToCollection(@PathVariable Long id, @PathVariable Long quizId) {
        return collectionService.addQuizToCollection(id, quizId);
    }

    @DeleteMapping("/{id}/quizzes/{quizId}")
    public Collection removeQuizFromCollection(@PathVariable Long id, @PathVariable Long quizId) {
        return collectionService.removeQuizFromCollection(id, quizId);
    }
}
