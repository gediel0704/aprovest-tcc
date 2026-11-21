// =====================================================================
// AproVest TCC - inicia o projeto inteiro com "npm run dev":
//   1. localiza o Java 21 (mesmo que o terminal tenha sido aberto antes da instalação)
//   2. confere se o SQL Server está acessível na porta 1433
//   3. na primeira vez, pede a senha do usuário sa e grava em application-local.properties
//   4. sobe a API (Spring Boot); se o banco aprovesttcc não existir, a API o cria com os scripts
//   5. sobe o site (Vite) e abre o navegador quando tudo estiver pronto
// Não precisa de dependências: usa só módulos nativos do Node.js.
// =====================================================================
import { spawn, spawnSync, execFileSync } from "node:child_process";
import fs from "node:fs";
import net from "node:net";
import os from "node:os";
import path from "node:path";
import readline from "node:readline";
import { fileURLToPath } from "node:url";

const RAIZ = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const API = path.join(RAIZ, "aprovest-api");
const WEB = path.join(RAIZ, "aprovest-web");
const LOCAL = path.join(API, "src", "main", "resources", "application-local.properties");
const WINDOWS = process.platform === "win32";
const PORTA_API = 8080, PORTA_WEB = 5173;
const URL_API = `http://localhost:${PORTA_API}/api/v1/index`;
const URL_SITE = `http://localhost:${PORTA_WEB}`;

const cor = (c, t) => (process.stdout.isTTY ? `\x1b[${c}m${t}\x1b[0m` : t);
const info = (t) => console.log(cor("36", "[aprovest] ") + t);
const erro = (t) => console.log(cor("31", "[aprovest] ") + t);
const sair = (t) => { erro(t); process.exit(1); };

// ---------- 1. Java 21 ----------
function versaoJava(javaHome) {
  const bin = path.join(javaHome, "bin", WINDOWS ? "java.exe" : "java");
  if (!fs.existsSync(bin)) return 0;
  const r = spawnSync(bin, ["-version"], { encoding: "utf8" }); // "java -version" escreve no stderr
  return Number(`${r.stdout || ""}${r.stderr || ""}`.match(/version "(\d+)/)?.[1] || 0);
}
function variavelDoSistema(nome) {
  // No Windows, lê o valor atual do registro (útil quando o terminal foi aberto antes da instalação)
  if (!WINDOWS) return null;
  for (const escopo of ["HKCU\\Environment", "HKLM\\SYSTEM\\CurrentControlSet\\Control\\Session Manager\\Environment"]) {
    try {
      const s = execFileSync("reg", ["query", escopo, "/v", nome], { encoding: "utf8", stdio: ["ignore", "pipe", "ignore"] });
      const m = s.match(new RegExp(`${nome}\\s+REG_(?:EXPAND_)?SZ\\s+(.+)`));
      if (m) return m[1].trim();
    } catch { /* não definida nesse escopo */ }
  }
  return null;
}
function localizarJava() {
  const candidatos = [process.env.JAVA_HOME, variavelDoSistema("JAVA_HOME")];
  if (WINDOWS) {
    for (const base of ["C:\\Program Files\\Microsoft", "C:\\Program Files\\Eclipse Adoptium", "C:\\Program Files\\Java", "C:\\Program Files\\Amazon Corretto", "C:\\Program Files\\Zulu"]) {
      if (!fs.existsSync(base)) continue;
      for (const d of fs.readdirSync(base).filter((n) => /jdk-?2[1-9]|zulu-?2[1-9]|jdk2[1-9]/i.test(n)).sort().reverse()) candidatos.push(path.join(base, d));
    }
  } else {
    candidatos.push("/usr/lib/jvm/java-21-openjdk-amd64", "/usr/lib/jvm/java-21-openjdk", "/Library/Java/JavaVirtualMachines/temurin-21.jdk/Contents/Home");
  }
  for (const c of candidatos.filter(Boolean)) {
    const home = c.replace(/[\\/]+$/, "").replace(/[\\/]bin$/i, "");
    if (versaoJava(home) >= 21) return home;
  }
  return null;
}

// ---------- utilidades de rede ----------
const portaNoHost = (porta, host) => new Promise((ok) => {
  const s = net.connect({ port: porta, host });
  s.setTimeout(1500);
  s.once("connect", () => { s.destroy(); ok(true); });
  s.once("error", () => ok(false));
  s.once("timeout", () => { s.destroy(); ok(false); });
});
// testa IPv4 e IPv6: o Vite costuma escutar só em ::1 (localhost)
const portaAberta = async (porta) => (await portaNoHost(porta, "127.0.0.1")) || (await portaNoHost(porta, "::1"));
async function apiNoAr() {
  try { const r = await fetch(URL_API); const j = await r.json(); return String(j?.aplicacao || "") === "AproVest TCC"; } catch { return false; }
}
// "pronto" só quando a API responde E consegue ler o banco (esta rota consulta o SQL Server)
async function bancoPronto() {
  try { const r = await fetch(`http://localhost:${PORTA_API}/api/v1/publico/numeros`); return r.ok; } catch { return false; }
}
const pergunta = (texto, oculta = false) => new Promise((ok) => {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout, terminal: true });
  if (oculta) rl._writeToOutput = (s) => { if (s.includes(texto)) rl.output.write(s); else rl.output.write("*".repeat(s.length ? 1 : 0)); };
  rl.question(texto, (r) => { rl.close(); if (oculta) process.stdout.write("\n"); ok(r); });
});

