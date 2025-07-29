package com.quizapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.*;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/collections")
@CrossOrigin(origins = "*") // Optional: allow frontend access
public class CollectionController {

    private final CollectionService collectionService;
    private final QuizService quizService;

    @Autowired
    public CollectionController(CollectionService collectionService, QuizService quizService) {
        this.collectionService = collectionService;
        this.quizService = quizService;
    }

    // Get all collections
    @GetMapping
    public List<Collection> getAllCollections() {
        return collectionService.getAllCollections();
    }

    // Get collection by ID
    @GetMapping("/{id}")
    public Collection getCollectionById(@PathVariable Long id) {
        return collectionService.getCollectionById(id);
    }

    // ✅ NEW: Get full collection with quizzes and questions
    @GetMapping("/{id}/full")
    public Map<String, Object> getCollectionWithFullQuizzes(@PathVariable Long id) {
        Collection collection = collectionService.getCollectionById(id);

        // If collection stores quiz IDs
        List<Long> quizIds = collection.getQuizzes();

        // Fetch full quizzes from the quiz service
        List<Quiz> fullQuizzes = quizIds.stream()
                .map(quizService::getQuizById)
                .collect(Collectors.toList());

        // Build response map
        Map<String, Object> response = new HashMap<>();
        response.put("collection", collection);
        response.put("quizzes", fullQuizzes);

        return response;
    }

    // Create new collection
    @PostMapping
    public void createCollection(@RequestBody Collection collection) {
        collectionService.createCollection(collection);
    }

    // Update a collection
    @PutMapping("/{id}")
    public Collection updateCollection(@PathVariable Long id, @RequestBody Collection updated) {
        return collectionService.updateCollection(id, updated);
    }

    // Delete a collection
    @DeleteMapping("/{id}")
    public void deleteCollection(@PathVariable Long id) {
        collectionService.deleteCollection(id);
    }
}
