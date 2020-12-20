---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`antenna_test`;

---- create ----
create table IF not exists `taskul_db`.`antenna_test`
(
 `id`               INT(20) AUTO_INCREMENT,
 `lat`              FLOAT NOT NULL,
 `lng`              FLOAT NOT NULL,
 PRIMARY KEY (`id`)
);


insert into antenna_test values(0, 37.456156, 139.855380);
insert into antenna_test values(0, 37.463740, 139.855475);
insert into antenna_test values(0, 37.461306, 139.848242);
insert into antenna_test values(0, 37.467278, 139.843001);