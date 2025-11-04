import { Express } from "express"
import * as ticketController from "../controllers/tickets.controllers"

const ticketRoutes = (app: Express) => {
    //get all tickets
    app.get("/tickets", ticketController.getAllTickets);
    //get specific ticket by id
    app.get("/tickets/:id", ticketController.getTicketById);
    //add ticket
    app.post("/addticket", ticketController.createTicket);
    //update ticket
    app.put("/tickets/:id", ticketController.updateTicket);
    //delete ticket
    app.delete("/tickets/:id", ticketController.deleteTicket);
}

export default ticketRoutes;