// ---------- processos filhos ----------
const filhos = [];
const ultimas = { api: [], web: [] };
// No Windows, os arquivos .cmd (mvnw.cmd, npx) precisam do cmd.exe; chamá-lo explicitamente evita shell: true
function executar(comando, args, opcoes) {
  return WINDOWS
    ? spawn(process.env.ComSpec || "cmd.exe", ["/d", "/s", "/c", [comando, ...args].join(" ")], { ...opcoes, windowsVerbatimArguments: true })
    : spawn(comando, args, opcoes);
}
function iniciar(nome, comando, args, cwd, env, filtro) {
  const p = executar(comando, args, { cwd, env, stdio: ["ignore", "pipe", "pipe"] });
  filhos.push(p);
  const prefixo = cor(nome === "api" ? "35" : "32", `[${nome}] `);
  const linhas = (buf) => buf.toString().split(/\r?\n/).filter((l) => l.trim()).forEach((l) => {
    ultimas[nome].push(l);
    if (ultimas[nome].length > 40) ultimas[nome].shift();
    if (!filtro || filtro(l)) console.log(prefixo + l);
  });
  p.stdout.on("data", linhas);
  p.stderr.on("data", linhas);
  return p;
}
function encerrar() {
  for (const p of filhos) {
    if (p.exitCode !== null) continue;
    try { WINDOWS ? execFileSync("taskkill", ["/pid", String(p.pid), "/T", "/F"], { stdio: "ignore" }) : p.kill("SIGTERM"); } catch { /* já encerrado */ }
  }
}
process.on("SIGINT", () => { info("Encerrando API e site..."); encerrar(); process.exit(0); });
process.on("exit", encerrar);

// ============================== execução ==============================
const apenasSite = process.argv.includes("--so-site");
info("Iniciando o AproVest TCC...");

let envApi = { ...process.env };
let apiJaRodando = await apiNoAr();
let falhaLogin = false;

// ---------- banco de dados: descoberta automática do SQL Server deste computador ----------
const NOME_BANCO = process.env.APROVEST_DB_NOME || "aprovesttcc";
const CONFIG_BANCO = path.join(os.homedir(), ".aprovest", "banco.json");   // salvo por usuário do Windows, vale para qualquer clone
const lerJson = (arq) => { try { return JSON.parse(fs.readFileSync(arq, "utf8")); } catch { return null; } };
function sqlserver(args) {
  const r = spawnSync("powershell", ["-NoProfile", "-ExecutionPolicy", "Bypass", "-File", path.join(RAIZ, "scripts", "sqlserver.ps1"), ...args], { encoding: "utf8" });
  const texto = (r.stdout || "").trim().split(/\r?\n/).pop() || "";
  try { return JSON.parse(texto); } catch { return null; }
}
const testarLogin = (porta, usuario, senha) =>
  sqlserver(["-Acao", "testar", "-Banco", NOME_BANCO, "-Porta", String(porta), ...(usuario ? ["-Usuario", usuario, "-Senha", senha] : [])]) || { ok: false, erro: "falha ao testar" };
