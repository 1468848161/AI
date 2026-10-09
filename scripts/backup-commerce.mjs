import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { backup, DatabaseSync } from "node:sqlite";

const source = resolve(process.env.SAAS_DATABASE_PATH || "/app/data/commerce.sqlite");
const destination = resolve(process.env.COMMERCE_BACKUP_PATH || "/app/data/commerce-backup.sqlite");

if (source === destination) throw new Error("Backup destination must differ from the live database");
mkdirSync(dirname(destination), { recursive: true });
const database = new DatabaseSync(source);
try {
  await backup(database, destination);
} finally {
  database.close();
}

console.log(`Commerce database snapshot created at ${destination}`);
