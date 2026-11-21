package com.itb.inf2cm.aprovest;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import com.itb.inf2cm.aprovest.config.CriadorBanco;

/**
 * AproVest TCC - API REST da plataforma de preparação para vestibulares.
 */
@SpringBootApplication
public class AprovestApplication {

	public static void main(String[] args) {
		SpringApplication app = new SpringApplication(AprovestApplication.class);
		// Na primeira execução, cria o banco aprovesttcc com os scripts da pasta /database
		app.addListeners(new CriadorBanco());
		app.run(args);
	}

}
