const userRepository = require('../repositories/userRepository');
const languageRepository = require('../repositories/languageRepository');

const getUserProfile = async (userId) => {
    return await userRepository.findUserById(userId);
};

const updateLanguages = async (userId, native, target) => {
    const client = await userRepository.getClient();
    try {
        await client.query('BEGIN');
        await languageRepository.deleteUserLanguages(userId, client);
        await languageRepository.insertUserLanguages(userId, native, target, client);
        const user = await userRepository.findUserById(userId, client);
        await client.query('COMMIT');
        return user;
    } catch (err) {
        await client.query('ROLLBACK');
        throw err;
    } finally {
        client.release();
    }
};

const searchPartners = async (userId, native, target) => {
    return await userRepository.searchUsers(userId, native, target);
};

module.exports = { getUserProfile, updateLanguages, searchPartners };