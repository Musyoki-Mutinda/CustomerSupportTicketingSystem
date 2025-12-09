import { Express } from 'express';
import ticketRoutes from '../src/router/ticket.routes';
import * as ticketController from '../src/controllers/tickets.controllers';

// Mock the controller
jest.mock('../src/controllers/tickets.controllers');

describe('Ticket Routes', () => {
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
    ticketRoutes(mockApp as Express);

    expect(mockApp.get).toHaveBeenCalledWith('/tickets', ticketController.getAllTickets);
    expect(mockApp.get).toHaveBeenCalledWith('/tickets/:id', ticketController.getTicketById);
    expect(mockApp.post).toHaveBeenCalledWith('/addticket', ticketController.createTicket);
    expect(mockApp.put).toHaveBeenCalledWith('/tickets/:id', ticketController.updateTicket);
    expect(mockApp.delete).toHaveBeenCalledWith('/tickets/:id', ticketController.deleteTicket);
  });
});