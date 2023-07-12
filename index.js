import express from 'express';
import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()


const app = express();

const pool = mysql.createPool(
    {
        host: '127.0.0.1',
        user: 'root',
        password: '',
        database: 'almalikiyah'
    }
).promise()

app.get('/', async (req, res) => {
    const [admin] = await pool.query("SELECT * FROM admin")
    console.log(admin)
    res.send(admin, 'Choo Choo! Welcome to your Express app 🚅');
})

app.get("/json", (req, res) => {
    res.json({ "Choo Choo": "Welcome to your Express app 🚅" });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})