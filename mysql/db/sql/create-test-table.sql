---- drop ----
DROP TABLE IF EXISTS `taskul-db`.`test_table`;

---- create ----
create table IF not exists `taskul-db`.`test_table`
(
 `id`               INT(20) AUTO_INCREMENT,
 `name`             VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`)
);

insert into test_table values(0, 'Yamada');
insert into test_table values(0, 'Okada');
insert into test_table values(0, 'Tanaka');
