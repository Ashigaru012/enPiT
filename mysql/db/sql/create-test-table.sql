# drop
drop table if exists `taskul_db`.`test_table`;

# create
create table if not exists `taskul_db`.`test_table`
(
 `id`               INT(20) AUTO_INCREMENT PRIMARY KEY,
 `name`             VARCHAR(20) NOT NULL
);

insert into test_table values(0, 'Yamada');
insert into test_table values(0, 'Okada');
insert into test_table values(0, 'Tanaka');
