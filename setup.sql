-- CREATE DATABASE zashop

-- Sql commands for tables and rows in case something happens to the db.

CREATE TABLE "users" (
	"email"	TEXT NOT NULL,
	"uname"	TEXT,
	"pwrd"	TEXT NOT NULL,
	"bal"	INTEGER DEFAULT 0,
	PRIMARY KEY("uname")
)

CREATE TABLE "products" (
	"id"	INTEGER,
	"name"	TEXT NOT NULL,
	"image"	TEXT NOT NULL,
	"price"	INTEGER NOT NULL,
	"description"	TEXT NOT NULL,
	"category"	TEXT NOT NULL,
	PRIMARY KEY("id" AUTOINCREMENT)
)

CREATE TABLE "transactions" (
	"t_id"	TEXT,
	"uname"	TEXT NOT NULL,
	"date"	TEXT DEFAULT (datetime('now', 'localtime')),
	"cost"	INTEGER NOT NULL,
	FOREIGN KEY("uname") REFERENCES "users"("uname"),
	PRIMARY KEY("t_id")
)

CREATE TABLE "transactionItems" (
	"cid"	INTEGER,
	"p_id"	INTEGER NOT NULL,
	"count"	INTEGER NOT NULL,
	"t_id"	TEXT,
	PRIMARY KEY("cid" AUTOINCREMENT),
	FOREIGN KEY("p_id") REFERENCES "products"("id"),
	FOREIGN KEY("t_id") REFERENCES "transactions"("t_id")
)

-- Template
INSERT into products
	(name, image, price, description, category)
	VALUES ();

INSERT INTO products
	(name, image, price, description, category)
	VALUES ('ASUS Zephyrus G14 2022', 'zephyrus-g14.jpg', 1500, 'A pretty pog laptop overall. Packs a lot of power into its 14 inches frame, is easy to carry around.', 'computer');

INSERT INTO products
	(name, image, price, description, category)
	VALUES ('iPhone SE 3rd Generation', 'iphone-se3rdgen.jpg', 400, 'Pog phone. Has an Apple A15 Bionic chip. Good phone for affordable price.', 'phone');

