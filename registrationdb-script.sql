drop table towns;
drop table registrationNumbers;

create table towns (
id serial not null primary key,
town_name text not null,
startsWith text not null
);

CREATE TABLE registrationNumbers(
 id serial not null primary key,
 reg_num text not null,
 town int not null,
  foreign key (town) references towns(id)
);