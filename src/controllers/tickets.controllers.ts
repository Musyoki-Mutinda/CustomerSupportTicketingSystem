import { Request, Response } from "express"
import * as ticketServices from '../services/ticket.service'


//get all tickets
export const getAllTickets = async (req:Request, res: Response) => {
    try {
        const tickets = await ticketServices.listTickets()
        res.status(200).json(tickets)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

//create new ticket
export const createTicket = async (req:Request, res:Response) => {
    const ticket = req.body;
    try {
        const result = await ticketServices.createTicket(ticket)
        res.status(201).json(result)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}

//get ticket by id
export const getTicketById = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
        const ticket = await ticketServices.getTicket(id)
        if (ticket) {
            res.status(200).json(ticket) //returning the todo
        } else{
            res.status(404).json({ message: 'Customer not found' });
        } 
    } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
}

//delete a ticket
    export const deleteTicket = async (req: Request, res: Response) => {
        const id = parseInt (req.params.id)
        //bad request if id is not a number
        if(isNaN(id)) {
            return res.status(400).json({ message: 'Invalid customer id' });
        }

        try {
            const result = await ticketServices.deleteTicket(id)
            res.status(200).json(result)
        } catch (error:any) {
            //not found if user does not exist
            if (error.message === 'Customer not found') {
                return res.status(404).json({ message: 'Customer not found' })
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    //update a ticket
    export const updateTicket = async (req: Request, res:Response) => {
        const id = parseInt(req.params.id);

        //bad request if id is not a number
        if(isNaN(id)) {
            return res.status(400).json({ message: 'Invalid customer id' });
        }

        //proceed to update
        try {
            const ticket = req.body;
            const result = await ticketServices.updateTicket(id, ticket)
            res.status(200).json(result)
        } catch (error:any) {
            //not found if the user does not exist
            if (error.message === 'Ticket not found') {
                return res.status(404).json({ message:'Ticket not found' });
            } else {
                res.status(500).json({ error: error.message })
            }
        }
    }

   