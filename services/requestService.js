const requestRepository = require('../repositories/requestRepository');

const createRequest = async (fromUserId, toUserId) => {
    return await requestRepository.createRequest(fromUserId, toUserId);
};

const getIncomingRequests = async (userId) => {
    return await requestRepository.getIncomingRequests(userId);
};

const getOutgoingRequests = async (userId) => {
    return await requestRepository.getOutgoingRequests(userId);
};

const acceptRequest = async (requestId, userId) => {
    return await requestRepository.updateRequestStatus(requestId, userId, 'accepted');
};

const declineRequest = async (requestId, userId) => {
    return await requestRepository.updateRequestStatus(requestId, userId, 'declined');
};

const fetchMatches = async (userId) => {
    return await requestRepository.getMatches(userId);
};

module.exports = {
    createRequest,
    getIncomingRequests,
    getOutgoingRequests,
    acceptRequest,
    declineRequest,
    fetchMatches
};