INSERT INTO products
	(name, image, price, description, category)
	VALUES ('Hololive Elite Miko T-Shirt', 'elite-miko-shirt.jpg', 15, 'Hololive JP Generation 0, Sakura Miko. An elite t-shirt. Very pog.', 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Hololive Nousagi Sticker', 'nousagi-sticker.jpg', 3, "From Hololive JP Generation 3 (HoloFantasy), a sticker of Usada Pekora's masco, the nousagi.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Hoshimachi Suisei 2nd Solo Live "Shout in Crisis" Blu-ray', 'suisei-concert.jpg', 63, "Hololive JP Generation 0, Hoshimachi Suisei's eagerly anticipated concert blu-ray.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('hololive English 1st Concert -Connect the World- Blu-ray', 'holoenglish-concert.jpg', 63, "Concert between Hololive EN Generation 1 (HoloMyth) and Generation 2 (HoloCouncil+Hope).", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('DEAD BEATS', 'deadbeats.jpg', 7, "Hololive English Generation 1 (HoloMyth) Mori Calliope's first digital EP. It reached #1 on various streamings and platforms on release.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Dino Gura Plush Toy', 'dinogura.jpg', 20, "Hololive English Generation 1 (HoloMyth) Gawr Gura's plushie in a dinosaur costume.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('SAMSUNG Galaxy S23+ Cell Phone 2023', 'samsung-s23plus.jpg', 1000, "Released in 2023, the Galaxy S23 Plus 6.6 inches screen size, a 50 MP camera, with a Qualcomm Snapdragon 8 Gen 2 for enhanced performance. It has 4700mAh battery and 256 GB of space.", 'phone');

INSERT into products
	(name, image, price, description, category)
	VALUES ('SAMSUNG Galaxy S23 Ultra Cell Phone 2023', 'samsung-s23ultra.jpg', 1380, "Samsung's flagship phone, and one of the strongest phone on the market. It has a high resolution 200 MP camera for great pictures and the Qualcomm Snapdragon 8 Gen 2, the best android chipset in the market. 5000mAh battery and 512 GB of storage.", 'phone');

INSERT into products
	(name, image, price, description, category)
	VALUES ('OnePlus 11 Cell Phone 2023', 'oneplus11.jpg', 700, "A more affordable but still very powerful phone. Has Dual SIM, a 50 MP camera, 5000mAh battery. Uses the Snapdragon 8 Gen 2 chipset for enhanced performance. 128 GB of storage.", 'phone');

INSERT into products
	(name, image, price, description, category)
	VALUES ('iPhone 15 Pro Max 2023', 'iphone15promax.jpg', 1200, "The current Apple phone flagship. Has the A17 Pro chipset, the strongest mobile processor on the market as of now. A 48 MP camera, 6.7 inches display, 4441mAh battery capacity and 256 GB of storage.", 'phone');

INSERT into products
	(name, image, price, description, category)
	VALUES ('iPhone 14 2022', 'iphone14.jpg', 700, "Still a very pog phone. Uses the A15 bionic chipset, 12 MP main camera, 6.1 inch display, 128 GB storage and 3200mAh battery capacity.", 'phone');

INSERT into products
	(name, image, price, description, category)
	VALUES ('SAMSUNG A23 2022', 'samsung-a23.jpg', 300, "An affordable more general use phone. 64 GB of space, 5000mAh battery capacity to last the whole day. Supports 5G cellular.", 'phone');

INSERT into products
	(name, image, price, description, category)
	VALUES ('hololive English -Myth- Smol Plushie - Watson Amelia', 'smol-ame.jpg', 30, "Hololive English Generation 1 (HoloMyth) Amelia Watson's smol form plushie. The Smol Ame was illustrated by Walfie and become a meme when Amelia used it as her model.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ("VShojo Cyber Nyanko kson Plush", 'kson-plushie.jpg', 28, "VShojo's resident delinquent Kson. Kson is one of the most well-known vtubers out there, and joined VShojo after her leaving her previous job.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Hololive Kiryu Coco Dragon Yakuza Long Sleeve T-Shirt', 'kaichou-shirt.jpg', 15, "Former Hololive JP Generation 4 Kiryu Coco, the 'Yakuza Chairman'(kaichou). One of the most influential vtubers, she helped popularize Hololive to the west and expanded vtubing out of Japan. A fanmade shirt.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Hololive Kiryu Coco Jersey', 'kaichou-jersey.jpg', 80, "Former Hololive JP Generation 4 Kiryu Coco, the 'Yakuza Chairman'(kaichou). One of the most influential vtubers, she helped popularize Hololive to the west and expanded vtubing out of Japan. Her signature jersey / jacket, worn by Yagoo (Hololive CEO).", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('hololive English -Myth- 3rd Anniversary Celebration - Takodachi Plushie', 'takodachi.jpg', 28, "Hololive English HoloMyth Ninomae Ina'Nis. This is a plushie of the Ina fanbase, coined as takodachi.", 'merch');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Alienware - Aurora R15 Gaming Desktop', 'alienware-aurora-r15.jpg', 3100, 'Very high end gaming desktop. Has the 13th Gen Intel Core i9 13900KF, 32 GB RAM, NVIDIA GeForce RTX 4080, 1 TB SSD and liquid cooling.', 'computer');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Lenovo Legion Pro 7 16" Gaming Laptop', 'lenovo-legion7i.jpg', 2370, 'Very high end gaming laptop, QHD display, Intel Core i9-13900HX, 16 GB RAM, 1 TB SSD and NVIDIA GeForce RTX 4080 gpu.', 'computer');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Dell Optiflex 7000 7010 Desktop PC', 'dell-desktop.jpg', 937, 'Decent desktop with 8 GB RAM, 512 GB SSD, Intel Core i5-13500.', 'computer');

INSERT into products
	(name, image, price, description, category)
	VALUES ('Voyager II Elite', 'starforge-voyager.jpg', 4500, 'Absolute BEAST of a gaming desktop. Intel Core i9-14900K, 64 GB RAM, NVIDIA GeForce RTX 4090, two 2 TB SSD storages, can basically play and do whatever.', 'computer');