package com.mashis.back.service;

import com.mashis.back.entity.Order;

import java.util.List;
import java.util.Optional;

public interface OrderService {
    List<Order> getAllOrders();
    Optional<Order> getOrderById(Long id);
    Order createOrder(Order order);
    Optional<Order> updateOrder(Long id, Order orderDetails);
    void deleteOrder(Long id);
    Optional<Order> addProductToOrder(Long orderId, Long productId);
    Optional<Order> removeProductFromOrder(Long orderId, Long productId);
}
