import { Express } from 'express';
import customerRoutes from '../src/router/customer.routes';
import * as customerController from '../src/controllers/customer.controllers';

// Mock the controller
jest.mock('../src/controllers/customer.controllers');

describe('Customer Routes', () => {
  let mockApp: Partial<Express>;

  beforeEach(() => {
    mockApp = {
      get: jest.fn(),
      post: jest.fn(),
      put: jest.fn(),
      delete: jest.fn(),
    };
    jest.clearAllMocks();
  });

  it('should set up routes correctly', () => {
    customerRoutes(mockApp as Express);

    expect(mockApp.get).toHaveBeenCalledWith('/customers', customerController.getAllCustomers);
    expect(mockApp.get).toHaveBeenCalledWith('/customers/:id', customerController.getCustomerById);
    expect(mockApp.post).toHaveBeenCalledWith('/addcustomer', customerController.createCustomer);
    expect(mockApp.put).toHaveBeenCalledWith('/customers/:id', customerController.updateCustomer);
    expect(mockApp.delete).toHaveBeenCalledWith('/customers/:id', customerController.deleteCustomer);
    expect(mockApp.post).toHaveBeenCalledWith('/login', customerController.loginCustomer);
  });
});