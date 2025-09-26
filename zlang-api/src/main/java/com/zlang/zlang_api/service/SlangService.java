package com.zlang.zlang_api.service;

import com.zlang.zlang_api.dto.LeaderboardDTO;
import com.zlang.zlang_api.dto.SlangRequest;
import com.zlang.zlang_api.dto.SlangResponseDTO;
import com.zlang.zlang_api.model.Slang;
import com.zlang.zlang_api.model.User;
import com.zlang.zlang_api.repository.SlangRepository;
import com.zlang.zlang_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Sort;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.aggregation.Aggregation;
import org.springframework.data.mongodb.core.aggregation.AggregationResults;
import org.springframework.data.mongodb.core.aggregation.GroupOperation;
import org.springframework.data.mongodb.core.aggregation.SortOperation;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class SlangService {

    private final SlangRepository slangRepository;
    private final UserRepository userRepository;
    private final MongoTemplate mongoTemplate;

    private List<SlangResponseDTO> populateAuthorNames(List<Slang> slangs) {
        List<String> authorIds = slangs.stream()
                .map(Slang::getAuthorId)
                .distinct()
                .collect(Collectors.toList());

        Map<String, String> authorIdToNameMap = userRepository.findAllById(authorIds).stream()
                .collect(Collectors.toMap(User::getId, User::getName));

        return slangs.stream()
                .map(slang -> SlangResponseDTO.from(slang, authorIdToNameMap.getOrDefault(slang.getAuthorId(), "Unknown")))
                .collect(Collectors.toList());
    }

    public List<SlangResponseDTO> search(String query) {
        List<Slang> slangs = slangRepository.findByTermContainingIgnoreCase(query);
        return populateAuthorNames(slangs);
    }

    public Slang create(SlangRequest request, User currentUser) {
        Slang newSlang = new Slang();
        newSlang.setTerm(request.getTerm());
        newSlang.setMeaning(request.getMeaning());
        newSlang.setExample(request.getExample());
        newSlang.setAuthorId(currentUser.getId());
        return slangRepository.save(newSlang);
    }

    public Slang update(String id, SlangRequest request, User currentUser) {
        Slang existingSlang = slangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slang not found with id: " + id));

        if (!existingSlang.getAuthorId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to edit this slang.");
        }

        existingSlang.setTerm(request.getTerm());
        existingSlang.setMeaning(request.getMeaning());
        existingSlang.setExample(request.getExample());
        return slangRepository.save(existingSlang);
    }

    public void delete(String id, User currentUser) {
        Slang existingSlang = slangRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Slang not found with id: " + id));

        if (!existingSlang.getAuthorId().equals(currentUser.getId())) {
            throw new AccessDeniedException("You do not have permission to delete this slang.");
        }

        slangRepository.delete(existingSlang);
    }

    public void saveSlang(String slangId, User currentUser) {
        slangRepository.findById(slangId).orElseThrow(() -> new RuntimeException("Slang not found"));
        if (!currentUser.getSavedSlangIds().contains(slangId)) {
            currentUser.getSavedSlangIds().add(slangId);
            userRepository.save(currentUser);
        }
    }

    public void unsaveSlang(String slangId, User currentUser) {
        currentUser.getSavedSlangIds().remove(slangId);
        userRepository.save(currentUser);
    }

    public List<SlangResponseDTO> getSavedSlangs(User currentUser) {
        List<Slang> slangs = slangRepository.findAllById(currentUser.getSavedSlangIds());
        return populateAuthorNames(slangs);
    }

    public List<SlangResponseDTO> getMySlangs(User currentUser) {
        List<Slang> slangs = slangRepository.findByAuthorId(currentUser.getId());
        return populateAuthorNames(slangs);
    }

    public Slang upvoteSlang(String slangId, User currentUser) {
        Slang slang = slangRepository.findById(slangId)
                .orElseThrow(() -> new RuntimeException("Slang not found"));

        String userId = currentUser.getId();
        slang.getDownvotedBy().remove(userId);

        if (slang.getUpvotedBy().contains(userId)) {
            slang.getUpvotedBy().remove(userId);
        } else {
            slang.getUpvotedBy().add(userId);
        }
        return slangRepository.save(slang);
    }

    public Slang downvoteSlang(String slangId, User currentUser) {
        Slang slang = slangRepository.findById(slangId)
                .orElseThrow(() -> new RuntimeException("Slang not found"));

        String userId = currentUser.getId();
        slang.getUpvotedBy().remove(userId);

        if (slang.getDownvotedBy().contains(userId)) {
            slang.getDownvotedBy().remove(userId);
        } else {
            slang.getDownvotedBy().add(userId);
        }
        return slangRepository.save(slang);
    }

    public List<LeaderboardDTO> getLeaderboard() {
        GroupOperation groupByAuthor = Aggregation.group("authorId").count().as("slangCount");
        SortOperation sortByCount = Aggregation.sort(Sort.Direction.DESC, "slangCount");
        Aggregation aggregation = Aggregation.newAggregation(groupByAuthor, sortByCount);

        AggregationResults<Map> results = mongoTemplate.aggregate(aggregation, "slangs", Map.class);
        List<Map> mappedResults = results.getMappedResults();

        List<String> authorIds = mappedResults.stream()
                .map(res -> (String) res.get("_id"))
                .collect(Collectors.toList());
        Map<String, String> authorIdToNameMap = userRepository.findAllById(authorIds).stream()
                .collect(Collectors.toMap(User::getId, User::getName));

        return mappedResults.stream()
                .map(res -> new LeaderboardDTO(
                        authorIdToNameMap.getOrDefault((String) res.get("_id"), "Unknown User"),
                        ((Number) res.get("slangCount")).longValue()
                ))
                .collect(Collectors.toList());
    }
}