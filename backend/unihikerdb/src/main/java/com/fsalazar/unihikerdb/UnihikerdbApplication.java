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
				registry.addMapping("/api/sensor-readings/temperature").allowedOrigins("http://localhost:4200");
				registry.addMapping("/api/sensor-readings/humidity").allowedOrigins("http://localhost:4200");
				registry.addMapping("/api/audit/**").allowedOrigins("http://localhost:4200");
			}
		};
	}

}
