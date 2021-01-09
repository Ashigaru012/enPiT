---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`chat_rooms`;

---- create ----
create table IF not exists `taskul_db`.`chat_rooms`
(
 `id` INT AUTO_INCREMENT PRIMARY KEY,
 `name` TEXT,
 `messages_num` INT
);


insert into `chat_rooms` values(null, "test room", 5);

---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`chat_members`;

---- create ----
create table IF not exists `taskul_db`.`chat_members`
(
 `id` INT AUTO_INCREMENT PRIMARY KEY,
 `room_id` INT,
 `user_id` INT
);

insert into `chat_members` values(null, 1, 1);
insert into `chat_members` values(null, 1, 2);

---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`chat_messages`;

---- create ----
create table IF not exists `taskul_db`.`chat_messages`
(
 `id` INT AUTO_INCREMENT PRIMARY KEY,
 `room_id` INT,
 `user_id` INT, -- 送信者ID --
 `number` INT, -- チャットルームが作成されてから何番目のメッセージか --
 `message` TEXT
);

insert into `chat_messages` values(null, 1, 1, 1, "テストユーザ１によるメッセージです");
insert into `chat_messages` values(null, 1, 2, 2, "テストユーザ２によるメッセージです");
insert into `chat_messages` values(null, 1, 1, 3, "テストユーザ１によるメッセージです");
insert into `chat_messages` values(null, 1, 2, 4, "テストユーザ２によるメッセージです");
insert into `chat_messages` values(null, 1, 2, 5, "テストユーザ２によるメッセージです");



