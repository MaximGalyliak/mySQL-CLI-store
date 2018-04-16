 DROP DATABASE IF EXISTS StoreDB;
 create database StoreDB;
 use StoreDB;

 create table productsTB(
     id int auto_increment primary key,
     product_name varchar(30) unique not null,
     department_name varchar(30),
     price float(16) not null,
     stock_quntity int(16) not null
 );
 
 insert into 
	productsTB(product_name, department_name, price, stock_quntity) 
 values 
	('banana', 'fruits', 0.59, 200),
	('strawberries','fruits', 1.99, 20),
	('potatoes', 'vegetables', 4.99, 50),
    ('onion', 'vegetables', 0.59, 50),
    ('red pepper', 'spices', 1.99, 20),
    ('black pepper', 'spices', 1.98, 20),
    ('chicken breasts', 'meat', 9.59, 10),
    ('bacon slices', 'meat', 9.98, 10),
    ('Coca-Cola', 'soft drinks', 0.59, 100),
    ('Vodka', 'alcoholic beverages', 35.99, 400);