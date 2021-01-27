
# drop
drop table if exists `taskul_db`.`user`;

# create
create table if not exists `taskul_db`.`user`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `sub` TEXT,
    `name` TEXT,
    `lat` DOUBLE,
    `lng` DOUBLE,
    `good` INT default 0
);