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