function senhaLegada() {
  // compatibilidade: versões anteriores salvavam a senha em application-local.properties
  try { return fs.readFileSync(LOCAL, "utf8").match(/^spring\.datasource\.password=(.*)$/m)?.[1]?.trim() || null; } catch { return null; }
}
function usarConexao(c) {
  const url = `jdbc:sqlserver://localhost:${c.porta};databaseName=${NOME_BANCO};encrypt=true;trustServerCertificate=true${c.auth === "windows" ? ";integratedSecurity=true" : ""}`;
  envApi.SPRING_DATASOURCE_URL = url;
  envApi.SPRING_DATASOURCE_USERNAME = c.auth === "windows" ? "" : c.usuario;
  envApi.SPRING_DATASOURCE_PASSWORD = c.auth === "windows" ? "" : c.senha;
}

async function prepararBanco() {
  if (envApi.APROVEST_DB_URL) { info("Banco: usando a conexão definida em APROVEST_DB_URL."); return; }
  if (!WINDOWS) {
    if (!(await portaAberta(1433))) sair("SQL Server não respondeu na porta 1433.");
    if (!senhaLegada() && !envApi.APROVEST_DB_PASSWORD) {
      const senha = (await pergunta("Senha do sa: ", true)).trim();
      fs.writeFileSync(LOCAL, `# Configuração local (NÃO versionar). Criado pelo npm run dev.\nspring.datasource.password=${senha}\n`, "utf8");
    }
    return;
  }

  // 1) instâncias instaladas
  const instancias = sqlserver(["-Acao", "instancias"]) || [];
  if (!instancias.length) sair("Nenhum SQL Server foi encontrado neste computador. Instale o SQL Server 2019 ou superior (edição Developer ou Express) e rode \"npm run dev\" de novo.");
  const rodando = instancias.filter((i) => i.estado === "Running");
  if (!rodando.length) {
    sair(`O SQL Server está instalado (${instancias.map((i) => i.nome).join(", ")}), mas o serviço está parado. Inicie o serviço "${instancias[0].servico}" (Painel de Serviços do Windows ou SQL Server Configuration Manager) e rode "npm run dev" de novo.`);
  }
  const comTcp = rodando.filter((i) => i.tcp && i.porta);
  if (!comTcp.length) {
    const nome = rodando[0].nome;
    sair(`O SQL Server (${nome}) está rodando, mas com o protocolo TCP/IP desligado, que a API Java precisa.\n` +
      `           Para habilitar (como administrador): abra o PowerShell como administrador na pasta do projeto e rode\n` +
      `           powershell -ExecutionPolicy Bypass -File database\\configurar-sqlserver.ps1 -Instancia ${nome}\n` +
      `           Em computadores da escola, peça ao técnico do laboratório para habilitar o TCP/IP do SQL Server.`);
  }

  // 2) logins candidatos, do mais conveniente ao menos conveniente
  const salvo = lerJson(CONFIG_BANCO);
  const portas = [...new Set([salvo?.porta, ...comTcp.map((i) => i.porta)].filter(Boolean))];
  const instPorta = (p) => comTcp.find((i) => i.porta === p)?.nome || "?";
  let escolha = null;
  for (const porta of portas) {
    const tentativas = [];
    if (salvo && salvo.porta === porta) tentativas.push(salvo);
    tentativas.push({ porta, auth: "windows" });
    const legada = senhaLegada() || envApi.APROVEST_DB_PASSWORD;
    if (legada) tentativas.push({ porta, auth: "sql", usuario: "sa", senha: legada });
    for (const t of tentativas) {
      const r = t.auth === "windows" ? testarLogin(porta) : testarLogin(porta, t.usuario, t.senha);
      if (r.ok) { escolha = { ...t, resultado: r }; break; }
    }
    if (escolha) break;
  }
  // 3) se nada funcionou, pede a senha do sa (até 3 vezes), testando antes de subir a API
  if (!escolha) {
    info(`SQL Server encontrado (${comTcp.map((i) => `${i.nome}, porta ${i.porta}`).join("; ")}), mas a autenticação do Windows não tem acesso.`);
    for (let n = 1; n <= 3 && !escolha; n++) {
      const senha = (await pergunta(`Senha do usuário 'sa' deste SQL Server (tentativa ${n} de 3): `, true)).trim();
      if (!senha) break;
      for (const porta of portas) {
        const r = testarLogin(porta, "sa", senha);
        if (r.ok) { escolha = { porta, auth: "sql", usuario: "sa", senha, resultado: r }; break; }
        if (porta === portas[portas.length - 1]) erro(`Login recusado: ${r.erro}`);
      }
    }
    if (!escolha) {
      sair("Não foi possível entrar no SQL Server. Use a senha do 'sa' deste computador ou peça ao professor/técnico do laboratório\n" +
        "           para dar acesso ao seu usuário do Windows no SQL Server (ou habilitar o login 'sa').");
    }
  }
  // 4) o banco existe ou pode ser criado?
  const r = escolha.resultado;
  if (!r.bancoExiste && !r.podeCriar) {
    sair(`O banco ${NOME_BANCO} ainda não existe e o login '${r.usuario}' não tem permissão para criá-lo.\n` +
      "           Peça a quem administra o SQL Server para executar, no SSMS, os scripts database/01 e 02 (nessa ordem).");
  }
  const { resultado, ...guardar } = escolha;
  fs.mkdirSync(path.dirname(CONFIG_BANCO), { recursive: true });
  fs.writeFileSync(CONFIG_BANCO, JSON.stringify(guardar, null, 2), "utf8");
  usarConexao(escolha);
  info(`Banco: SQL Server ${instPorta(escolha.porta)} (porta ${escolha.porta}), login ${escolha.auth === "windows" ? `do Windows (${r.usuario})` : "'sa'"}` +
    (r.bancoExiste ? `, banco ${NOME_BANCO} encontrado.` : `, o banco ${NOME_BANCO} será criado agora.`));
}

