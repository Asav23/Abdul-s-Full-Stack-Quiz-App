package com.quizapp;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CollectionService {

    public static final int MAX_QUIZZES_PER_COLLECTION = 7;

    private final CollectionRepository collectionRepository;
    private final QuizRepository quizRepository;

    public CollectionService(CollectionRepository collectionRepository, QuizRepository quizRepository) {
        this.collectionRepository = collectionRepository;
        this.quizRepository = quizRepository;
    }

    public List<Collection> getAllCollections() {
        return collectionRepository.findAll();
    }

    public Collection getCollectionById(Long id) {
        return collectionRepository.findById(id)
                .orElseThrow(() -> new IllegalStateException("No collection found with ID: " + id));
    }

    public Collection createCollection(String name) {
        Collection collection = new Collection(name);
        return collectionRepository.save(collection);
    }

    public void deleteCollection(Long id) {
        collectionRepository.deleteById(id);
    }

    public Collection renameCollection(Long id, String name) {
        Collection collection = getCollectionById(id);
        collection.setName(name);
        return collectionRepository.save(collection);
    }

    public Collection addQuizToCollection(Long collectionId, Long quizId) {
        Collection collection = getCollectionById(collectionId);
        Quiz quiz = quizRepository.findById(quizId)
                .orElseThrow(() -> new IllegalStateException("No quiz found with ID: " + quizId));

        if (collection.getQuizzes().stream().anyMatch(q -> q.getId().equals(quizId))) {
            throw new IllegalArgumentException("Quiz is already in this collection");
        }
        if (collection.getQuizzes().size() >= MAX_QUIZZES_PER_COLLECTION) {
            throw new IllegalArgumentException("A collection can hold at most " + MAX_QUIZZES_PER_COLLECTION + " quizzes");
        }

        collection.getQuizzes().add(quiz);
        return collectionRepository.save(collection);
    }

    public Collection removeQuizFromCollection(Long collectionId, Long quizId) {
        Collection collection = getCollectionById(collectionId);
        collection.getQuizzes().removeIf(q -> q.getId().equals(quizId));
        return collectionRepository.save(collection);
    }
}
