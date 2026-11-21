# =====================================================================
# AproVest TCC - descobre o SQL Server instalado no computador e testa o login.
# Usado pelo "npm run dev" (scripts/iniciar.mjs). Não altera nada no sistema.
#   -Acao instancias                 -> lista as instâncias (nome, serviço, estado, TCP/IP e porta) em JSON
#   -Acao testar -Porta N [-Usuario sa -Senha x]
#                                     -> testa o login (sem usuário = autenticação do Windows) e informa
#                                        se o banco aprovesttcc existe e se o login pode criá-lo, em JSON
# =====================================================================
param(
  [Parameter(Mandatory = $true)][ValidateSet("instancias", "testar")][string]$Acao,
  [int]$Porta = 1433,
  [string]$Usuario = "",
  [string]$Senha = "",
  [string]$Banco = "aprovesttcc"
)
$ErrorActionPreference = "Stop"
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

if ($Acao -eq "instancias") {
  $lista = @()
  $chaves = @("HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL", "HKLM:\SOFTWARE\WOW6432Node\Microsoft\Microsoft SQL Server\Instance Names\SQL")
  foreach ($chave in $chaves) {
    if (-not (Test-Path $chave)) { continue }
    $props = Get-ItemProperty $chave
    foreach ($p in $props.PSObject.Properties | Where-Object { $_.Name -notlike "PS*" }) {
      $nome = $p.Name; $id = $p.Value
      if ($lista | Where-Object { $_.nome -eq $nome }) { continue }
      $base = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$id\MSSQLServer\SuperSocketNetLib\Tcp"
      $tcp = $false; $porta = $null
      if (Test-Path $base) {
        $tcp = ((Get-ItemProperty $base -ErrorAction SilentlyContinue).Enabled -eq 1)
        $ipall = Get-ItemProperty "$base\IPAll" -ErrorAction SilentlyContinue
        if ($ipall) {
          $fixa = "$($ipall.TcpPort)".Trim(); $dinamica = "$($ipall.TcpDynamicPorts)".Trim()
          if ($fixa) { $porta = [int]($fixa.Split(",")[0]) } elseif ($dinamica) { $porta = [int]($dinamica.Split(",")[0]) }
        }
      }
      $servico = if ($nome -eq "MSSQLSERVER") { "MSSQLSERVER" } else { "MSSQL`$$nome" }
      $estado = (Get-Service -Name $servico -ErrorAction SilentlyContinue).Status
      $lista += [pscustomobject]@{ nome = $nome; servico = $servico; estado = "$estado"; tcp = $tcp; porta = $porta }
    }
  }
  ConvertTo-Json -InputObject @($lista) -Compress
  exit 0
}

# ---- testar login ----
$csb = "Server=tcp:127.0.0.1,$Porta;Database=master;Connect Timeout=6;Encrypt=True;TrustServerCertificate=True;"
if ($Usuario) { $csb += "User Id=$Usuario;Password=$Senha;" } else { $csb += "Integrated Security=True;" }
$r = [ordered]@{ ok = $false; erro = $null; usuario = $null; bancoExiste = $false; podeCriar = $false }
try {
  $cn = New-Object System.Data.SqlClient.SqlConnection $csb
  $cn.Open()
  $cmd = $cn.CreateCommand()
  $cmd.CommandText = "SELECT SUSER_SNAME(), CASE WHEN DB_ID(@b) IS NULL THEN 0 ELSE 1 END, " +
    "CASE WHEN IS_SRVROLEMEMBER('sysadmin') = 1 OR IS_SRVROLEMEMBER('dbcreator') = 1 OR HAS_PERMS_BY_NAME(NULL, NULL, 'CREATE ANY DATABASE') = 1 THEN 1 ELSE 0 END"
  [void]$cmd.Parameters.AddWithValue("@b", $Banco)
  $rd = $cmd.ExecuteReader(); [void]$rd.Read()
  $r.ok = $true; $r.usuario = "$($rd.GetValue(0))"; $r.bancoExiste = ($rd.GetInt32(1) -eq 1); $r.podeCriar = ($rd.GetInt32(2) -eq 1)
  $rd.Close()
  if ($r.bancoExiste) {
    # confere se o login consegue abrir o banco do projeto
    $cmd2 = $cn.CreateCommand(); $cmd2.CommandText = "SELECT HAS_DBACCESS(@b)"; [void]$cmd2.Parameters.AddWithValue("@b", $Banco)
    if ([int]$cmd2.ExecuteScalar() -ne 1) { $r.ok = $false; $r.erro = "O login '$($r.usuario)' não tem acesso ao banco $Banco." }
  }
  $cn.Close()
} catch {
  $r.erro = $_.Exception.InnerException.Message
  if (-not $r.erro) { $r.erro = $_.Exception.Message }
}
ConvertTo-Json -InputObject $r -Compress
