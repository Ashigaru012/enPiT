
# 依頼テーブル
# drop
drop table if exists `taskul_db`.`requests_test2`;

# create
create table if not exists `taskul_db`.`requests_test2`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,          -- 依頼者のid --
    `title` TEXT  NOT NULL, -- 依頼のタイトル --
    `max_applicants` INT,   -- 募集人数 --
    `lat` DOUBLE,           -- 依頼者のlat --
    `lng` DOUBLE,           -- 依頼者のlng --
    `is_waiting` BOOLEAN,   -- 人を募集中かどうか --
    `is_finished` BOOLEAN   -- 依頼が終了状態かどうか --
);





# 依頼に対する応募者のテーブル
# drop
drop table if exists `taskul_db`.`applicants_test2`;

# create
create table if not exists `taskul_db`.`applicants_test2`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `request_id` INT,  -- 依頼のid --
    `user_id` INT     -- 応募者のid --
);
