package com.mashis.back.exception.conflict;

public class CustomerAlreadyExistsException extends AlreadyExistsException {
    public CustomerAlreadyExistsException(String message) {
        super(message);
    }
}
