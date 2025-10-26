import { getPool } from "../db/config";
import { NewCustomer, Customer, UpdateCustomer } from "../Types/customer.type"

//get all customers
export const getCustomers = async():Promise<Customer[]> => {
    const pool = await getPool() //await db connection to open
    const results = await pool.request().query(`SELECT * FROM customers`)
    return results.recordset
}

//create new customer -customer:any changed to customer: NewCustomer
export const createCustomer = async(customer: NewCustomer) => {
    const pool = await getPool();
    await pool
    .request()
    .input ('customer_ID', customer.customer_ID)
    .input ('fIrst_name', customer.first_name)
    .input ('last_name', customer.last_name)
    .input ('email', customer.email)
    .input ('phone_no', customer.phone_no)
    .input('password', customer.password) //hashed
    .query ('INSERT INTO customers (customer_ID, first_name, last_name, email, phone_no, password) VALUES (@customer_ID, @first_name, @last_name, @email, @phone_no, @password)');
    return { message: 'Customer created successfully' }
}

//get customer by id
export const getCustomerById = async(id:number):Promise<Customer[]> => {
    const pool = await getPool();
    const result = await pool
    .request()
    .input('id', id)
    .query('SELECT * FROM customers WHERE customer_ID=@id')
    return result.recordset[0]
}

//delete a customer
export const deleteCustomer = async(id:number) => {
    const pool = await getPool();
    await pool.request()
    .input('id', id)
    .query('DELETE FROM customers WHERE customer_ID = @id')
    return { message: 'Customer deleted successfully' }
}

//update a customer
export const updateCustomer = async(id:number, customer: UpdateCustomer) => {
    const pool = await getPool();
    await pool.request()
    .input('id', id)
    .input('first_name', customer.first_name)
    .input ('last_name', customer.last_name)
    .input ('phone_no', customer.phone_no)
    .query ('UPDATE customers SET first_name =@first_name, last_name = @last_name, phone_no = @phone_no WHERE customer_ID = @id')
    return { message: 'Customer updated successfully' }
}

//src/repositories/customers.repository.ts
export const getCustomerByEmail = async (email: string): Promise<Customer | null> => {
    const pool = await getPool()
    const result = await pool
        .request()
        .input(email, email)
        .query('SELECT * FROM customers WHERE email = @email');
    return result.recordset[0] || null;
}