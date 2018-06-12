drop table if exists towns,registrationNumbers;

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

insert into towns(town_name,startsWith) values ('cape town','CA');
insert into towns(town_name,startsWith) values ('paarl','CJ');
insert into towns(town_name,startsWith) values ('belville','CY');
insert into towns(town_name,startsWith) values ('strand','CF');
