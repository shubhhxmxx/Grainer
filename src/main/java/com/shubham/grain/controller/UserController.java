package com.shubham.grain.controller;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.shubham.grain.dto.UserRegisterationDto;
import com.shubham.grain.dto.UserResponseDto;
import com.shubham.grain.service.UserEmailService;
import com.shubham.grain.service.UserService;

@RestController
@RequestMapping("/users")
public class UserController {
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private UserEmailService userEmailService;
	
	@PostMapping("/create")
    public ResponseEntity<UserResponseDto> createUser( @RequestBody UserRegisterationDto userRegistrationDto) {
        UserResponseDto response = userService.createUser(userRegistrationDto);
        return ResponseEntity.status(HttpStatus.CREATED).body(response); // Return 201 Created
    }
	
	@GetMapping(value="/{id}")
	public ResponseEntity<UserResponseDto> getByUserId(@PathVariable Integer id){
		 	UserResponseDto response = userService.getUserById(id);
	        return ResponseEntity.status(HttpStatus.OK).body(response); 
	   
	}
	
	@GetMapping(value = "/testMail")
	public void sendEmail() {
		userEmailService.sendDailyMail();
	}
	
}
