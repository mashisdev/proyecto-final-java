package com.mashis.back.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderRequest {
    @NotNull(message = "Customer ID cannot be null")
    @Min(value = 1, message = "Customer ID must be greater than 0")
    private Long customerId;

    @Valid
    @Size(min = 1, message = "Order must contain at least one item")
    private List<OrderItemRequest> items;
}
