package com.mashis.back.exception.conflict;

public class ProductAlreadyExistsException extends AlreadyExistsException {
    public ProductAlreadyExistsException(String message) {
        super(message);
    }
}
