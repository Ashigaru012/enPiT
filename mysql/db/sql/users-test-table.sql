
---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`users`;

---- create ----
create table IF not exists `taskul_db`.`users`
(
 `id` INT AUTO_INCREMENT PRIMARY KEY,
 `name` TEXT
);

insert into `users` values(null, "テストユーザ１");
insert into `users` values(null, "テストユーザ２");
insert into `users` values(null, "テストユーザ３");
insert into `users` values(null, "テストユーザ４");
