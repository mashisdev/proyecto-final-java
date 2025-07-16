package com.mashis.back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductResponse {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
    private Integer stock;
    private String description;
    private String category;
    private String imageUrl;
}
