-- Run once in Supabase > SQL Editor
create table profiles(id uuid primary key references auth.users on delete cascade,display_name text not null check(char_length(display_name) between 1 and 40),avatar_url text,created_at timestamptz default now());
create table admins(user_id uuid primary key references auth.users on delete cascade,role text not null check(role in('super_admin','admin','recruitment_manager','content_manager')),created_at timestamptz default now());
create table applications(id uuid primary key default gen_random_uuid(),created_at timestamptz not null default now(),
 full_name text not null check(char_length(full_name) between 2 and 100),age int not null check(age between 5 and 100),grade text not null check(char_length(grade)<=100),
 institution text not null check(char_length(institution)<=150),email text not null check(email ~* '^[^@\s]+@[^@\s]+\.[^@\s]+$' and char_length(email)<=200),
 phone text not null check(char_length(phone) between 6 and 20),city text not null check(char_length(city)<=80),role text not null check(char_length(role)<=100),
 experience text not null check(char_length(experience)<=1500),skills text not null check(char_length(skills)<=500),portfolio text not null check(char_length(portfolio)<=300),
 intro text not null check(char_length(intro) between 10 and 1500),status text not null default 'pending' check(status in('pending','shortlisted','accepted','rejected')));
create table volume_settings(volume int primary key,comments_enabled boolean not null default true);
insert into volume_settings select generate_series(1,11);
create table comments(id uuid primary key default gen_random_uuid(),volume int not null references volume_settings,user_id uuid not null references profiles on delete cascade,
 parent_id uuid references comments on delete cascade,body text not null check(char_length(body) between 1 and 1000),created_at timestamptz not null default now(),edited_at timestamptz);
create table members(id uuid primary key default gen_random_uuid(),role_slug text not null,name text not null check(char_length(name)<=100));
create table activity_log(id bigint generated always as identity primary key,actor uuid,action text,detail text,created_at timestamptz default now());

create function is_admin(variadic roles text[]) returns boolean language sql security definer stable set search_path=public as
$$ select exists(select 1 from admins where user_id=auth.uid() and role=any(roles)) $$;

create function new_user() returns trigger language plpgsql security definer set search_path=public as
$$ begin insert into profiles(id,display_name) values(new.id,left(coalesce(nullif(trim(new.raw_user_meta_data->>'display_name'),''),'Member'),40)); return new; end $$;
create trigger on_signup after insert on auth.users for each row execute function new_user();

-- spam guard: max 5 comments/minute/user; replies must stay inside the same volume
create function comment_guard() returns trigger language plpgsql as
$$ begin
 if (select count(*) from comments where user_id=new.user_id and created_at>now()-interval '1 minute')>=5 then raise exception 'Slow down'; end if;
 if new.parent_id is not null and (select volume from comments where id=new.parent_id)<>new.volume then raise exception 'Reply must be in the same volume'; end if;
 return new; end $$;
create trigger t_guard before insert on comments for each row execute function comment_guard();

alter table profiles enable row level security; alter table admins enable row level security; alter table applications enable row level security;
alter table volume_settings enable row level security; alter table comments enable row level security; alter table members enable row level security; alter table activity_log enable row level security;

revoke all on profiles,admins,applications,volume_settings,comments,members,activity_log from anon,authenticated;
grant select on profiles,comments,members,volume_settings to anon,authenticated;
grant select on admins,applications,activity_log to authenticated;
grant insert(full_name,age,grade,institution,email,phone,city,role,experience,skills,portfolio,intro) on applications to anon,authenticated;
grant update(status) on applications to authenticated;
grant insert(volume,parent_id,body,user_id) on comments to authenticated;
grant update(body,edited_at),delete on comments to authenticated;
grant update(display_name,avatar_url) on profiles to authenticated;
grant update(comments_enabled) on volume_settings to authenticated;
grant insert,update,delete on admins,members to authenticated;
grant insert on activity_log to authenticated;

create policy p_sel on profiles for select using(true);
create policy p_upd on profiles for update to authenticated using(id=auth.uid());
create policy ad_sel on admins for select to authenticated using(user_id=auth.uid() or is_admin('super_admin'));
create policy ad_w on admins for all to authenticated using(is_admin('super_admin') and role<>'super_admin') with check(is_admin('super_admin') and role<>'super_admin');
create policy a_ins on applications for insert to anon,authenticated with check(status='pending');
create policy a_sel on applications for select to authenticated using(is_admin('super_admin','admin','recruitment_manager'));
create policy a_upd on applications for update to authenticated using(is_admin('super_admin','admin','recruitment_manager'));
create policy v_sel on volume_settings for select using(true);
create policy v_upd on volume_settings for update to authenticated using(is_admin('super_admin','admin','content_manager'));
create policy c_sel on comments for select using(true);
create policy c_ins on comments for insert to authenticated with check(user_id=auth.uid() and (select v.comments_enabled from volume_settings v where v.volume=comments.volume));
create policy c_upd on comments for update to authenticated using(user_id=auth.uid()) with check(user_id=auth.uid());
create policy c_del on comments for delete to authenticated using(user_id=auth.uid() or is_admin('super_admin','admin','content_manager'));
create policy m_sel on members for select using(true);
create policy m_w on members for all to authenticated using(is_admin('super_admin','admin','content_manager')) with check(is_admin('super_admin','admin','content_manager'));
create policy l_sel on activity_log for select to authenticated using(is_admin('super_admin'));
create policy l_ins on activity_log for insert to authenticated with check(actor=auth.uid() and is_admin('super_admin','admin','recruitment_manager','content_manager'));

-- avatar URLs must be https
alter table profiles add check(avatar_url is null or avatar_url ~ '^https://');
-- admin management (Super Admin only; the person must already have a verified account)
create function add_admin(p_email text,p_role text) returns void language plpgsql security definer set search_path=public as
$$ declare u uuid; begin
 if not is_admin('super_admin') then raise exception 'Not allowed'; end if;
 if p_role not in('admin','recruitment_manager','content_manager') then raise exception 'Invalid role'; end if;
 select id into u from auth.users where lower(email)=lower(trim(p_email)) and email_confirmed_at is not null;
 if u is null then raise exception 'No verified account with that email'; end if;
 insert into admins(user_id,role) values(u,p_role) on conflict(user_id) do update set role=excluded.role where admins.role<>'super_admin';
 insert into activity_log(actor,action,detail) values(auth.uid(),'add_admin',p_email||' as '||p_role); end $$;
create function list_admins() returns table(user_id uuid,email text,role text) language sql security definer stable set search_path=public as
$$ select a.user_id,u.email::text,a.role from admins a join auth.users u on u.id=a.user_id where is_admin('super_admin') order by a.created_at $$;
revoke execute on function add_admin,list_admins from public,anon;
grant execute on function add_admin,list_admins to authenticated;
-- storage: public-read buckets; media writable by content admins, avatars by their owner
insert into storage.buckets(id,name,public,file_size_limit,allowed_mime_types) values
 ('media','media',true,20971520,array['image/jpeg','image/png','image/webp','video/mp4']),
 ('avatars','avatars',true,2097152,array['image/jpeg','image/png','image/webp']) on conflict do nothing;
create policy st_media on storage.objects for all to authenticated using(bucket_id='media' and is_admin('super_admin','admin','content_manager')) with check(bucket_id='media' and is_admin('super_admin','admin','content_manager'));
create policy st_av on storage.objects for all to authenticated using(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text) with check(bucket_id='avatars' and (storage.foldername(name))[1]=auth.uid()::text);
