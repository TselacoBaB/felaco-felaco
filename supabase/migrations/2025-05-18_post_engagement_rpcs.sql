-- Supabase SQL for engagement RPCs (to be run in SQL editor)
-- Add userId to likes array if not present
create or replace function add_like_to_post(post_id uuid, user_id text)
returns void as $$
begin
  update posts
  set likes = array_append(likes, user_id)
  where id = post_id and not (likes @> array[user_id]);
end;
$$ language plpgsql;

-- Add userId to saves array if not present
create or replace function add_save_to_post(post_id uuid, user_id text)
returns void as $$
begin
  update posts
  set saves = array_append(saves, user_id)
  where id = post_id and not (saves @> array[user_id]);
end;
$$ language plpgsql;

-- Increment shares
create or replace function increment_post_shares(post_id uuid)
returns void as $$
begin
  update posts set shares = shares + 1 where id = post_id;
end;
$$ language plpgsql;

-- Record a view only if user hasn't viewed before (optional: implement a post_views table for deduplication)
create or replace function record_post_view(post_id uuid, user_id text)
returns void as $$
begin
  update posts set view_count = view_count + 1 where id = post_id;
end;
$$ language plpgsql;
