# drop
drop table if exists `taskul_db`.`antenna_test`;

# create 
create table if not exists `taskul_db`.`antenna_test`
(
 `id`               INT(20) AUTO_INCREMENT PRIMARY KEY,
 `lat`              FLOAT NOT NULL,
 `lng`              FLOAT NOT NULL
);


insert into antenna_test values(0, 37.456156, 139.855380);
insert into antenna_test values(0, 37.463740, 139.855475);
insert into antenna_test values(0, 37.461306, 139.848242);
insert into antenna_test values(0, 37.467278, 139.843001);