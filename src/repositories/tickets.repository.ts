import { getPool } from "../db/config";
import { NewTicket, Ticket, UpdateTicket } from "../Types/ticket.type"

//get all tickets
export const getTickets = async():Promise<Ticket[]> => {
    const pool = await getPool() //await db connection to open
    const results = await pool.request().query(`SELECT * FROM tickets`)
    return results.recordset
}

//create new ticket -ticket:any changed to ticket: NewTicket
export const createTicket = async(ticket: NewTicket) => {
    const pool = await getPool();
    await pool
    .request()
    .input ('event_name', ticket.event_name)
    .input ('event_location', ticket.event_location)
    .input ('price', ticket.price)
    .input ('event_date', ticket.event_date)
    .query ('INSERT INTO tickets (event_name, event_location, price, event_date) VALUES (@event_name, @event_location, @price, @event_date)');
    return { message: 'Ticket created successfully' }
}

//get ticket by id
export const getTicketById = async(id:number):Promise<Ticket[]> => {
    const pool = await getPool();
    const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM tickets WHERE ticket_no=@id')
    return result.recordset[0]
}

//delete a ticket
export const deleteTicket = async(id:number) => {
    const pool = await getPool();
    await pool.request()
    .input('id', id)
    .query('DELETE FROM tickets WHERE ticket_no = @id')
    return { message: 'Customer deleted successfully' }
}

//update a ticket
export const updateTicket = async(id:number, ticket: UpdateTicket) => {
    const pool = await getPool();
    await pool.request()
    .input('id', id)
    .input('event_name', ticket.event_name)
    .input ('event_location', ticket.event_location)
    .input ('price', ticket.price)
    .input ('event_date', ticket.event_date)
    .query ('UPDATE tickets SET event_name = @event_name, event_location = @event_location, price = @price, event_date = @event_date WHERE ticket_no = @id')
    return { message: 'Ticket updated successfully' }
}

//src/repositories/tickets.repository.ts
export const getTicketByEvent = async (event_name: string): Promise<Ticket | null> => {
    const pool = await getPool()
    const result = await pool
        .request()
        .input(event_name, event_name)
        .query('SELECT * FROM tickets WHERE event_name = @event_name');
    return result.recordset[0] || null;
}