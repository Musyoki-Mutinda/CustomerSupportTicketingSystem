// Mock the database config first before any other imports
jest.mock('../src/db/config', () => ({
  getPool: jest.fn(() => ({
    request: jest.fn(() => ({
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    })),
  })),
}));

// Mock external modules
jest.mock('bcrypt');
jest.mock('jsonwebtoken');
jest.mock('dotenv', () => ({ config: jest.fn() }));

// Mock the repository
jest.mock('../src/repositories/customers.repository');

import * as customerService from '../src/services/customer.service';
import * as customerRepository from '../src/repositories/customers.repository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

describe('Customer Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listCustomers', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John' }];
      (customerRepository.getCustomers as jest.Mock).mockResolvedValue(mockCustomers);

      const result = await customerService.listCustomers();

      expect(customerRepository.getCustomers).toHaveBeenCalled();
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('getCustomer', () => {
    it('should return customer by id', async () => {
      const mockCustomer = { customer_ID: 1, first_name: 'John' };
      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(mockCustomer);

      const result = await customerService.getCustomer(1);

      expect(customerRepository.getCustomerById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockCustomer);
    });
  });

  describe('createCustomer', () => {
    it('should create a customer with hashed password', async () => {
      const mockCustomer = { customer_ID: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_no: '1234567890', password: 'password' };
      const hashedPassword = 'hashedpassword';
      const mockResult = { message: 'Customer created successfully' };

      (bcrypt.hash as jest.Mock).mockResolvedValue(hashedPassword);
      (customerRepository.createCustomer as jest.Mock).mockResolvedValue(mockResult);

      const result = await customerService.createCustomer(mockCustomer);

      expect(bcrypt.hash).toHaveBeenCalledWith('password', 10);
      expect(customerRepository.createCustomer).toHaveBeenCalledWith({ ...mockCustomer, password: hashedPassword });
      expect(result).toEqual(mockResult);
    });

    it('should create a customer without password', async () => {
      const mockCustomer = { customer_ID: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_no: '1234567890', password: 'password' };
      const mockResult = { message: 'Customer created successfully' };

      (customerRepository.createCustomer as jest.Mock).mockResolvedValue(mockResult);

      const result = await customerService.createCustomer(mockCustomer);

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(customerRepository.createCustomer).toHaveBeenCalledWith(mockCustomer);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer if exists', async () => {
      const mockCustomer = { customer_ID: 1 };
      const mockResult = { message: 'Customer deleted successfully' };

      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(mockCustomer);
      (customerRepository.deleteCustomer as jest.Mock).mockResolvedValue(mockResult);

      const result = await customerService.deleteCustomer(1);

      expect(customerRepository.getCustomerById).toHaveBeenCalledWith(1);
      expect(customerRepository.deleteCustomer).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });

    it('should throw error if customer not found', async () => {
      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.deleteCustomer(1)).rejects.toThrow('Customer not found');
    });
  });

  describe('updateCustomer', () => {
    it('should update customer if exists', async () => {
      const mockCustomer = { customer_ID: 1 };
      const updateData = { first_name: 'Jane' };
      const mockResult = { message: 'Customer updated successfully' };

      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(mockCustomer);
      (customerRepository.updateCustomer as jest.Mock).mockResolvedValue(mockResult);

      const result = await customerService.updateCustomer(1, updateData);

      expect(customerRepository.getCustomerById).toHaveBeenCalledWith(1);
      expect(customerRepository.updateCustomer).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(mockResult);
    });

    it('should throw error if customer not found', async () => {
      (customerRepository.getCustomerById as jest.Mock).mockResolvedValue(null);

      await expect(customerService.updateCustomer(1, {})).rejects.toThrow('Customer not found');
    });
  });

  describe('loginCustomer', () => {
    it('should login customer successfully', async () => {
      const email = 'john@example.com';
      const password = 'password';
      const mockCustomer = { customer_ID: 1, first_name: 'John', last_name: 'Doe', email, password: 'hashedpassword' };
      const token = 'mocktoken';

      (customerRepository.getCustomerByEmail as jest.Mock).mockResolvedValue(mockCustomer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockReturnValue(token);

      const result = await customerService.loginCustomer(email, password);

      expect(customerRepository.getCustomerByEmail).toHaveBeenCalledWith(email);
      expect(bcrypt.compare).toHaveBeenCalledWith(password, 'hashedpassword');
      expect(jwt.sign).toHaveBeenCalledWith({
        sub: 1,
        first_name: 'John',
        last_name: 'Doe',
        exp: expect.any(Number)
      }, expect.any(String));
      expect(result).toEqual({
        message: 'Login successful',
        token,
        customer: {
          customer_ID: 1,
          FN: 'John',
          LN: 'Doe',
          email,
          PN: undefined
        }
      });
    });

    it('should throw error if user not found', async () => {
      (customerRepository.getCustomerByEmail as jest.Mock).mockResolvedValue(null);

      await expect(customerService.loginCustomer('email', 'password')).rejects.toThrow('User not found');
    });

    it('should throw error for invalid credentials', async () => {
      const mockCustomer = { password: 'hashed' };
      (customerRepository.getCustomerByEmail as jest.Mock).mockResolvedValue(mockCustomer);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(customerService.loginCustomer('email', 'password')).rejects.toThrow('Invalid credentials');
    });
  });
});