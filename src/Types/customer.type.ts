export interface Customer{
    customer_ID: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_no: string;
    password: string;
}

export interface NewCustomer{
    customer_ID: number;
    first_name: string;
    last_name: string;
    email: string;
    phone_no: string;
    password: string;
}

//update customer type
export interface UpdateCustomer{
    customer_ID?: number;
    first_name?: string;
    last_name?: string;
    phone_no?: string;
    password?: string;
}