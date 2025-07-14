package com.mashis.back.request;

import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ProductRequest {
    @NotBlank(message = "Product name cannot be blank")
    @Size(max = 255, message = "Product name cannot exceed 255 characters")
    private String name;

    @Size(max = 1000, message = "Product description cannot exceed 1000 characters")
    private String description;

    @NotNull(message = "Product price cannot be null")
    @Min(value = 0, message = "Product price must be positive")
    private Double price;

    @NotEmpty(message = "Product must have at least 1 category name")
    private List<String> categories;

    private String imageUrl;

    @NotNull(message = "Product stock cannot be null")
    @Min(value = 0, message = "Product stock must be non-negative")
    private Integer stock;
}
