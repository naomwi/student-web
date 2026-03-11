-- 1. Add channel_id to study_groups
alter table study_groups add column if not exists channel_id uuid references channels(id);

-- 2. For existing groups that have no channel yet, create one
insert into channels (name, type)
select name, 'group' from study_groups where channel_id is null
returning id;

-- 3. Link the newly created channels back
-- (manual step: run UPDATE study_groups SET channel_id = <id> for each existing group,
--  OR use the trigger below for future groups)

-- 4. Trigger: auto-create a channel when a new group is created
create or replace function create_group_channel()
returns trigger language plpgsql as $$
declare v_channel_id uuid;
begin
  insert into channels (name, type) values (NEW.name, 'group')
  returning id into v_channel_id;
  update study_groups set channel_id = v_channel_id where id = NEW.id;
  return NEW;
end;
$$;

drop trigger if exists trg_create_group_channel on study_groups;
create trigger trg_create_group_channel
  after insert on study_groups
  for each row execute function create_group_channel();
