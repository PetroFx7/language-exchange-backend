const requestService = require('../services/requestService');

const createRequest = async (req, res) => {
    const fromUserId = req.user.id;
    const { to_user_id } = req.body;

    if (!to_user_id || fromUserId === parseInt(to_user_id)) {
        return res.status(400).json({ message: 'Invalid to_user id' });
    }

    try {
        const request = await requestService.createRequest(fromUserId, to_user_id);
        res.status(201).json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getIncomingRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const requests = await requestService.getIncomingRequests(userId);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getOutgoingRequests = async (req, res) => {
    const userId = req.user.id;
    try {
        const requests = await requestService.getOutgoingRequests(userId);
        res.json(requests);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const acceptRequest = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const request = await requestService.acceptRequest(id, userId);
        if (!request) {
            return res.status(403).json({ message: 'Not allowed or request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const declineRequest = async (req, res) => {
    const userId = req.user.id;
    const { id } = req.params;

    try {
        const request = await requestService.declineRequest(id, userId);
        if (!request) {
            return res.status(403).json({ message: 'Not allowed or request not found' });
        }
        res.json(request);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

const getMatches = async (req, res) => {
    const userId = req.user.id;
    try {
        const matches = await requestService.fetchMatches(userId);
        res.json(matches);
    } catch (err) {
        res.status(500).json({ message: 'Server Error' });
    }
};

module.exports = {
    createRequest,
    getIncomingRequests,
    getOutgoingRequests,
    acceptRequest,
    declineRequest,
    getMatches
};