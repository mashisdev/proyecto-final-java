package com.mashis.back.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.math.BigDecimal;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ProductSimpleResponse {
    private Long id;
    private String name;
    private String brand;
    private BigDecimal price;
}