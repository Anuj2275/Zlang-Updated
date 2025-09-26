package com.zlang.zlang_api.controller;

import com.zlang.zlang_api.dto.LeaderboardDTO;
import com.zlang.zlang_api.dto.SlangRequest;
import com.zlang.zlang_api.dto.SlangResponseDTO;
import com.zlang.zlang_api.model.Slang;
import com.zlang.zlang_api.model.User;
import com.zlang.zlang_api.service.SlangService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/slangs")
@RequiredArgsConstructor
public class SlangController {

    private final SlangService slangService;

    @GetMapping("/search")
    public ResponseEntity<List<SlangResponseDTO>> searchSlangs(@RequestParam(defaultValue = "") String query) {
        return ResponseEntity.ok(slangService.search(query));
    }

    @PostMapping
    public ResponseEntity<Slang> createSlang(@RequestBody SlangRequest request, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(slangService.create(request, currentUser));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Slang> updateSlang(
            @PathVariable String id,
            @RequestBody SlangRequest request,
            @AuthenticationPrincipal User currentUser
    ) {
        return ResponseEntity.ok(slangService.update(id, request, currentUser));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSlang(@PathVariable String id, @AuthenticationPrincipal User currentUser) {
        slangService.delete(id, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/saved")
    public ResponseEntity<List<SlangResponseDTO>> getSavedSlangs(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(slangService.getSavedSlangs(currentUser));
    }

    @PostMapping("/{slangId}/save")
    public ResponseEntity<Void> saveSlang(@PathVariable String slangId, @AuthenticationPrincipal User currentUser) {
        slangService.saveSlang(slangId, currentUser);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{slangId}/save")
    public ResponseEntity<Void> unsaveSlang(@PathVariable String slangId, @AuthenticationPrincipal User currentUser) {
        slangService.unsaveSlang(slangId, currentUser);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/my-slangs")
    public ResponseEntity<List<SlangResponseDTO>> getMySlangs(@AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(slangService.getMySlangs(currentUser));
    }

    @PostMapping("/{slangId}/upvote")
    public ResponseEntity<Slang> upvoteSlang(@PathVariable String slangId, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(slangService.upvoteSlang(slangId, currentUser));
    }

    @PostMapping("/{slangId}/downvote")
    public ResponseEntity<Slang> downvoteSlang(@PathVariable String slangId, @AuthenticationPrincipal User currentUser) {
        return ResponseEntity.ok(slangService.downvoteSlang(slangId, currentUser));
    }

    @GetMapping("/leaderboard")
    public ResponseEntity<List<LeaderboardDTO>> getLeaderboard() {
        return ResponseEntity.ok(slangService.getLeaderboard());
    }
}