// Login recusado durante a subida da API (raro, pois o login é testado antes): apaga a configuração salva e explica
function senhaErrada() {
  console.log("");
  erro("O SQL Server recusou o login da API.");
  try { fs.rmSync(CONFIG_BANCO); } catch { /* não existia */ }
  erro("Apaguei a configuração salva do banco. Rode \"npm run dev\" de novo para refazer a detecção.");
  encerrar();
  process.exit(1);
}

if (!apenasSite && !apiJaRodando) {
  // 1. Java
  const java = localizarJava();
  if (!java) sair("Java 21 não encontrado. Instale com:  winget install Microsoft.OpenJDK.21  (depois feche e abra o terminal).");
  envApi.JAVA_HOME = java;
  // no Windows a variável se chama "Path"; usar a mesma chave evita duas variáveis de caminho no processo filho
  const chavePath = Object.keys(envApi).find((k) => k.toUpperCase() === "PATH") || "PATH";
  envApi[chavePath] = path.join(java, "bin") + path.delimiter + (envApi[chavePath] || "");
  // mensagens da API com acentos corretos no terminal
  envApi.JAVA_TOOL_OPTIONS = `${envApi.JAVA_TOOL_OPTIONS || ""} -Dstdout.encoding=UTF-8 -Dstderr.encoding=UTF-8`.trim();
  info(`Java: ${java}`);

  // 2 e 3. SQL Server: descobre a instância e o login que funcionam neste computador
  await prepararBanco();

  // 4. Porta 8080 ocupada por outro programa?
  if (await portaAberta(PORTA_API)) sair(`A porta ${PORTA_API} está ocupada por outro programa. Feche-o e rode "npm run dev" de novo.`);

  info("Subindo a API (a primeira execução baixa as dependências e pode levar alguns minutos)...");
  // caminho completo: alguns Windows não procuram executáveis na pasta atual (NoDefaultCurrentDirectoryInExePath)
  const mvnw = WINDOWS ? `"${path.join(API, "mvnw.cmd")}"` : "./mvnw";
  // mostra só o essencial (diferencia maiúsculas: o Spring escreve "[aprovest]" em todas as linhas de log)
  const filtroApi = (l) => /\[AproVest\]|ERROR|Exception|Caused by|Started AprovestApplication|APPLICATION FAILED|Login failed|BUILD FAILURE|Downloading from central|Port \d+ was already/.test(l)
    && !/Downloaded from| WARN /.test(l);
  let avisouDownload = false;
  const api = iniciar("api", mvnw, ["-q", "spring-boot:run"], API, envApi, (l) => {
    if (/Falha de logon do usu|Login failed for user/i.test(l)) { if (falhaLogin) return false; falhaLogin = true; return false; }
    if (falhaLogin) return false;   // depois do erro de senha, o resto do log só repete o mesmo problema
    if (/Downloading from central/.test(l)) { if (!avisouDownload) { avisouDownload = true; return true; } return false; }
    return filtroApi(l);
  });
  api.on("exit", (codigo) => {
    if (!codigo || falhaLogin) return;
    erro(`A API foi encerrada (código ${codigo}). Últimas mensagens:`);
    ultimas.api.slice(-25).forEach((l) => console.log(cor("35", "[api] ") + l));
  });
} else if (apiJaRodando) {
  info("A API já está rodando na porta 8080; ela será reaproveitada.");
}

