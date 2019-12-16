CREATE TABLE IF NOT EXISTS name_pointers (
       id SERIAL PRIMARY KEY,
       name_hash VARCHAR(255) NOT NULL,
       pointer_type VARCHAR(255) NOT NULL,
       pointer_target VARCHAR(255) NOT NULL,
       active_from BIGINT NOT NULL,
       expires BIGINT NOT NULL,
       transaction_id INT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE);


CREATE INDEX IF NOT EXISTS name_pointers_name_hash_idx ON name_pointers(name_hash);
CREATE INDEX IF NOT EXISTS name_pointers_pointer_type_idx ON name_pointers(pointer_type);
CREATE INDEX IF NOT EXISTS name_pointers_pointer_target_idx ON name_pointers(pointer_target);
CREATE INDEX IF NOT EXISTS name_pointers_active_from_idx ON name_pointers(active_from);
CREATE INDEX IF NOT EXISTS name_pointers_expires_id_idx ON name_pointers(expires);
