import { Request, Response } from 'express';
import * as ticketController from '../src/controllers/tickets.controllers';
import * as ticketService from '../src/services/ticket.service';

// Mock the ticket service
jest.mock('../src/services/ticket.service');

describe('Ticket Controller', () => {
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

  describe('getAllTickets', () => {
    it('should return all tickets', async () => {
      const mockTickets = [{ ticket_no: 1, event_name: 'Concert' }];
      (ticketService.listTickets as jest.Mock).mockResolvedValue(mockTickets);

      await ticketController.getAllTickets(mockRequest as Request, mockResponse as Response);

      expect(ticketService.listTickets).toHaveBeenCalled();
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTickets);
    });

    it('should handle errors', async () => {
      const error = new Error('Database error');
      (ticketService.listTickets as jest.Mock).mockRejectedValue(error);

      await ticketController.getAllTickets(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('createTicket', () => {
    it('should create a ticket', async () => {
      const mockTicket = { ticket_no: 1, event_name: 'Concert', event_location: 'Venue', price: 100, event_date: '2023-12-01' };
      const mockResult = { message: 'Ticket created successfully' };
      mockRequest = { body: mockTicket };
      (ticketService.createTicket as jest.Mock).mockResolvedValue(mockResult);

      await ticketController.createTicket(mockRequest as Request, mockResponse as Response);

      expect(ticketService.createTicket).toHaveBeenCalledWith(mockTicket);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should handle errors', async () => {
      const error = new Error('Creation error');
      mockRequest = { body: {} };
      (ticketService.createTicket as jest.Mock).mockRejectedValue(error);

      await ticketController.createTicket(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(500);
      expect(mockJson).toHaveBeenCalledWith({ error: error.message });
    });
  });

  describe('getTicketById', () => {
    it('should return ticket by id', async () => {
      const mockTicket = { ticket_no: 1, event_name: 'Concert' };
      mockRequest = { params: { id: '1' } };
      (ticketService.getTicket as jest.Mock).mockResolvedValue(mockTicket);

      await ticketController.getTicketById(mockRequest as Request, mockResponse as Response);

      expect(ticketService.getTicket).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockTicket);
    });

    it('should return 404 if ticket not found', async () => {
      mockRequest = { params: { id: '1' } };
      (ticketService.getTicket as jest.Mock).mockResolvedValue(null);

      await ticketController.getTicketById(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Customer not found' });
    });
  });

  describe('deleteTicket', () => {
    it('should delete ticket', async () => {
      const mockResult = { message: 'Ticket deleted successfully' };
      mockRequest = { params: { id: '1' } };
      (ticketService.deleteTicket as jest.Mock).mockResolvedValue(mockResult);

      await ticketController.deleteTicket(mockRequest as Request, mockResponse as Response);

      expect(ticketService.deleteTicket).toHaveBeenCalledWith(1);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });

    it('should return 400 for invalid id', async () => {
      mockRequest = { params: { id: 'abc' } };

      await ticketController.deleteTicket(mockRequest as Request, mockResponse as Response);

      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({ message: 'Invalid customer id' });
    });
  });

  describe('updateTicket', () => {
    it('should update ticket', async () => {
      const mockTicket = { event_name: 'Updated Concert' };
      const mockResult = { message: 'Ticket updated successfully' };
      mockRequest = { params: { id: '1' }, body: mockTicket };
      (ticketService.updateTicket as jest.Mock).mockResolvedValue(mockResult);

      await ticketController.updateTicket(mockRequest as Request, mockResponse as Response);

      expect(ticketService.updateTicket).toHaveBeenCalledWith(1, mockTicket);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith(mockResult);
    });
  });
});