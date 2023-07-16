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

// const pool = mysql.createPool(
//     {
//         host: '127.0.0.1',
//         user: 'root',
//         password: '',
//         database: 'almalikiyah'
//     }
// ).promise()

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
    const firstName = req.body["firstName"]
    const lastName = req.body["lastName"]
    const email = req.body["email"]
    const phoneNumber = req.body["phoneNumber"]
    const address = req.body["address"]
    const birthday = req.body["birthday"]

    // insert into users table
    var queryText = 'INSERT INTO users(firstName, lastName, email, phoneNumber, address, birthday) VALUES(?, ?, ?, ?, ?, ?)'
    var result = await pool.query(queryText, [firstName, lastName, email, phoneNumber, address, birthday]);
    result = await pool.query("SELECT last_insert_id() AS userId")
    const userId = result[0][0]['userId']

    å
    // insert into spouses table
    const spouse = req.body["spouse"]
    const spouseFirstName = spouse["firstName"]
    const spouseLastName = spouse["lastName"]
    const spouseBirthday = spouse["birthday"]

    queryText = 'INSERT INTO spouses(userid, firstName, lastName, birthday) VALUES(?, ?, ?, ?)'
    result = await pool.query(queryText, [userId, spouseFirstName, spouseLastName, spouseBirthday])

    // insert into childrens table
    const childrenList = req.body["children"]
    for (let i = 0; i < childrenList.length; ++i) {
        const childFirstName = childrenList[i]["firstName"]
        const childLastName = childrenList[i]["lastName"]
        const childBirthday = childrenList[i]["birthday"]

        queryText = 'INSERT INTO children(userid, firstName, lastName, birthday) VALUES(?, ?, ?, ?)'
        result = await pool.query(queryText, [userId, childFirstName, childLastName, childBirthday])
    }

}