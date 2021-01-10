
---- 依頼テーブル ----
---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`requests_test`;

---- create ----
create table IF not exists `taskul_db`.`requests_test`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `user_id` INT,          -- 依頼者のid --
    `title` TEXT  NOT NULL, -- 依頼のタイトル --
    `max_applicants` INT,   -- 募集人数 --
    `is_waiting` BOOLEAN,    -- 人を募集中かどうか --
    `is_finished` BOOLEAN   -- 依頼が終了状態かどうか --
);


insert into requests_test values(null, 1, "テスト用依頼１", 3, true, false);
insert into requests_test values(null, 1, "テスト用依頼２", 1, true, false);
insert into requests_test values(null, 1, "テスト用依頼３", 2, true, false);




---- 依頼に対する応募者のテーブル ----
---- drop ----
DROP TABLE IF EXISTS `taskul_db`.`applicants_test`;

---- create ----
create table IF not exists `taskul_db`.`applicants_test`
(
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `request_id` INT,  -- 依頼のid --
    `user_id` INT     -- 応募者のid --
);


insert into applicants_test values(null, 1, 2);
insert into applicants_test values(null, 1, 3);