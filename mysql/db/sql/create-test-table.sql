---- drop ----
DROP TABLE IF EXISTS `test_database`.`test_table`;

---- create ----
create table IF not exists `test_database`.`test_table`
(
 `id`               INT(20) AUTO_INCREMENT,
 `name`             VARCHAR(20) NOT NULL,
    PRIMARY KEY (`id`)
);

insert into test_table values(0, 'Yamada');
insert into test_table values(0, 'Okada');
insert into test_table values(0, 'Tanaka');
