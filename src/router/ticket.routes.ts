import { Express } from "express"
import * as ticketController from "../controllers/tickets.controllers"

const ticketRoutes = (app: Express) => {
    //get all tickets
    app.get("/tickets", ticketController.getAllTickets);
    //get specific ticket by id
    app.get("/tickets/:id", ticketController.getTicketById);
    //add customer
    app.post("/addticket", ticketController.createTicket);
    //update customer
    app.put("/tickets/:id", ticketController.updateTicket);
    //update customer
    app.delete("/tickets/:id", ticketController.deleteTicket);
}

export default ticketRoutes;