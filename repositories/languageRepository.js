const pool = require('../config/db');

const deleteUserLanguages = async (userId, client = pool) => {
    await client.query('DELETE FROM user_languages WHERE user_id = $1', [userId]);
};

const insertUserLanguages = async (userId, native, target, client = pool) => {
    const values = [];
    native.forEach(langId => values.push(`(${userId}, ${langId}, 'native')`));
    target.forEach(langId => values.push(`(${userId}, ${langId}, 'target')`));
    if (values.length > 0) {
        await client.query(
            `INSERT INTO user_languages (user_id, language_id, type) VALUES ${values.join(', ')}`
        );
    }
};

module.exports = { deleteUserLanguages, insertUserLanguages };