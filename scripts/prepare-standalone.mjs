import { cpSync, existsSync, mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const standaloneRoot = path.join(projectRoot, ".next", "standalone");
const staticSource = path.join(projectRoot, ".next", "static");
const publicSource = path.join(projectRoot, "public");

if (!existsSync(standaloneRoot)) {
  throw new Error("Next.js standalone output was not generated.");
}

if (existsSync(publicSource)) {
  cpSync(publicSource, path.join(standaloneRoot, "public"), {
    recursive: true,
    force: true,
  });
}

if (existsSync(staticSource)) {
  const staticTarget = path.join(standaloneRoot, ".next", "static");
  mkdirSync(path.dirname(staticTarget), { recursive: true });
  cpSync(staticSource, staticTarget, { recursive: true, force: true });
}

console.log("Standalone assets prepared.");
