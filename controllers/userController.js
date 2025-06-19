const userService = require('../services/userService');

const getProfile = async (req, res) => {
    try {
        const user = await userService.getUserProfile(req.user.id);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const updateLanguages = async (req, res) => {
    const userId = req.user.id;
    const { native = [], target = [] } = req.body;

    try {
        const user = await userService.updateLanguages(userId, native, target);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const searchUsers = async (req, res) => {
    const userId = req.user.id;
    const { native, target } = req.query;

    try {
        const users = await userService.searchPartners(userId, native, target);
        res.json(users);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = { getProfile, updateLanguages, searchUsers };