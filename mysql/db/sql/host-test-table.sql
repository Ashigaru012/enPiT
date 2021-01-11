---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`hosts_test`;

---- create ----
create table IF not exists `taskul_db`.`hosts_test`
(
 `id`               INT(20) AUTO_INCREMENT PRIMARY KEY,
 `user_id`          INT,
 `range`            FLOAT,
 `lat`              DOUBLE NOT NULL,
 `lng`              DOUBLE NOT NULL
);