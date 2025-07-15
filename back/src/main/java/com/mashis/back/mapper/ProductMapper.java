package com.mashis.back.mapper;

import com.mashis.back.dto.request.ProductRequest;
import com.mashis.back.dto.response.ProductResponse;
import com.mashis.back.entity.Product;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface ProductMapper {

    Product toEntity(ProductRequest productRequest);

    ProductResponse toResponse(Product product);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromRequest(ProductRequest productRequest, @MappingTarget Product product);
}
