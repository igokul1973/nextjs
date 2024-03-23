CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
-- CreateEnum
CREATE TYPE "userRoleEnum" AS ENUM(
    'superuser', 'admin', 'writer', 'reader'
);

-- CreateEnum
CREATE TYPE "Entities" AS ENUM('individual', 'organization');

-- CreateEnum
CREATE TYPE "AccountRelationEnum" AS ENUM('provider', 'customer');

-- CreateEnum
CREATE TYPE "invoiceStatus" AS ENUM( 'pending', 'paid', 'cancelled' );

-- CreateEnum
CREATE TYPE "EmailTypeEnum" AS ENUM(
    'main', 'invoicing', 'secondary'
);

-- CreateEnum
CREATE TYPE "PhoneTypeEnum" AS ENUM(
    'mobile', 'home', 'invoicing', 'other'
);

-- CreateTable
CREATE TABLE "accounts" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,


CONSTRAINT "accounts_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "userRoleEnum" NOT NULL,
    "account_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "updated_by" UUID,


CONSTRAINT "users_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "profiles" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "first_name" VARCHAR(255) NOT NULL,
    "last_name" VARCHAR(255) NOT NULL,
    "middle_name" VARCHAR(255),
    "user_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "profiles_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "addresses" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "address_line_1" VARCHAR(255) NOT NULL,
    "address_line_2" VARCHAR(255) NOT NULL,
    "address_line_3" VARCHAR(255) NOT NULL,
    "locality" VARCHAR(255) NOT NULL,
    "region" VARCHAR(255) NOT NULL,
    "postcode" VARCHAR(255) NOT NULL,
    "country_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "addresses_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "organization_phones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "PhoneTypeEnum" NOT NULL,
    "country_code" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "organization_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "organization_phones_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "individual_phones" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "PhoneTypeEnum" NOT NULL,
    "country_code" VARCHAR(255) NOT NULL,
    "number" VARCHAR(255) NOT NULL,
    "individual_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "individual_phones_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "organization_emails" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "EmailTypeEnum" NOT NULL,
    "organization_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "organization_emails_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "individual_emails" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" "EmailTypeEnum" NOT NULL,
    "individual_id" UUID NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "individual_emails_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "countries" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,


CONSTRAINT "countries_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "local_identifier_names" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "country" VARCHAR(255) NOT NULL,
    "type" "Entities" NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "local_identifier_names_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "individuals" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "firstName" VARCHAR(255) NOT NULL,
    "lastName" VARCHAR(255) NOT NULL,
    "middleName" VARCHAR(255),
    "dob" DATE,
    "local_identifier_name" UUID NOT NULL,
    "local_identifier_value" TEXT NOT NULL,
    "description" TEXT,
    "address_id" UUID NOT NULL,
    "localIdentifierId" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "accountRelation" "AccountRelationEnum" NOT NULL,
    "customer_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "individuals_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "individual_attributes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "individual_attributes_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "individual_attribute_string_values" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "attribute_id" UUID NOT NULL,
    "individual_id" UUID NOT NULL,
    "value" TEXT NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


    CONSTRAINT "individual_attribute_string_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "individual_attribute_numeric_values" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "attribute_id" UUID NOT NULL,
    "individual_id" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


    CONSTRAINT "individual_attribute_numeric_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organizations" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "type_id" UUID NOT NULL,
    "is_private" BOOLEAN,
    "is_charity" BOOLEAN,
    "localIdentifierId" UUID,
    "local_identifier_value" TEXT NOT NULL,
    "address_id" UUID NOT NULL,
    "account_id" UUID NOT NULL,
    "accountRelation" "AccountRelationEnum" NOT NULL,
    "customer_id" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "organizations_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "organization_types" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,


CONSTRAINT "organization_types_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "organization_attributes" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "organizationId" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "organization_attributes_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "organization_attribute_string_values" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "attribute_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


    CONSTRAINT "organization_attribute_string_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "organization_attribute_numeric_values" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "attribute_id" UUID NOT NULL,
    "organization_id" UUID NOT NULL,
    "value" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


    CONSTRAINT "organization_attribute_numeric_values_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "inventory_type" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "type" VARCHAR(255) NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "inventory_type_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "inventory" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" VARCHAR(255) NOT NULL,
    "description" TEXT,
    "type_id" UUID NOT NULL,
    "external_code" VARCHAR(255),
    "internal_code" VARCHAR(255),
    "manufacturer_code" VARCHAR(255),
    "price" INTEGER NOT NULL,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "inventory_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "customers" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,


