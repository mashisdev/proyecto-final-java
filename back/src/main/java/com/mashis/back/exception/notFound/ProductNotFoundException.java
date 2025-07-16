package com.mashis.back.exception.notFound;

public class ProductNotFoundException extends ResourceNotFoundException {
  public ProductNotFoundException(String message) {
    super(message);
  }
}
