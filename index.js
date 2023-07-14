

import express from 'express'
import { get_admin_by_username, update_refresh_token, get_admin_by_refresh_token, register_user } from './controllers/database.js';
import bodyParser from 'body-parser'
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import cookieParser from 'cookie-parser';
import cors from "cors";

const PORT = process.env.PORT || 3001;

const app = express();
app.use(cookieParser())
app.use(cors({ credentials: true, }))
var jsonParser = bodyParser.json()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cookieParser());


// Serve static files from the React app

// app.get('/db/users', async (request, response) => {
//   pool.query('SELECT * FROM users', (error, results) => {
//     if (error) {
//       throw error
//     }
//     console.log(results)
//     response.status(200).json(results.rows)
//   })
// })

// app.get('/db/spouses', async (request, response) => {
//   pool.query('SELECT * FROM spouses', (error, results) => {
//     if (error) {
//       throw error
//     }
//     console.log(results)
//     response.status(200).json(results.rows)
//   })
// })

// app.get('/db/children', async (request, response) => {
//   pool.query('SELECT * FROM children', (error, results) => {
//     if (error) {
//       throw error
//     }
//     console.log(results)
//     response.status(200).json(results.rows)
//   })
// })

// app.get('/api/secret/', withAuth, function (req, res) {
//   res.send('The password is potato');
// });

// app.get('/checkToken', withAuth, function (req, res) {
//   console.log("Sending 200")
//   res.sendStatus(200);
// });


app.post('/join', jsonParser, async (req, res) => {
    // insert into users table
    try {
        register_user(req)
        res.status(200).json({ msg: "Success!" });
    } catch (error) {
        console.log(error)
        res.status(500).json({ msg: "There was an issue with the server. Please try again." });
    }

});


app.post('/login', jsonParser, async (req, res) => {
    try {
        const username = req.body.username;
        const password = req.body.password;
        const [admin] = await get_admin_by_username(username)

        if (!admin) return res.status(400).json({ msg: "Incorrect username or password" });

        const match = await bcrypt.compare(password, admin.password);
        if (!match) return res.status(400).json({ msg: "Incorrect username or password" });

        console.log('correct username and password')

        const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '15s'
        });

        console.log(accessToken)
        const refreshToken = jwt.sign({ username }, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d'
        });

        await update_refresh_token(refreshToken, username)

        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        console.log(error)
        res.status(404).json({ msg: "Incorrect username or password" });
    }
});


app.get('/logout', jsonParser, async (req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) return res.sendStatus(204);
    const [admin] = await get_admin_by_refresh_token(refreshToken);
    if (!admin) return res.sendStatus(204);
    const username = admin.username;
    await update_refresh_token(null, username)

    res.clearCookie('refreshToken');
    return res.sendStatus(200);
});

app.get('/token', jsonParser, async (req, res) => {
    try {
        console.log(req.cookies)
        const refreshToken = req.cookies.refreshToken;
        if (!refreshToken) return res.sendStatus(401);
        const [admin] = await get_admin_by_refresh_token(refreshToken)
        if (!admin) return res.sendStatus(403);
        jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if (err) return res.sendStatus(403);
            const username = admin.username;
            const accessToken = jwt.sign({ username }, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({ accessToken });
        });
    } catch (error) {
        console.log(error);
    }
});


app.post('/register/', function requestHandler(req, res) {
    insertDb(req)
    res.status(201).send(`User added`)
});

app.get("/json", (req, res) => {
    res.json({ "Choo Choo": "Welcome to your Express app 🚅" });
})

// // The "catchall" handler: for any request that doesn't
// // match one above, send back React's index.html file.
// app.get('*', (req, res) => {
//     res.sendFile(path.join(__dirname + '/client/build/index.html'));
// });



app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});

