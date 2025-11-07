package com.example.server;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

import org.springframework.web.bind.annotation.RestController;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@SpringBootApplication
@RestController
public class ServerApplication {
	
	private static final Logger logger = LoggerFactory.getLogger(ServerApplication.class);
	
	public static void main(String[] args) {
      SpringApplication.run(ServerApplication.class, args);
    }
	
    @GetMapping("/hello")
    public String hello(@RequestParam(value = "name", defaultValue = "World") String name) {
	    logger.info("Hello endpoint được gọi với name: {}", name);
        return String.format("Hello %s!", name);
    }

    @GetMapping("/")
    public String home() {
        return "Welcome to the Education Management System!";
    }

}
