package com.mashis.back.service;

import com.mashis.back.dto.request.CustomerRequest;
import com.mashis.back.dto.response.CustomerResponse;
import com.mashis.back.entity.Customer;
import com.mashis.back.mapper.CustomerMapper;
import com.mashis.back.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CustomerService {

    private final CustomerRepository customerRepository;
    private final CustomerMapper customerMapper;

    @Transactional
    public CustomerResponse createCustomer(CustomerRequest customerRequest) {
        if (customerRepository.findByEmail(customerRequest.getEmail()).isPresent()) {
            throw new RuntimeException("Customer with email " + customerRequest.getEmail() + " already exists.");
        }
        Customer customer = customerMapper.toEntity(customerRequest);
        Customer savedCustomer = customerRepository.save(customer);
        return customerMapper.toResponse(savedCustomer);
    }

    @Transactional(readOnly = true)
    public List<CustomerResponse> getAllCustomers() {
        return customerRepository.findAll().stream()
                .map(customerMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<CustomerResponse> getCustomerById(Long id) {
        return customerRepository.findById(id)
                .map(customerMapper::toResponse);
    }

    @Transactional
    public Optional<CustomerResponse> updateCustomer(Long id, CustomerRequest customerRequest) {
        return customerRepository.findById(id)
                .map(existingCustomer -> {
                    if (customerRequest.getEmail() != null && !customerRequest.getEmail().equals(existingCustomer.getEmail())) {
                        if (customerRepository.findByEmail(customerRequest.getEmail()).isPresent()) {
                            throw new RuntimeException("Customer with email " + customerRequest.getEmail() + " already exists.");
                        }
                    }
                    customerMapper.updateEntityFromRequest(customerRequest, existingCustomer);
                    Customer updatedCustomer = customerRepository.save(existingCustomer);
                    return customerMapper.toResponse(updatedCustomer);
                });
    }

    @Transactional
    public boolean deleteCustomer(Long id) {
        if (customerRepository.existsById(id)) {
            customerRepository.deleteById(id);
            return true;
        }
        return false;
    }
}
