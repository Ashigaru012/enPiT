---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`antenna_test2`;

---- create ----
create table IF not exists `taskul_db`.`antenna_test2`
(
 `id`               INT(20) AUTO_INCREMENT PRIMARY KEY,
 `user_id`          INT,
 `lat`              DOUBLE NOT NULL,
 `lng`              DOUBLE NOT NULL
);

