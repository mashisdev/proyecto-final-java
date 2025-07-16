package com.mashis.back.mapper;

import com.mashis.back.dto.request.OrderItemRequest;
import com.mashis.back.dto.response.OrderItemResponse;
import com.mashis.back.entity.OrderItem;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = {ProductMapper.class})
public interface OrderItemMapper {
    @Mapping(target = "order", ignore = true)
    @Mapping(target = "product", ignore = true)
    @Mapping(target = "unitPrice", ignore = true)
    OrderItem toEntity(OrderItemRequest orderItemRequest);

    OrderItemResponse toResponse(OrderItem orderItem);
}