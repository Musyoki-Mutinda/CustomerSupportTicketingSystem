import * as ticketRepositories from "../repositories/tickets.repository"
import { NewTicket, UpdateTicket } from "../Types/ticket.type";
import dotenv from 'dotenv'



dotenv.config() //load all variables

export const listTickets = async() => await ticketRepositories.getTickets()
export const getTicket = async (id: number) => await ticketRepositories.getTicketById(id);


export const createTicket = async(ticket: NewTicket) => {
    //hash the password before saving
    //if(customer.password){
        //customer.password = await bcrypt.hash(customer.password, 10)
        //console.log("hashed password", customer.password);
    //}
    return await ticketRepositories.createTicket(ticket)
}


export const deleteTicket = async(id:number) => {
    await ensureTicketExists(id);
    return await ticketRepositories.deleteTicket(id)
}

export const updateTicket = async(id:number, ticket:UpdateTicket) => {
    await ensureTicketExists(id);
    return await ticketRepositories.updateTicket(id, ticket)
}

//Reusable function to check if ticket exists
const ensureTicketExists = async (id: number) => {
    const ticket = await ticketRepositories.getTicketById(id);
    if(!ticket) {
        throw new Error('Ticket not found');
    }
    return ticket;
}

