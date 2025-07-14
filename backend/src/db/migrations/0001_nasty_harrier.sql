CREATE TABLE "appointments" (
	"id" serial PRIMARY KEY NOT NULL,
	"doctor" varchar(100) NOT NULL,
	"specialty" varchar(100),
	"date" date NOT NULL,
	"time" time NOT NULL,
	"reason" text,
	"status" varchar(20) DEFAULT 'pending',
	"type" varchar(20) DEFAULT 'regular',
	"location" varchar(200),
	"comments" text,
	"created_at" date DEFAULT now()
);
