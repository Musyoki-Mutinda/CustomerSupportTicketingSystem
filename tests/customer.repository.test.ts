import * as customerRepository from '../src/repositories/customers.repository';
import { getPool } from '../src/db/config';

// Mock the db config
jest.mock('../src/db/config');

describe('Customer Repository', () => {
  let mockPool: any;
  let mockRequest: any;

  beforeEach(() => {
    mockRequest = {
      input: jest.fn().mockReturnThis(),
      query: jest.fn(),
    };
    mockPool = {
      request: jest.fn().mockReturnValue(mockRequest),
    };
    (getPool as jest.Mock).mockResolvedValue(mockPool);
    jest.clearAllMocks();
  });

  describe('getCustomers', () => {
    it('should return all customers', async () => {
      const mockCustomers = [{ id: 1, name: 'John' }];
      mockRequest.query.mockResolvedValue({ recordset: mockCustomers });

      const result = await customerRepository.getCustomers();

      expect(getPool).toHaveBeenCalled();
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM customers');
      expect(result).toEqual(mockCustomers);
    });
  });

  describe('createCustomer', () => {
    it('should create a customer', async () => {
      const mockCustomer = { customer_ID: 1, first_name: 'John', last_name: 'Doe', email: 'john@example.com', phone_no: '1234567890', password: 'password' };
      const mockResult = { message: 'Customer created successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await customerRepository.createCustomer(mockCustomer);

      expect(mockRequest.input).toHaveBeenCalledWith('fIrst_name', 'John');
      expect(mockRequest.input).toHaveBeenCalledWith('last_name', 'Doe');
      expect(mockRequest.input).toHaveBeenCalledWith('email', 'john@example.com');
      expect(mockRequest.input).toHaveBeenCalledWith('phone_no', '1234567890');
      expect(mockRequest.input).toHaveBeenCalledWith('password', 'password');
      expect(mockRequest.query).toHaveBeenCalledWith('INSERT INTO customers (first_name, last_name, email, phone_no, password) VALUES (@first_name, @last_name, @email, @phone_no, @password)');
      expect(result).toEqual({ message: 'Customer created successfully' });
    });
  });

  describe('getCustomerById', () => {
    it('should return customer by id', async () => {
      const mockCustomer = [{ customer_ID: 1, first_name: 'John' }];
      mockRequest.query.mockResolvedValue({ recordset: mockCustomer });

      const result = await customerRepository.getCustomerById(1);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM customers WHERE customer_ID=@id');
      expect(result).toEqual(mockCustomer[0]);
    });
  });

  describe('deleteCustomer', () => {
    it('should delete customer', async () => {
      const mockResult = { message: 'Customer deleted successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await customerRepository.deleteCustomer(1);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('DELETE FROM customers WHERE customer_ID = @id');
      expect(result).toEqual({ message: 'Customer deleted successfully' });
    });
  });

  describe('updateCustomer', () => {
    it('should update customer', async () => {
      const updateData = { first_name: 'Jane', last_name: 'Doe', phone_no: '0987654321' };
      const mockResult = { message: 'Customer updated successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await customerRepository.updateCustomer(1, updateData);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.input).toHaveBeenCalledWith('first_name', 'Jane');
      expect(mockRequest.input).toHaveBeenCalledWith('last_name', 'Doe');
      expect(mockRequest.input).toHaveBeenCalledWith('phone_no', '0987654321');
      expect(mockRequest.query).toHaveBeenCalledWith('UPDATE customers SET first_name =@first_name, last_name = @last_name, phone_no = @phone_no WHERE customer_ID = @id');
      expect(result).toEqual({ message: 'Customer updated successfully' });
    });
  });

  describe('getCustomerByEmail', () => {
    it('should return customer by email', async () => {
      const mockCustomer = [{ customer_ID: 1, email: 'john@example.com' }];
      mockRequest.query.mockResolvedValue({ recordset: mockCustomer });

      const result = await customerRepository.getCustomerByEmail('john@example.com');

      expect(mockRequest.input).toHaveBeenCalledWith('email', 'john@example.com');
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM customers WHERE email = @email');
      expect(result).toEqual(mockCustomer[0]);
    });

    it('should return null if no customer found', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await customerRepository.getCustomerByEmail('nonexistent@example.com');

      expect(result).toBeNull();
    });
  });
});