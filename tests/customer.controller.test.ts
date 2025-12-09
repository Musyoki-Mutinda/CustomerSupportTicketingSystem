import { Request, Response } from 'express';
import * as customerController from '../src/controllers/customer.controllers';
import * as customerService from '../src/services/customer.service';

// Mock the customer service
jest.mock('../src/services/customer.service');

describe('Customer Controller', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      status: mockStatus,
      json: mockJson,
    };
    jest.clearAllMocks();
  });

  describe('getAllCustomers', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John' }];
      (customerService.listCustomers as jest.Mock).mockResolvedValue(mockCustomers);

      await customerController.getAllCustomers(mockRequest as Request, mockResponse as Response);

      expect(customerService.listCustomers).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCustomers);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (customerService.listCustomers as jest.Mock).mockRejectedValue(error);

      await customerController.getAllCustomers(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const mockCustomer = { first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_no: '1234567890', password: 'password' };
      const mockResult = { message: 'Customer created successfully' };
      mockRequest = { body: mockCustomer };
      (customerService.createCustomer as jest.Mock).mockResolvedValue(mockResult);

      await customerController.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(customerService.createCustomer).toHaveBeenCalledWith(mockCustomer);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      mockRequest = { body: {} };
      (customerService.createCustomer as jest.Mock).mockRejectedValue(error);

      await customerController.createCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getCustomerById', () => {
    it('should return customer by id', async () => {
      const mockCustomer = { customer_ID: 1, first_name: 'John' };
      mockRequest = { params: { id: '1' } };
      (customerService.getCustomer as jest.Mock).mockResolvedValue(mockCustomer);

      await customerController.getCustomerById(mockRequest as Request, mockResponse as Response);

      expect(customerService.getCustomer).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockCustomer);
    });

    it('should return 404 if customer not found', async () => {
      mockRequest = { params: { id: '1' } };
      (customerService.getCustomer as jest.Mock).mockResolvedValue(null);

      await customerController.getCustomerById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Customer not found' });
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer', async () => {
      const mockResult = { message: 'Customer deleted successfully' };
      mockRequest = { params: { id: '1' } };
      (customerService.deleteCustomer as jest.Mock).mockResolvedValue(mockResult);

      await customerController.deleteCustomer(mockRequest as Request, mockResponse as Response);

      expect(customerService.deleteCustomer).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 for invalid id', async () => {
      mockRequest = { params: { id: 'abc' } };

      await customerController.deleteCustomer(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid customer id' });
    });
  });

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      const mockCustomer = { first_name: 'Jane' };
      const mockResult = { message: 'Customer updated successfully' };
      mockRequest = { params: { id: '1' }, body: mockCustomer };
      (customerService.updateCustomer as jest.Mock).mockResolvedValue(mockResult);

      await customerController.updateCustomer(mockRequest as Request, mockResponse as Response);

      expect(customerService.updateCustomer).toHaveBeenCalledWith(1, mockCustomer);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });
  });

  describe('loginCustomer', () => {
    it('should login customer', async () => {
      const mockCredentials = { email: 'john@example.com', password: 'password' };
      const mockResult = { message: 'Login successful', token: 'token' };
      mockRequest = { body: mockCredentials };
      (customerService.loginCustomer as jest.Mock).mockResolvedValue(mockResult);

      await customerController.loginCustomer(mockRequest as Request, mockResponse as Response);

      expect(customerService.loginCustomer).toHaveBeenCalledWith('john@example.com', 'password');
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });
  });
});