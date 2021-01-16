
# drop
drop table if exists `taskul_db`.`users`;

# create
create table if not exists `taskul_db`.`users`
(
 `id` INT AUTO_INCREMENT PRIMARY KEY,
 `name` TEXT,
 `lat` DOUBLE,
 `lng` DOUBLE
);

insert into `users` values(null, "テストユーザ１", 37.461618, 139.839123);
insert into `users` values(null, "テストユーザ２", 37.471618, 139.855123);
insert into `users` values(null, "テストユーザ３", 0, 0);
insert into `users` values(null, "テストユーザ４", 0, 0);
insert into `users` values(null, "テストユーザ５", 0, 0);
