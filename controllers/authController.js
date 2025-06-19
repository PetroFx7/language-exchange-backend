const authService = require('../services/authService');

const register = async (req, res) => {
    const { email, password, full_name } = req.body;

    if (!email || !password || !full_name) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
        return res.status(400).json({ message: 'Invalid email format' });
    }
    if (password.length < 8) {
        return res.status(400).json({ message: 'Password must be at least 8 characters' });
    }

    try {
        const userId = await authService.registerUser(email, password, full_name);
        res.json({ message: 'User registered successfully', user_id: userId });
    } catch (err) {
        if (err.code === '23505') {
            res.status(400).json({ message: 'User already exists' });
        } else {
            res.status(500).json({ message: 'Server Error' });
        }
    }
};

const login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const result = await authService.loginUser(email, password);
        if (!result) {
            return res.status(401).json({ message: 'Invalid Credentials' });
        }
        res.json(result);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { register, login };