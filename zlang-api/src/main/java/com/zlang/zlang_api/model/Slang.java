package com.zlang.zlang_api.model;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Document(collection = "slangs")
public class Slang {

    @Id
    private String id;

    @NotBlank(message = "Term cannot be blank")
    private String term;

    @NotBlank(message = "Meaning cannot be blank")
    private String meaning;

    private String example;

    private String authorId;
}