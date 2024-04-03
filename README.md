## Next.js App Router INVOICEME Project

This is a project showcasing the system allowing to invoice one's customers.

It is created with Next.js, Typescript, Prisma, MUI and PostgreSQL.

For more information, see the [course curriculum](https://nextjs.org/learn) on the Next.js Website.

### Prerequisites:

-   Node.js version >= 18.2
-   Yarn
-   Internet connection

### Deployment instructions:

-   Clone the codebase and run `yarn` command in the terminal.
-   Create .env file from the .env.example
-   Fill out all necessary fields with your credentials in the .env created above
-   Use ./compose-postgres folder and its README.md in order to start the PostgreSQL in docker or use your own PostgreSQL DB.
-   After the PostreSQL is up and running, you created the DB, and entered the creds into the .env - run the following in the terminal...
-   `yarn migrate:prepare` - it will make sure and delete all the tables in the DB you just created.
-   `npx prisma migrate dev --create-only --name initial` - it will create an initial migration which will create the schema in the DB (don't forget, we are using the PostgreSQL!).
-   `yarn seed` - this will seed the DB with initial data and generate Prisma Client types which can be used in your code.

### DB Schema

-   The schema is located in `./prisma/schema.prisma` file and describes all the data/entities playing the role in the system.
-   The initial migration file is located in `./prisma/migrations/` folder and represents the SQL run in order to create the DB schema.
-   If you want to change the DB schema, please change the schema file, and then use the `prisma migrate dev` set of commands to generate new migration files and apply them to the DB.
-   Please refer to the Prisma documention in case you have any questions.

TBD
