package com.fsalazar.unihikerdb;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@SpringBootApplication
public class UnihikerdbApplication {

	public static void main(String[] args) {
		SpringApplication.run(UnihikerdbApplication.class, args);
	}

	@Bean
	public WebMvcConfigurer corsConfigurer() {
		return new WebMvcConfigurer() {
			@Override
			public void addCorsMappings(CorsRegistry registry) {
				String[] allowedOrigins = {
						"http://localhost:4200",
						"http://127.0.0.1:4200"
				};
				registry.addMapping("/api/sensor-readings/temperature").allowedOrigins(allowedOrigins);
				registry.addMapping("/api/sensor-readings/humidity").allowedOrigins(allowedOrigins);
				registry.addMapping("/api/audit/**").allowedOrigins(allowedOrigins);
				registry.addMapping("/api/audit-solicitations/**").allowedOrigins(allowedOrigins);
			}
		};
	}

}
