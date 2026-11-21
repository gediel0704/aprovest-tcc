// "npm run dev" do front-end:
// - com o projeto completo (pasta aprovest com scripts/iniciar.mjs), sobe banco, API e site juntos;
// - com o front-end separado (entrega individual), sobe apenas o site (Vite) e espera a API em http://localhost:8080.
import { existsSync } from "node:fs";
import { spawn } from "node:child_process";
import { fileURLToPath, pathToFileURL } from "node:url";
import path from "node:path";

const aqui = path.dirname(fileURLToPath(import.meta.url));
const iniciarCompleto = path.resolve(aqui, "..", "..", "scripts", "iniciar.mjs");

if (existsSync(iniciarCompleto)) {
  await import(pathToFileURL(iniciarCompleto).href);
} else {
  console.log("[aprovest] Front-end separado: subindo só o site. Inicie a API (pasta aprovest-api) para o site carregar os dados.");
  const vite = path.resolve(aqui, "..", "node_modules", "vite", "bin", "vite.js");
  const p = spawn(process.execPath, [vite, ...process.argv.slice(2)], { stdio: "inherit", cwd: path.resolve(aqui, "..") });
  p.on("exit", (c) => process.exit(c ?? 0));
}
