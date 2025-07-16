package com.mashis.back.exception.notFound;

public class CustomerNotFoundException extends ResourceNotFoundException {
    public CustomerNotFoundException(String message) {
        super(message);
    }
}