CONSTRAINT "customers_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "invoices" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "number" TEXT NOT NULL,
    "date" TIMESTAMPTZ(3) NOT NULL,
    "customer_id" UUID NOT NULL,
    "status" "invoiceStatus" NOT NULL,
    "purchase_order_number" TEXT,
    "additionalInformation" TEXT NOT NULL,
    "pay_by" TIMESTAMPTZ(3) NOT NULL,
    "pay_on" TIMESTAMPTZ(3),
    "billingInfo" TEXT NOT NULL,
    "terms" TEXT NOT NULL,
    "tax" INTEGER,
    "notes" TEXT,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "invoices_pkey" PRIMARY KEY ("id") );

-- CreateTable
CREATE TABLE "invoice_items" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "invoice_id" UUID NOT NULL,
    "inventoryId" UUID,
    "created_at" TIMESTAMPTZ(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMPTZ(3) NOT NULL,
    "created_by" UUID NOT NULL,
    "updated_by" UUID NOT NULL,


CONSTRAINT "invoice_items_pkey" PRIMARY KEY ("id") );

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users" ("email");

-- CreateIndex
CREATE UNIQUE INDEX "users_phone_key" ON "users" ("phone");

-- CreateIndex
CREATE UNIQUE INDEX "profiles_user_id_key" ON "profiles" ("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "individuals_customer_id_key" ON "individuals" ("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_type_id_key" ON "organizations" ("type_id");

-- CreateIndex
CREATE UNIQUE INDEX "organizations_customer_id_key" ON "organizations" ("customer_id");

-- CreateIndex
CREATE UNIQUE INDEX "inventory_type_type_key" ON "inventory_type" ("type");

-- AddForeignKey
ALTER TABLE "users"
ADD CONSTRAINT "users_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "profiles"
ADD CONSTRAINT "profiles_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "addresses"
ADD CONSTRAINT "addresses_country_id_fkey" FOREIGN KEY ("country_id") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_phones"
ADD CONSTRAINT "organization_phones_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individual_phones"
ADD CONSTRAINT "individual_phones_individual_id_fkey" FOREIGN KEY ("individual_id") REFERENCES "individuals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_emails"
ADD CONSTRAINT "organization_emails_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organizations" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individual_emails"
ADD CONSTRAINT "individual_emails_individual_id_fkey" FOREIGN KEY ("individual_id") REFERENCES "individuals" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individuals"
ADD CONSTRAINT "individuals_local_identifier_name_fkey" FOREIGN KEY ("local_identifier_name") REFERENCES "local_identifier_names" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individuals"
ADD CONSTRAINT "individuals_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individuals"
ADD CONSTRAINT "individuals_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individuals"
ADD CONSTRAINT "individuals_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individual_attribute_string_values"
ADD CONSTRAINT "individual_attribute_string_values_attribute_id_fkey" FOREIGN KEY ("attribute_id") REFERENCES "individual_attributes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "individual_attribute_numeric_values"
ADD CONSTRAINT "individual_attribute_numeric_values_individual_id_fkey" FOREIGN KEY ("individual_id") REFERENCES "individual_attributes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"
ADD CONSTRAINT "organizations_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "organization_types" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"
ADD CONSTRAINT "organizations_localIdentifierId_fkey" FOREIGN KEY ("localIdentifierId") REFERENCES "local_identifier_names" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"
ADD CONSTRAINT "organizations_address_id_fkey" FOREIGN KEY ("address_id") REFERENCES "addresses" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"
ADD CONSTRAINT "organizations_account_id_fkey" FOREIGN KEY ("account_id") REFERENCES "accounts" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organizations"
ADD CONSTRAINT "organizations_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_attributes"
ADD CONSTRAINT "organization_attributes_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "organizations" ("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_attribute_string_values"
ADD CONSTRAINT "organization_attribute_string_values_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization_attributes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "organization_attribute_numeric_values"
ADD CONSTRAINT "organization_attribute_numeric_values_organization_id_fkey" FOREIGN KEY ("organization_id") REFERENCES "organization_attributes" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inventory"
ADD CONSTRAINT "inventory_type_id_fkey" FOREIGN KEY ("type_id") REFERENCES "inventory_type" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoices"
ADD CONSTRAINT "invoices_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customers" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items"
ADD CONSTRAINT "invoice_items_invoice_id_fkey" FOREIGN KEY ("invoice_id") REFERENCES "invoices" ("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "invoice_items"
ADD CONSTRAINT "invoice_items_inventoryId_fkey" FOREIGN KEY ("inventoryId") REFERENCES "inventory" ("id") ON DELETE SET NULL ON UPDATE CASCADE;