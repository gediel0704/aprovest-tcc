# =====================================================================
# AproVest TCC - Configuração do SQL Server local (execute como ADMINISTRADOR)
# Funciona com a instância padrão (MSSQLSERVER) ou com instâncias nomeadas (ex.: SQLEXPRESS).
# 1) Habilita o protocolo TCP/IP (a API Java só conecta por TCP)
# 2) Ativa a autenticação "SQL Server e Windows" (modo misto)
# 3) Reinicia o serviço do SQL Server
# 4) (Opcional) Habilita o login "sa" com a senha que você digitar
# Uso: powershell -ExecutionPolicy Bypass -File database\configurar-sqlserver.ps1 [-Instancia SQLEXPRESS]
# =====================================================================
param([string]$Instancia = "")
$ErrorActionPreference = "Stop"

$admin = ([Security.Principal.WindowsPrincipal][Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)
if (-not $admin) {
    Write-Host "Abra o PowerShell como Administrador (botão direito > Executar como administrador) e rode o script novamente." -ForegroundColor Red
    exit 1
}

# Instâncias instaladas: nome -> identificador (ex.: MSSQLSERVER -> MSSQL16.MSSQLSERVER)
$nomes = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\Instance Names\SQL" -ErrorAction SilentlyContinue
if (-not $nomes) { Write-Host "Nenhuma instância do SQL Server encontrada neste computador." -ForegroundColor Red; exit 1 }
$todas = $nomes.PSObject.Properties | Where-Object { $_.Name -notlike "PS*" }
if (-not $Instancia) { $Instancia = ($todas | Select-Object -First 1).Name }
$alvo = $todas | Where-Object { $_.Name -eq $Instancia }
if (-not $alvo) { Write-Host "Instância '$Instancia' não encontrada. Instâncias: $(($todas | ForEach-Object Name) -join ', ')" -ForegroundColor Red; exit 1 }

$chave = "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$($alvo.Value)\MSSQLServer"
$servico = if ($Instancia -eq "MSSQLSERVER") { "MSSQLSERVER" } else { "MSSQL`$$Instancia" }
Write-Host "Instância: $Instancia ($($alvo.Value)) - serviço $servico" -ForegroundColor Cyan

# 1) TCP/IP com porta fixa (1433 se estiver livre para esta instância)
$porta = "1433"
foreach ($outra in $todas | Where-Object { $_.Name -ne $Instancia }) {
    $ipall = Get-ItemProperty "HKLM:\SOFTWARE\Microsoft\Microsoft SQL Server\$($outra.Value)\MSSQLServer\SuperSocketNetLib\Tcp\IPAll" -ErrorAction SilentlyContinue
    if ($ipall -and "$($ipall.TcpPort)".Trim() -eq "1433") { $porta = "1434" }
}
if ($porta -eq "1434") { $porta = "14330" }   # 1434 é reservada ao SQL Browser
$tcp = "$chave\SuperSocketNetLib\Tcp"
Set-ItemProperty -Path $tcp -Name Enabled -Value 1
Set-ItemProperty -Path "$tcp\IPAll" -Name TcpPort -Value $porta
Set-ItemProperty -Path "$tcp\IPAll" -Name TcpDynamicPorts -Value ""
Write-Host "[1/4] TCP/IP habilitado na porta $porta" -ForegroundColor Green

# 2) Modo de autenticação misto (2 = SQL Server e Windows)
Set-ItemProperty -Path $chave -Name LoginMode -Value 2
Write-Host "[2/4] Autenticação SQL Server e Windows ativada" -ForegroundColor Green

# 3) Reinicia o serviço
Restart-Service -Name $servico -Force
Start-Sleep -Seconds 5
Write-Host "[3/4] Serviço $servico reiniciado" -ForegroundColor Green

# 4) Habilita o login sa (opcional: com Enter em branco, a API usa a autenticação do Windows)
$senhaSegura = Read-Host "Senha para o usuário sa (Enter para pular e usar só a autenticação do Windows)" -AsSecureString
$senha = [Runtime.InteropServices.Marshal]::PtrToStringAuto([Runtime.InteropServices.Marshal]::SecureStringToBSTR($senhaSegura))
if ($senha) {
    if ($senha.Length -lt 8) { Write-Host "A senha precisa ter pelo menos 8 caracteres, com letras, números e símbolo." -ForegroundColor Red; exit 1 }
    $conexao = New-Object System.Data.SqlClient.SqlConnection "Server=tcp:127.0.0.1,$porta;Database=master;Integrated Security=True;TrustServerCertificate=True;"
    $conexao.Open()
    $cmd = $conexao.CreateCommand()
    $senhaSql = $senha.Replace("'", "''")
    $cmd.CommandText = "ALTER LOGIN sa WITH PASSWORD = N'$senhaSql', CHECK_POLICY = OFF; ALTER LOGIN sa ENABLE;"
    $cmd.ExecuteNonQuery() | Out-Null
    $conexao.Close()
    Write-Host "[4/4] Login 'sa' habilitado" -ForegroundColor Green
} else {
    Write-Host "[4/4] Login 'sa' não alterado (a API usará a autenticação do Windows)" -ForegroundColor Yellow
}

Write-Host "`nTudo pronto! Agora rode 'npm run dev' na pasta do projeto." -ForegroundColor Green
