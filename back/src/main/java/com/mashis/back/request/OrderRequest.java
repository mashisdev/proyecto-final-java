package com.mashis.back.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import lombok.Data;

import java.util.List;

@Data
public class OrderRequest {

    @NotBlank(message = "Customer name cannot be blank.")
    private String customer;

    @NotEmpty(message = "The order must contain at least one product ID.")
    private List<Long> productIds;
}
