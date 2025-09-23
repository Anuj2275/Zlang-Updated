package com.zlang.zlang_api.service;

import com.zlang.zlang_api.dto.SlangRequest;
import com.zlang.zlang_api.model.Slang;
import com.zlang.zlang_api.model.User;
import com.zlang.zlang_api.repository.SlangRepository;
import com.zlang.zlang_api.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SlangService {

    private final SlangRepository slangRepository;
    private final UserRepository userRepository;

    public List<Slang> search(String query) {
        return slangRepository.findByTermContainingIgnoreCase(query);
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

    public List<Slang> getSavedSlangs(User currentUser) {
        return slangRepository.findAllById(currentUser.getSavedSlangIds());
    }

    public List<Slang> getMySlangs(User currentUser) {
        return slangRepository.findByAuthorId(currentUser.getId());
    }
}