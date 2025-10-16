package com.shubham.grain;

import java.util.Properties;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.mail.MailSender;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.JavaMailSenderImpl;

import com.google.genai.Client;

@SpringBootApplication
public class GrainApplication {
	
	@Value("${GOOGLE_API_KEY}")
	private String apiKey;
	
	public static void main(String[] args) {
		SpringApplication.run(GrainApplication.class, args);
	}
	
	@Bean
	Client client() {
		return Client.builder().apiKey(apiKey).build();
	}
	@Bean
	JavaMailSender mailSender(
	    @Value("${spring.mail.host}") String host,
	    @Value("${spring.mail.port}") int port,
	    @Value("${spring.mail.username}") String username,
	    @Value("${spring.mail.password}") String password) {
	    JavaMailSenderImpl s = new JavaMailSenderImpl();
	    s.setHost(host); s.setPort(port);
	    s.setUsername(username); s.setPassword(password);
	    var props = s.getJavaMailProperties();
	    props.put("mail.smtp.auth","true");
	    props.put("mail.smtp.starttls.enable","true");
	    props.put("mail.smtp.starttls.required","true");
	    props.put("mail.debug","true");
	    return s;
	}

}
