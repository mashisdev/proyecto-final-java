package com.mashis.back.mapper;

import com.mashis.back.dto.request.CustomerRequest;
import com.mashis.back.dto.response.CustomerResponse;
import com.mashis.back.entity.Customer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface CustomerMapper {
    Customer toEntity(CustomerRequest customerRequest);
    CustomerResponse toResponse(Customer customer);
    @Mapping(target = "id", ignore = true)
    @Mapping(target = "orders", ignore = true)
    void updateEntityFromRequest(CustomerRequest customerRequest, @MappingTarget Customer customer);
}