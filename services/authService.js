const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const registerUser = async (email, password, full_name) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    const userId = await userRepository.createUser(email, hashedPassword, full_name);
    return userId;
};

const loginUser = async (email, password) => {
    const user = await userRepository.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        return null;
    }
    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
    return {
        token,
        profile: {
            id: user.id,
            email: user.email,
            full_name: user.full_name
        }
    };
};

module.exports = { registerUser, loginUser };