import prisma from '../app/lib/prisma.ts';
import { exec } from 'child_process';

async function deleteAllTables() {
    return prisma.$queryRaw`
      do $$ declare
          r record;
      begin
          for r in (select tablename from pg_tables where schemaname = 'public') loop
              execute 'drop table if exists ' || quote_ident(r.tablename) || ' cascade';
          end loop;
      end $$;
      `;
}

async function removeUUIDExtension() {
    console.log('Removing UUID Extension...');
    return prisma.$queryRaw`DROP EXTENSION IF EXISTS "uuid-ossp"`;
}

async function deleteDatabase() {
    await deleteAllTables();
    console.log('All tables are successfully removed');
    await removeUUIDExtension();
    return console.log('UUID extension is successfully removed.');
}

async function deleteMigrations() {
    return new Promise((resolve, reject) => {
        try {
            exec('rm -rf ./prisma/migrations', (err, stdout, stderr) => {
                if (err) {
                    reject(err);
                }
                stdout && console.log(stdout);
                const successMessage = 'Successfully removed migrations folder';
                console.log(successMessage);
                resolve(successMessage);
            });
        } catch (error) {
            reject(error);
        }
    });
}

async function main() {
    await deleteDatabase();
    console.log('Successfully deleted all DB tables.');

    await deleteMigrations();
    console.log('Successfully started preparing migrations!');

    await prisma.$disconnect();
}

main().catch(async (err) => {
    console.error('An error occurred while attempting to prepare migrations:', err);
});
