DO $$ BEGIN
 CREATE TYPE "public"."type_product_enum" AS ENUM('DIGITAL', 'PHISICAL');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 CREATE TYPE "public"."role_enum" AS ENUM('CUSTOMER', 'ADMIN', 'PROVIDER', 'OWNER');
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "categories" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(15) NOT NULL,
	"father_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "digital_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"cdKey" varchar(20) NOT NULL,
	"genre_id" uuid,
	"product_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "genres" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"name" varchar(15) NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "images" (
	"assetId" varchar PRIMARY KEY NOT NULL,
	"url" varchar NOT NULL,
	"product_id" uuid NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"time_stamp" timestamp DEFAULT now() NOT NULL,
	"user_id" uuid,
	"orders_detail_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "orders_details" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"product_id" uuid,
	"quantity" integer NOT NULL,
	"price" integer NOT NULL,
	"orders_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "phisical_product" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"weight" integer NOT NULL,
	"category_id" uuid,
	"product_id" uuid
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "products" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"price" integer NOT NULL,
	"description" varchar(50),
	"type" "type_product_enum" NOT NULL
);
--> statement-breakpoint
DROP TABLE "credentials";--> statement-breakpoint
ALTER TABLE "users" ALTER COLUMN "role" SET DATA TYPE role_enum;--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "city" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "cp" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "country" varchar(15);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "state" varchar(20);--> statement-breakpoint
ALTER TABLE "users" ADD COLUMN "street" varchar(40);