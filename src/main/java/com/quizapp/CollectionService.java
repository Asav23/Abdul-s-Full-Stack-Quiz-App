package com.quizapp;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectionService {

    private final CollectionRepository repository;

    @Autowired
    public CollectionService(CollectionRepository repository) {
        this.repository = repository;
    }

    public List<Collection> getAllCollections() {
        return repository.findAll();
    }

    public Collection getCollectionById(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No collection found with ID: " + id));
    }

    public Collection updateCollection(Long id, Collection updated) {
        Collection existing = getCollectionById(id);
        existing.setName(updated.getName());

        existing.setQuizzes(updated.getQuizzes());
        return repository.save(existing);
    }

    public void createCollection(Collection collection) {
        repository.save(collection);
    }

    public void deleteCollection(Long id) {
        repository.deleteById(id);
    }
}
