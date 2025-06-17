CREATE TABLE user_languages (
                                user_id INTEGER REFERENCES users(id),
                                language_id INTEGER REFERENCES languages(id),
                                type TEXT CHECK (type IN ('native', 'target')),
                                PRIMARY KEY (user_id, language_id, type)
);