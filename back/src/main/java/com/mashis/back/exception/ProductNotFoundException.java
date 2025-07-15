package com.mashis.back.exception;

public class ProductNotFoundException extends ResourceNotFoundException {
  public ProductNotFoundException(String message) {
    super(message);
  }
}
