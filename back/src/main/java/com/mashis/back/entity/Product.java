package com.mashis.back.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "products")
@Getter
@Setter
@NoArgsConstructor
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private String brand;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(nullable = false)
    private Integer stock;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal price;

    @Column(nullable = false)
    private String category;

    @Column
    private String imageUrl;

    public Product(String name, String description, Integer stock, BigDecimal price, String imageUrl) {
        this.name = name;
        this.description = description;
        this.stock = stock;
        this.price = price;
        this.imageUrl = imageUrl;
    }
}