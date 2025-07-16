package com.mashis.back.dto.response;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.mashis.back.entity.Order;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CustomerResponse {
    private Long id;
    private String firstName;
    private String lastName;
    private String email;
}
