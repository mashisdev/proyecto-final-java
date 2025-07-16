package com.mashis.back.mapper;

import com.mashis.back.dto.request.OrderRequest;
import com.mashis.back.dto.response.OrderResponse;
import com.mashis.back.entity.Order;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring", uses = {CustomerMapper.class, OrderItemMapper.class})
public interface OrderMapper {
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "orderDate", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    Order toEntity(OrderRequest orderRequest);

    OrderResponse toResponse(Order order);

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "customer", ignore = true)
    @Mapping(target = "items", ignore = true)
    @Mapping(target = "orderDate", ignore = true)
    @Mapping(target = "totalAmount", ignore = true)
    void updateEntityFromRequest(OrderRequest orderRequest, @MappingTarget Order order);
}