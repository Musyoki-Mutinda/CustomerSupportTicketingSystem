import request from 'supertest';
import app from '../src/app';

// Mock the database connection to avoid actual DB calls
jest.mock('../src/db/config', () => ({
  getPool: jest.fn(() => ({
    request: jest.fn(() => ({
      input: jest.fn().mockReturnThis(),
      query: jest.fn().mockResolvedValue({ recordset: [] }),
    })),
  })),
}));

describe('API Integration Tests', () => {
  beforeAll(() => {
    // Set up test environment variables if needed
    process.env.JWT_SECRET = 'test-secret';
  });

  describe('Customer, Ticket, and Comment Workflow', () => {
    let customerId: number;
    let ticketId: number;
    let authToken: string;

    it('should create a customer', async () => {
      const customerData = {
        customer_ID: 1,
        first_name: 'John',
        last_name: 'Doe',
        email: 'john@example.com',
        phone_no: '1234567890',
        password: 'password123'
      };

      const response = await request(app)
        .post('/addcustomer')
        .send(customerData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Customer created successfully');
    });

    it('should login customer and get token', async () => {
      const loginData = {
        email: 'john@example.com',
        password: 'password123'
      };

      const response = await request(app)
        .post('/login')
        .send(loginData)
        .expect(200);

      expect(response.body).toHaveProperty('message', 'Login successful');
      expect(response.body).toHaveProperty('token');
      authToken = response.body.token;
    });

    it('should create a ticket', async () => {
      const ticketData = {
        ticket_no: 1,
        event_name: 'Concert',
        event_location: 'Stadium',
        price: 100,
        event_date: '2023-12-01'
      };

      const response = await request(app)
        .post('/addticket')
        .send(ticketData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'Ticket created successfully');
    });

    it('should create a comment', async () => {
      const commentData = {
        comment_date: new Date().toISOString(),
        ticket_no: 1,
        comment_text: 'This is a test comment',
        customer_ID: 1
      };

      const response = await request(app)
        .post('/addcomment')
        .send(commentData)
        .expect(201);

      expect(response.body).toHaveProperty('message', 'comment created successfully');
    });

    it('should get all customers', async () => {
      const response = await request(app)
        .get('/customers')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get all tickets', async () => {
      const response = await request(app)
        .get('/tickets')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });

    it('should get all comments', async () => {
      const response = await request(app)
        .get('/comments')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});