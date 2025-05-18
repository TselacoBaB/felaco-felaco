-- Supabase Edge Function (SQL) for fetching user conversations
-- Returns a list of users the current user has messaged or received messages from, with last message and unread count

create or replace function get_user_conversations(user_id uuid)
returns table (
  id uuid,
  name text,
  message text,
  time timestamptz,
  unread int
) as $$
begin
  return query
    with all_messages as (
      select *,
        case when sender_id = user_id then receiver_id else sender_id end as other_user_id
      from messages
      where sender_id = user_id or receiver_id = user_id
    ),
    last_messages as (
      select distinct on (other_user_id) other_user_id, id, content as message, created_at as time
      from all_messages
      order by other_user_id, created_at desc
    ),
    unread_counts as (
      select other_user_id, count(*) as unread
      from all_messages
      where receiver_id = user_id and seen = false
      group by other_user_id
    )
    select
      u.id,
      coalesce(u.username, u.full_name, u.email) as name,
      lm.message,
      lm.time,
      coalesce(uc.unread, 0) as unread
    from last_messages lm
    join auth.users u on u.id = lm.other_user_id
    left join unread_counts uc on uc.other_user_id = lm.other_user_id
    order by lm.time desc;
end;
$$ language plpgsql security definer;
