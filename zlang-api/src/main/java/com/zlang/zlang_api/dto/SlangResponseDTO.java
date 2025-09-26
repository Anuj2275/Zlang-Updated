package com.zlang.zlang_api.dto;

import com.zlang.zlang_api.model.Slang;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class SlangResponseDTO {
    private String id;
    private String term;
    private String meaning;
    private String example;
    private String authorId;
    private String authorName;
    private List<String> upvotedBy;
    private List<String> downvotedBy;

    public static SlangResponseDTO from(Slang slang, String authorName) {
        return new SlangResponseDTO(
                slang.getId(),
                slang.getTerm(),
                slang.getMeaning(),
                slang.getExample(),
                slang.getAuthorId(),
                authorName,
                slang.getUpvotedBy(),
                slang.getDownvotedBy()
        );
    }
}