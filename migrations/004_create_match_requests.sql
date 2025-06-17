CREATE TABLE match_requests (
                                id SERIAL PRIMARY KEY,
                                from_user_id INTEGER REFERENCES users(id),
                                to_user_id INTEGER REFERENCES users(id),
                                status TEXT CHECK (status IN ('pending', 'accepted', 'declined'))
);