// 5. Site (instala as dependências se faltar o Vite, inclusive depois de um npm install que falhou)
if (!fs.existsSync(path.join(WEB, "node_modules", "vite", "package.json")) || !fs.existsSync(path.join(WEB, "node_modules", "@vitejs", "plugin-react", "package.json"))) {
  info("Instalando as dependências do site (npm install)...");
  await new Promise((ok, falha) => executar("npm", ["install", "--no-audit", "--no-fund"], { cwd: WEB, stdio: "inherit" })
    .on("exit", (c) => (c ? falha(new Error("npm install falhou")) : ok())));
}
if (await portaAberta(PORTA_WEB)) {
  info(`O site já está rodando em ${URL_SITE}.`);
} else {
  const web = iniciar("web", "npx", ["vite", "--port", String(PORTA_WEB), "--strictPort"], WEB, process.env);
  web.on("exit", (codigo) => {
    if (codigo) erro("O site não iniciou. Rode \"npm install\" na pasta do projeto e depois \"npm run dev\" de novo.");
  });
}

// Aguarda a API ficar pronta
if (!apenasSite) {
  const inicio = Date.now();
  while (!(await bancoPronto())) {
    if (falhaLogin) senhaErrada();
    if (Date.now() - inicio > 10 * 60_000) sair("A API não respondeu em 10 minutos. Veja as mensagens acima.");
    if (filhos[0] && filhos[0].exitCode !== null) sair("A API não conseguiu iniciar. Veja as mensagens acima.");
    await new Promise((r) => setTimeout(r, 2000));
  }
}
console.log("");
info(cor("1", `Tudo pronto! Acesse ${URL_SITE}`));
info("Contas de teste: aluno@aprovest.com.br e admin@aprovest.com.br, senha 123456.");
info("Para encerrar, pressione Ctrl+C.");
if (!process.env.APROVEST_NAO_ABRIR) {
  try { WINDOWS ? spawn("cmd", ["/c", "start", "", URL_SITE], { stdio: "ignore", detached: true }) : spawn(process.platform === "darwin" ? "open" : "xdg-open", [URL_SITE], { stdio: "ignore", detached: true }); } catch { /* sem navegador */ }
}
