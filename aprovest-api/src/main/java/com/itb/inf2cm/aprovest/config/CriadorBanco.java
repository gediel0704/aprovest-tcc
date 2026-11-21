package com.itb.inf2cm.aprovest.config;

import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;

import org.springframework.boot.context.event.ApplicationEnvironmentPreparedEvent;
import org.springframework.context.ApplicationListener;
import org.springframework.core.env.ConfigurableEnvironment;

/**
 * Cria o banco aprovesttcc automaticamente na primeira execução.
 * <p>
 * Antes de o Spring abrir a conexão com o banco, verifica no SQL Server (banco master)
 * se o aprovesttcc existe. Se não existir, executa os scripts 01 e 02 da pasta /database,
 * dividindo-os nos separadores GO, como o SQL Server Management Studio faz.
 * Pode ser desligado com app.banco.criar-automaticamente=false.
 */
public class CriadorBanco implements ApplicationListener<ApplicationEnvironmentPreparedEvent> {

    private static final String[] SCRIPTS = {
            "01_criar_banco.sql", "02_dados_iniciais.sql" };

    @Override
    public void onApplicationEvent(ApplicationEnvironmentPreparedEvent event) {
        ConfigurableEnvironment env = event.getEnvironment();
        if (!env.getProperty("app.banco.criar-automaticamente", Boolean.class, true)) return;

        String url = env.getProperty("spring.datasource.url", "");
        String usuario = env.getProperty("spring.datasource.username");
        String senha = env.getProperty("spring.datasource.password");
        String banco = extrairBanco(url);
        if (banco == null) return;
        String urlMaster = url.replaceFirst("(?i)databaseName=[^;]+", "databaseName=master");

        try (Connection con = DriverManager.getConnection(urlMaster, usuario, senha);
             Statement st = con.createStatement()) {
            try (ResultSet rs = st.executeQuery("SELECT DB_ID('" + banco.replace("'", "''") + "')")) {
                rs.next();
                if (rs.getObject(1) != null) return; // banco já existe
            }
            Path pasta = localizarScripts(env.getProperty("app.banco.scripts", "../database"));
            if (pasta == null) {
                System.out.println("[AproVest] Banco '" + banco + "' não encontrado e a pasta database/ com os scripts não foi localizada.");
                return;
            }
            System.out.println("[AproVest] Banco '" + banco + "' não encontrado. Criando a partir dos scripts em " + pasta.toAbsolutePath().normalize() + " ...");
            for (String nome : SCRIPTS) {
                List<String> lotes = dividirEmLotes(Files.readString(pasta.resolve(nome), StandardCharsets.UTF_8));
                // os scripts usam o nome aprovesttcc; se a configuração usar outro nome, ele é substituído
                for (String lote : lotes) st.execute(lote.replaceAll("(?i)\\baprovesttcc\\b", banco));
                System.out.println("[AproVest]   " + nome + " executado (" + lotes.size() + " lotes).");
            }
            System.out.println("[AproVest] Banco criado com sucesso.");
        } catch (Exception e) {
            // Não interrompe aqui: se o banco realmente não estiver acessível, o Spring mostrará o erro de conexão.
            System.out.println("[AproVest] Não foi possível verificar/criar o banco automaticamente: " + e.getMessage());
        }
    }

    private static String extrairBanco(String url) {
        var m = java.util.regex.Pattern.compile("(?i)databaseName=([^;]+)").matcher(url);
        return m.find() ? m.group(1) : null;
    }

    private static Path localizarScripts(String configurada) {
        for (String candidata : new String[] { configurada, "database", "../database" }) {
            Path p = Path.of(candidata);
            if (Files.exists(p.resolve(SCRIPTS[0]))) return p;
        }
        return null;
    }

    /** Divide o script nos separadores GO (linha contendo apenas GO), ignorando lotes vazios. */
    static List<String> dividirEmLotes(String script) {
        List<String> lotes = new ArrayList<>();
        StringBuilder atual = new StringBuilder();
        for (String linha : script.replace("\r", "").split("\n")) {
            if (linha.trim().equalsIgnoreCase("GO")) {
                if (!atual.toString().isBlank()) lotes.add(atual.toString());
                atual.setLength(0);
            } else {
                atual.append(linha).append('\n');
            }
        }
        if (!atual.toString().isBlank()) lotes.add(atual.toString());
        return lotes;
    }
}
