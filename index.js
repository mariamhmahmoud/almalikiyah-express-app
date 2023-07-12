import express from 'express';
import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()


const app = express();

const pool = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
}).promise();

app.get('/', async (req, res) => {
    const [admin] = await pool.query("SELECT * FROM admin")
    res.send(JSON.stringify(admin[0]));
})

app.get("/json", (req, res) => {
    res.json({ "Choo Choo": "Welcome to your Express app 🚅" });
})

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})