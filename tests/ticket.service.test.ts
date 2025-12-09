import * as ticketService from '../src/services/ticket.service';
import * as ticketRepository from '../src/repositories/tickets.repository';

// Mock the repository
jest.mock('../src/repositories/tickets.repository');
jest.mock('dotenv', () => ({ config: jest.fn() }));

describe('Ticket Service', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('listTickets', () => {
    it('should return all tickets', async () => {
      const mockTickets = [{ ticket_no: 1, event_name: 'Concert' }];
      (ticketRepository.getTickets as jest.Mock).mockResolvedValue(mockTickets);

      const result = await ticketService.listTickets();

      expect(ticketRepository.getTickets).toHaveBeenCalled();
      expect(result).toEqual(mockTickets);
    });
  });

  describe('getTicket', () => {
    it('should return ticket by id', async () => {
      const mockTicket = { ticket_no: 1, event_name: 'Concert' };
      (ticketRepository.getTicketById as jest.Mock).mockResolvedValue(mockTicket);

      const result = await ticketService.getTicket(1);

      expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockTicket);
    });
  });

  describe('createTicket', () => {
    it('should create a ticket', async () => {
      const mockTicket = { ticket_no: 1, event_name: 'Concert', event_location: 'Venue', price: 100, event_date: '2023-12-01' };
      const mockResult = { message: 'Ticket created successfully' };

      (ticketRepository.createTicket as jest.Mock).mockResolvedValue(mockResult);

      const result = await ticketService.createTicket(mockTicket);

      expect(ticketRepository.createTicket).toHaveBeenCalledWith(mockTicket);
      expect(result).toEqual(mockResult);
    });
  });

  describe('deleteTicket', () => {
    it('should delete ticket if exists', async () => {
      const mockTicket = { ticket_no: 1 };
      const mockResult = { message: 'Ticket deleted successfully' };

      (ticketRepository.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
      (ticketRepository.deleteTicket as jest.Mock).mockResolvedValue(mockResult);

      const result = await ticketService.deleteTicket(1);

      expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
      expect(ticketRepository.deleteTicket).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockResult);
    });

    it('should throw error if ticket not found', async () => {
      (ticketRepository.getTicketById as jest.Mock).mockResolvedValue(null);

      await expect(ticketService.deleteTicket(1)).rejects.toThrow('Ticket not found');
    });
  });

  describe('updateTicket', () => {
    it('should update ticket if exists', async () => {
      const mockTicket = { ticket_no: 1 };
      const updateData = { event_name: 'Updated Concert' };
      const mockResult = { message: 'Ticket updated successfully' };

      (ticketRepository.getTicketById as jest.Mock).mockResolvedValue(mockTicket);
      (ticketRepository.updateTicket as jest.Mock).mockResolvedValue(mockResult);

      const result = await ticketService.updateTicket(1, updateData);

      expect(ticketRepository.getTicketById).toHaveBeenCalledWith(1);
      expect(ticketRepository.updateTicket).toHaveBeenCalledWith(1, updateData);
      expect(result).toEqual(mockResult);
    });

    it('should throw error if ticket not found', async () => {
      (ticketRepository.getTicketById as jest.Mock).mockResolvedValue(null);

      await expect(ticketService.updateTicket(1, {})).rejects.toThrow('Ticket not found');
    });
  });
});