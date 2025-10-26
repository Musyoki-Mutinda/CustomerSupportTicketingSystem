import { Express } from "express"
import * as customerController from "../controllers/customer.controllers"

const customerRoutes = (app: Express) => {
    //get all customers
    app.get("/customers", customerController.getAllCustomers);
    //get specific customer by id
    app.get("/customers/:id", customerController.getCustomerById);
    //add customer
    app.post("/addcustomer", customerController.createCustomer);
    //update customer
    app.put("/customers/:id", customerController.updateCustomer);
    //update customer
    app.delete("/customers/:id", customerController.deleteCustomer);
    //login customer
    app.post('/login', customerController.loginCustomer)
}

export default customerRoutes;