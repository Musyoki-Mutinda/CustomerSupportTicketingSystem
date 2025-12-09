import * as ticketRepository from '../src/repositories/tickets.repository';
import { getPool } from '../src/db/config';

// Mock the db config
jest.mock('../src/db/config');

describe('Ticket Repository', () => {
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

  describe('getTickets', () => {
    it('should return all tickets', async () => {
      const mockTickets = [{ ticket_no: 1, event_name: 'Concert' }];
      mockRequest.query.mockResolvedValue({ recordset: mockTickets });

      const result = await ticketRepository.getTickets();

      expect(getPool).toHaveBeenCalled();
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM tickets');
      expect(result).toEqual(mockTickets);
    });
  });

  describe('createTicket', () => {
    it('should create a ticket', async () => {
      const mockTicket = { ticket_no: 1, event_name: 'Concert', event_location: 'Venue', price: 100, event_date: '2023-12-01' };
      const mockResult = { message: 'Ticket created successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await ticketRepository.createTicket(mockTicket);

      expect(mockRequest.input).toHaveBeenCalledWith('event_name', 'Concert');
      expect(mockRequest.input).toHaveBeenCalledWith('event_location', 'Venue');
      expect(mockRequest.input).toHaveBeenCalledWith('price', 100);
      expect(mockRequest.input).toHaveBeenCalledWith('event_date', '2023-12-01');
      expect(mockRequest.query).toHaveBeenCalledWith('INSERT INTO tickets (event_name, event_location, price, event_date) VALUES (@event_name, @event_location, @price, @event_date)');
      expect(result).toEqual({ message: 'Ticket created successfully' });
    });
  });

  describe('getTicketById', () => {
    it('should return ticket by id', async () => {
      const mockTicket = [{ ticket_no: 1, event_name: 'Concert' }];
      mockRequest.query.mockResolvedValue({ recordset: mockTicket });

      const result = await ticketRepository.getTicketById(1);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM tickets WHERE ticket_no=@id');
      expect(result).toEqual(mockTicket[0]);
    });
  });

  describe('deleteTicket', () => {
    it('should delete ticket', async () => {
      const mockResult = { message: 'Customer deleted successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await ticketRepository.deleteTicket(1);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.query).toHaveBeenCalledWith('DELETE FROM tickets WHERE ticket_no = @id');
      expect(result).toEqual({ message: 'Customer deleted successfully' });
    });
  });

  describe('updateTicket', () => {
    it('should update ticket', async () => {
      const updateData = { event_name: 'Updated Concert', event_location: 'New Venue', price: 150, event_date: '2023-12-02' };
      const mockResult = { message: 'Ticket updated successfully' };

      mockRequest.query.mockResolvedValue(mockResult);

      const result = await ticketRepository.updateTicket(1, updateData);

      expect(mockRequest.input).toHaveBeenCalledWith('id', 1);
      expect(mockRequest.input).toHaveBeenCalledWith('event_name', 'Updated Concert');
      expect(mockRequest.input).toHaveBeenCalledWith('event_location', 'New Venue');
      expect(mockRequest.input).toHaveBeenCalledWith('price', 150);
      expect(mockRequest.input).toHaveBeenCalledWith('event_date', '2023-12-02');
      expect(mockRequest.query).toHaveBeenCalledWith('UPDATE tickets SET event_name = @event_name, event_location = @event_location, price = @price, event_date = @event_date WHERE ticket_no = @id');
      expect(result).toEqual({ message: 'Ticket updated successfully' });
    });
  });

  describe('getTicketByEvent', () => {
    it('should return ticket by event name', async () => {
      const mockTicket = [{ ticket_no: 1, event_name: 'Concert' }];
      mockRequest.query.mockResolvedValue({ recordset: mockTicket });

      const result = await ticketRepository.getTicketByEvent('Concert');

      expect(mockRequest.input).toHaveBeenCalledWith('Concert', 'Concert');
      expect(mockRequest.query).toHaveBeenCalledWith('SELECT * FROM tickets WHERE event_name = @event_name');
      expect(result).toEqual(mockTicket[0]);
    });

    it('should return null if no ticket found', async () => {
      mockRequest.query.mockResolvedValue({ recordset: [] });

      const result = await ticketRepository.getTicketByEvent('Nonexistent');

      expect(result).toBeNull();
    });
  });
});