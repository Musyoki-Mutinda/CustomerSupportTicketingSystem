import * as customerRepositories from "../repositories/customers.repository"
import { NewCustomer, UpdateCustomer } from "../Types/customer.type";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt'
import dotenv from 'dotenv'


dotenv.config() //load all variables

export const listCustomers = async() => await customerRepositories.getCustomers()
export const getCustomer = async (id: number) => await customerRepositories.getCustomerById(id);


export const createCustomer = async(customer: NewCustomer) => {
    //hash the password before saving
    if(customer.password){
        customer.password = await bcrypt.hash(customer.password, 10)
        console.log("hashed password", customer.password);
    }
    return await customerRepositories.createCustomer(customer)
}


export const deleteCustomer = async(id:number) => {
    await ensureCustomerExists(id);
    return await customerRepositories.deleteCustomer(id)
}

export const updateCustomer = async(id:number, customer:UpdateCustomer) => {
    await ensureCustomerExists(id);
    return await customerRepositories.updateCustomer(id, customer)
}

//Reusable function to check if user exists
const ensureCustomerExists = async (id: number) => {
    const customer = await customerRepositories.getCustomerById(id);
    if(!customer) {
        throw new Error('Customer not found');
    }
    return customer;
}

//login function
export const loginCustomer = async (email: string, password:string) => {
    //find a customer
    const customer = await customerRepositories.getCustomerByEmail(email)
    if(!customer){
        throw new Error('Invalid credentials')
    }

    //compare the passwords
    const isMatch = await bcrypt.compare(password, customer.password)
    if(!isMatch){
        throw new Error('Invalid credentials')
    }

    //create a JWT payload
    const payload = {
        sub: customer.customer_ID,
        first_name: customer.first_name,
        last_name: customer.last_name,
        exp: Math.floor(Date.now()/1000 + 60*60)
    }

    //generate a token
    const secret = process.env.JWT_SECRET as string
    if (!secret) throw new Error ('JWT Secret is not defined');

    const token = jwt.sign(payload, secret) //token to use as a card

    //return successful login
    return {
        message: 'Login successful',
        token,
        customer: {
            customer_ID: customer.customer_ID,
            FN: customer.first_name,
            LN: customer.last_name,
            email: customer.email,
            PN: customer.phone_no
        }
    }
}
