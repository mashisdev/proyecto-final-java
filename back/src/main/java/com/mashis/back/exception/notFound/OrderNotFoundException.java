package com.mashis.back.exception.notFound;

public class OrderNotFoundException extends ResourceNotFoundException {
    public OrderNotFoundException(String message) {
        super(message);
    }
}
