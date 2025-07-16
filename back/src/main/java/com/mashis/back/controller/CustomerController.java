package com.mashis.back.controller;

import com.mashis.back.dto.request.CustomerRequest;
import com.mashis.back.dto.response.CustomerResponse;
import com.mashis.back.exception.notFound.CustomerNotFoundException;
import com.mashis.back.service.CustomerService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/customers")
public class CustomerController {

    private final CustomerService customerService;

    public CustomerController(CustomerService customerService) {
        this.customerService = customerService;
    }

    @PostMapping
    public ResponseEntity<CustomerResponse> createCustomer(@Valid @RequestBody CustomerRequest customerRequest) {
        CustomerResponse newCustomer = customerService.createCustomer(customerRequest);
        return new ResponseEntity<>(newCustomer, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<CustomerResponse>> getAllCustomers() {
        List<CustomerResponse> customers = customerService.getAllCustomers();
        return new ResponseEntity<>(customers, HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<CustomerResponse> getCustomerById(@PathVariable Long id) {
        return customerService.getCustomerById(id)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + id)); // El controlador lanza la excepción
    }

    @GetMapping("/search")
    public ResponseEntity<CustomerResponse> getCustomerByEmail(@RequestParam String email) {
        return customerService.findCustomerByEmail(email)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with email: " + email));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CustomerResponse> updateCustomer(@PathVariable Long id, @Valid @RequestBody CustomerRequest customerRequest) {
        return customerService.updateCustomer(id, customerRequest)
                .map(ResponseEntity::ok)
                .orElseThrow(() -> new CustomerNotFoundException("Customer not found with ID: " + id));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCustomer(@PathVariable Long id) {
        boolean deleted = customerService.deleteCustomer(id);
        if (deleted) {
            return ResponseEntity.noContent().build();
        } else {
            throw new CustomerNotFoundException("Customer not found with ID: " + id);
        }
    }
}
