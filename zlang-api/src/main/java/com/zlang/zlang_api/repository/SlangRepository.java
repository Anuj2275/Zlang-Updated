package com.zlang.zlang_api.repository;

import com.zlang.zlang_api.model.Slang;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;

import java.util.List;

public interface SlangRepository extends MongoRepository<Slang, String> {

    @Query("{'term': {$regex: ?0, $options: 'i'}}")
    List<Slang> findByTermRegex(String searchTerm);

    List<Slang> findByTermContainingIgnoreCase(String term);

    List<Slang> findByAuthorId(String authorId);
}