import mysql from 'mysql2'
import dotenv from 'dotenv'

dotenv.config()


const pool = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DB,
}).promise();

export async function get_admin_by_username(username) {
    const [admin] = await pool.query("SELECT * FROM admin WHERE username = ?", [username])
    return admin;
}

export async function get_admin_by_refresh_token(refreshToken) {
    const [admin] = await pool.query("SELECT * FROM admin WHERE refresh_token = ?", [refreshToken])
    return admin;
}

export async function update_refresh_token(refreshToken, username) {
    await pool.query("UPDATE admin SET refresh_token = ? WHERE username = ?", [refreshToken, username])

}

export async function logout(refreshToken) {
    if (!refreshToken) return res.sendStatus(204);
    const [admin] = await pool.query("SELECT * FROM admin WHERE refresh_token = ?", [refreshToken])
    if (!admin[0]) return res.sendStatus(204);
    const username = admin[0].username;
    await pool.query("UPDATE admin SET refresh_token = ? WHERE username = ?", [null, username])

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export async function register_user(req) {
    var firstName = req.body["firstName"]
    var lastName = req.body["lastName"]
    var email = req.body["email"]
    var phoneNumber = req.body["phoneNumber"]
    var address = req.body["address"]
    var birthday = req.body["birthday"]

    // insert into users table
    var queryText = 'INSERT INTO users(firstName, lastName, email, phoneNumber, address, birthday) VALUES(?, ?, ?, ?, ?, ?)'
    var result = await pool.query(queryText, [firstName, lastName, email, phoneNumber, address, birthday]);

    // insert into spouses table
    spouse = req.body["spouse"]
    firstName = spouse["firstName"]
    lastName = spouse["lastName"]
    birthday = spouse["birthday"]
    queryText = 'INSERT INTO spouses(userid, firstName, lastName, birthday) VALUES($1, $2, $3, $4)'
    result = await pool.query(queryText, [parseInt(userid), firstName, lastName, birthday])

    // // insert into childrens table
    // childrenList = req.body["children"]
    // for (let i = 0; i < childrenList.length; ++i) {
    //     firstName = childrenList[i]["firstName"]
    //     lastName = childrenList[i]["lastName"]
    //     birthday = childrenList[i]["birthday"]

    //     queryText = 'INSERT INTO children(userid, firstName, lastName, birthday) VALUES($1, $2, $3, $4)'
    //     result = await pool.query(queryText, [parseInt(userid), firstName, lastName, birthday])
    // }

}