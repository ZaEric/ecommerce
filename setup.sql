-- CREATE DATABASE zashop

CREATE TABLE "products" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"image"	TEXT NOT NULL,
	"price"	INTEGER NOT NULL,
	"description"	TEXT NOT NULL,
	"category"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
);

CREATE TABLE "users" (
	"email"	TEXT NOT NULL,
	"uname"	TEXT,
	"pwrd"	TEXT NOT NULL,
	PRIMARY KEY("uname")
);

CREATE TABLE "cartItems" (
	"cid"	INTEGER,
	"uname"	TEXT NOT NULL,
	"id"	INTEGER NOT NULL,
	"count"	INTEGER NOT NULL,
	"t_id"	TEXT DEFAULT 'none',
	PRIMARY KEY("cid" AUTOINCREMENT),
	FOREIGN KEY("id") REFERENCES "products"("id"),
	FOREIGN KEY("t_id") REFERENCES "transactions"("t_id"),
	FOREIGN KEY("uname") REFERENCES "users"("uname")
);

CREATE TABLE "transactions" (
	"t_id"	TEXT,
	"uname"	TEXT NOT NULL,
	"date"	TEXT NOT NULL,
	"cost"	INTEGER NOT NULL,
	PRIMARY KEY("t_id"),
	FOREIGN KEY("uname") REFERENCES "users"("uname")
);

INSERT INTO products
	(name, image, price, description, category)
	VALUES ('ASUS Zephyrus G14 2022', 'zephyrus-g14.jpg', 1500, 'A pretty pog laptop overall. Packs a lot of power into its 14 inches frame, is easy to carry around.', 'computer');

INSERT INTO products
	(name, image, price, description, category)
	VALUES ('iPhone SE 3rd Generation', 400, 'iphone-se3rdgen.jpg', 'Pog phone. Has an Apple A15 Bionic chip. Good phone for affordable price.', 'phone');

INSERT INTO products
	(name, image, price, description, category)
	VALUES ('Hololive Elite Miko T-Shirt', 'elite-miko-shirt.jpg', 15, 'Hololive JP Generation 0, Sakura Miko. An elite t-shirt. Very pog.', 'merch');
