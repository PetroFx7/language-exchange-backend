const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const bodyParser = require('body-parser');
const pool = require('./db');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());

const SECRET_KEY = process.env.JWT_SECRET;

//REGISTRATION

app.post('/auth/register', async (req, res) => {
    const {email, password, full_name} = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 12);
        const result = await pool.query('INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING id',
            [email, hashedPassword, full_name]);
        res.json({
            message: 'User registered successfully',
            user_id: result.rows[0].id
        });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).send({
                message: 'User already exists'
            });
        } else {
            res.status(500).send({
                message: 'Server Error'
            });
        }
    }
})
//LOG IN

app.post('/auth/login', async (req, res) => {
    const {email, password} = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(401).send({
                message: 'Invalid Credentials'
            });
        }

        const token = jwt.sign({id: user.id}, SECRET_KEY, {expiresIn: '1h'});

        res.json({
            token,
            profile: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
            }
        })
    } catch (err) {
        console.log("error");
        res.status(500).send({
            message: 'Server Error'
        });
    }
})


function authenticate(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).send({
        message: 'Invalid Credentials'
    });

    jwt.verify(token, SECRET_KEY, (err, payload) => {
        if (err) {
            return res.status(403).send({
                message: 'Invalid token'
            });
        }
        req.user = payload;
        next();
    });
}

app.get('/users/me', authenticate, async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT id, email, full_name, languages FROM users WHERE id = $1',
            [req.user.id]
        );
        const user = result.rows[0];
        if (!user) return res.status(404).send({
            message: 'User not found'
        });
        res.json(user);
    } catch (err) {
        console.log(err);
        res.status(500).send({
            message: 'Server Error'
        });
    }
})

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
})