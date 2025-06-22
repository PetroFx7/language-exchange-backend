const pool = require('../config/db');

const createUser = async (email, hashedPassword, full_name) => {
    const result = await pool.query(
        'INSERT INTO users (email, password, full_name) VALUES ($1, $2, $3) RETURNING id',
        [email, hashedPassword, full_name]
    );
    return result.rows[0].id;
};

const findUserByEmail = async (email) => {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    return result.rows[0];
};

const findUserById = async (id, client = pool) => {
    const result = await client.query(
        `SELECT u.id, u.email, u.full_name,
                COALESCE(json_agg(json_build_object(
                        'language_id', ul.language_id,
                        'type', ul.type
                                  )) FILTER (WHERE ul.language_id IS NOT NULL), '[]') AS languages
         FROM users u
                  LEFT JOIN user_languages ul ON u.id = ul.user_id
         WHERE u.id = $1
         GROUP BY u.id`,
        [id]
    );
    return result.rows[0];
};

const searchUsers = async (userId, native, target) => {
    if (native && target) {
        const result = await pool.query(
            `SELECT u.id, u.email, u.full_name,
                    COALESCE(json_agg(json_build_object(
                            'language_id', ul.language_id,
                            'type', ul.type
                                      )) FILTER (WHERE ul.language_id IS NOT NULL), '[]'::json) AS languages
             FROM users u
                      JOIN user_languages ul ON u.id = ul.user_id
             WHERE u.id != $1
               AND EXISTS (
                 SELECT 1 FROM user_languages
                 WHERE user_id = u.id AND language_id = $2 AND type = 'native'
             )
               AND EXISTS (
                 SELECT 1 FROM user_languages
                 WHERE user_id = u.id AND language_id = $3 AND type = 'target'
             )
             GROUP BY u.id`,
            [userId, target, native]
        );
        return result.rows;
    } else {
        const result = await pool.query(
            `SELECT u.id, u.email, u.full_name,
                    COALESCE(json_agg(json_build_object(
                            'language_id', ul.language_id,
                            'type', ul.type
                                      )) FILTER (WHERE ul.language_id IS NOT NULL), '[]'::json) AS languages
             FROM users u
                      LEFT JOIN user_languages ul ON u.id = ul.user_id
             WHERE u.id != $1
             GROUP BY u.id`,
            [userId]
        );
        return result.rows;
    }
};

const getClient = async () => {
    return await pool.connect();
};

module.exports = { createUser, findUserByEmail, findUserById, searchUsers, getClient };