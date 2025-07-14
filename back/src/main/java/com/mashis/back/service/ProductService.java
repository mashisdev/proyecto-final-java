package com.mashis.back.service;

import com.mashis.back.dto.ProductDto;
import com.mashis.back.entity.Product;
import com.mashis.back.repository.ProductRepository;
import com.mashis.back.request.ProductRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import jakarta.persistence.EntityNotFoundException;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    @Transactional
    public ProductDto createProduct(ProductRequest productRequest) {
        Product product = Product.builder()
                .name(productRequest.getName())
                .description(productRequest.getDescription())
                .price(productRequest.getPrice())
                .categories(productRequest.getCategories())
                .imageUrl(productRequest.getImageUrl())
                .stock(productRequest.getStock())
                .build();
        Product savedProduct = productRepository.save(product);
        return convertToDto(savedProduct);
    }

    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product with ID " + id + " not found"));
        return convertToDto(product);
    }

    @Transactional(readOnly = true)
    public List<ProductDto> getAllProducts() {
        return productRepository.findAll().stream()
                .map(this::convertToDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ProductDto updateProduct(Long id, ProductRequest productRequest) {
        Product existingProduct = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product with ID " + id + " not found"));

        existingProduct.setName(productRequest.getName());
        existingProduct.setDescription(productRequest.getDescription());
        existingProduct.setPrice(productRequest.getPrice());
        existingProduct.setCategories(productRequest.getCategories());
        existingProduct.setImageUrl(productRequest.getImageUrl());
        existingProduct.setStock(productRequest.getStock());

        Product updatedProduct = productRepository.save(existingProduct);
        return convertToDto(updatedProduct);
    }

    @Transactional
    public void deleteProduct(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Product with ID " + id + " not found"));
        // For soft delete:
        product.setActive(false);
        productRepository.save(product);
        // For hard delete:
        // productRepository.deleteById(id);
    }

    // Helper method to convert Product entity to ProductDto
    private ProductDto convertToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .categories(product.getCategories())
                .imageUrl(product.getImageUrl())
                .stock(product.getStock())
                .active(product.isActive()) // Include active status in DTO
                .build();
    }
}