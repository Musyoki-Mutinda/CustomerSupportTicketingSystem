
import express from 'express';
import { getPool } from './db/config';

const app = express()

app.get('/', (req, res) =>{
    res.send("Hello, the express server is running")
})

const port = 8081

app.listen(port, () =>{
    console.log(`Server is running on port: http://localhost:${port}`)
})

//Fetch customers with minimal error handling
app.get('/customers', (req,res) => {
    getPool().then(pool => {
        return pool.request().query('SELECT * FROM customers')
    }).then (result => {
        console.log("results", result);
        res.json(result.recordset)
    }).catch(err => {
        console.log("SQL error", err);
        res.status(500).send("Server Error")
    })
})

//Fetch tickets with minimal error handling
app.get('/tickets', (req,res) => {
    getPool().then(pool => {
        return pool.request().query('SELECT * FROM tickets')
    }).then (result => {
        console.log("results", result);
        res.json(result.recordset)
    }).catch(err => {
        console.log("SQL error", err);
        res.status(500).send("Server Error")
    })
})

//Fetch comments with minimal error handling
app.get('/comments', (req,res) => {
    getPool().then(pool => {
        return pool.request().query('SELECT * FROM comments')
    }).then (result => {
        console.log("results", result);
        res.json(result.recordset)
    }).catch(err => {
        console.log("SQL error", err);
        res.status(500).send("Server Error")
    })
})


getPool()
.then (() => console.log("Database connected successfully"))
.catch((err: any) => console.log("Database connection failed", err))