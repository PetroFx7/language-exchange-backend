const pool = require('../config/db');

const createRequest = async (fromUserId, toUserId) => {
    const result = await pool.query(
        `INSERT INTO match_requests (from_user_id, to_user_id, status)
         VALUES ($1, $2, 'pending') RETURNING *`,
        [fromUserId, toUserId]
    );
    return result.rows[0];
};

const getIncomingRequests = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM match_requests WHERE to_user_id = $1 AND status = 'pending'`,
        [userId]
    );
    return result.rows;
};

const getOutgoingRequests = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM match_requests WHERE from_user_id = $1 AND status = 'pending'`,
        [userId]
    );
    return result.rows;
};

const updateRequestStatus = async (requestId, userId, status) => {
    const result = await pool.query(
        `UPDATE match_requests SET status = $1
         WHERE id = $2 AND to_user_id = $3 RETURNING *`,
        [status, requestId, userId]
    );
    return result.rowCount > 0 ? result.rows[0] : null;
};

const getMatches = async (userId) => {
    const result = await pool.query(
        `SELECT * FROM match_requests
         WHERE status = 'accepted' AND (from_user_id = $1 OR to_user_id = $1)`,
        [userId]
    );
    return result.rows;
};

module.exports = {
    createRequest,
    getIncomingRequests,
    getOutgoingRequests,
    updateRequestStatus,
    getMatches
};