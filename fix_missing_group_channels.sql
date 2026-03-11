DO $$
DECLARE
    grp RECORD;
    new_channel_id UUID;
BEGIN
    FOR grp IN SELECT id, name FROM study_groups WHERE channel_id IS NULL LOOP
        -- Tạo channel mới
        INSERT INTO channels (name, type) 
        VALUES (grp.name, 'group') 
        RETURNING id INTO new_channel_id;

        -- Cập nhật lại cho group
        UPDATE study_groups 
        SET channel_id = new_channel_id 
        WHERE id = grp.id;
    END LOOP;
END $$;
