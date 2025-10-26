export interface Ticket{
    ticket_no: number;
    event_name: string;
    event_location: string;
    price: number;
    event_date: string;
}

export interface NewTicket{
    ticket_no: number;
    event_name: string;
    event_location: string;
    price: number;
    event_date: string;
}

//update ticket type
export interface UpdateTicket{
    event_no?: number;
    event_name?: string;
    event_location?: string;
    price?: number;
    event_date?: string;
}