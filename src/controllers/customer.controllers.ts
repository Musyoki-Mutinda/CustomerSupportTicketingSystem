
import * as customersrepository from "../repositories/customers.repository"


import { Request, Response } from "express"
import * as customerServices from '../services/customer.service'


export const getAllCustomers = async (req:Request, res: Response) => {
    try {
        const customers = await customerServices.listCustomers()
        res.status(200).json(customers)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}


export const createCustomer = async (req:Request, res:Response) => {
    const customer = req.body;
    try {
        const result = await customerServices.createCustomer(customer)
        res.status(201).json(result)
    } catch (error: any) {
        res.status(500).json({ error: error.message })
    }
}


export const getCustomerById = async(req: Request, res: Response) => {
    const id = parseInt(req.params.id)
    try {
        const customer = await customerServices.getCustomer(id)
        if (customer) {
            res.status(200).json(customer) //returning the todo
        } else{
            res.status(404).json({ message: 'Customer not found' });
        } 
    } catch (error:any) {
            res.status(500).json({ error: error.message });
        }
}


    export const deleteCustomer = async (req: Request, res: Response) => {
        const id = parseInt (req.params.id)
    
        if(isNaN(id)) {
            return res.status(400).json({ message: 'Invalid customer id' });
        }

        try {
            const result = await customerServices.deleteCustomer(id)
            res.status(200).json(result)
        } catch (error:any) {
            
            if (error.message === 'Customer not found') {
                return res.status(404).json({ message: 'Customer not found' })
            } else {
                res.status(500).json({ error: error.message });
            }
        }
    }

    export const updateCustomer = async (req: Request, res:Response) => {
        const id = parseInt(req.params.id);

        
        if(isNaN(id)) {
            return res.status(400).json({ message: 'Invalid customer id' });
        }

        
        try {
            const customer = req.body;
            const result = await customerServices.updateCustomer(id, customer)
            res.status(200).json(result)
        } catch (error:any) {
            
            if (error.message === 'Customer not found') {
                return res.status(404).json({ message:'Customer not found' });
            } else {
                res.status(500).json({ error: error.message })
            }
        }
    }

    
    export const loginCustomer = async(req: Request, res: Response) => {
        try {
            const { email, password } = req.body;

            const result = await customerServices.loginCustomer(email, password);
            res.status(200).json(result)
        } catch (error: any) {
            if (error.message === 'Customer not found') {
                res.status(404).json ({ error: error.message });
            } else if (error.message === 'Invalid credentials') {
                res.status(401).json({error: error.message});
            } else {
                res.status(500).json({ error: "Internal server error" });
            }
        }
    }