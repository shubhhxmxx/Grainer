package com.shubham.grain.service;

import java.util.Optional;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shubham.grain.dto.UserRegisterationDto;
import com.shubham.grain.dto.UserResponseDto;
import com.shubham.grain.mapper.UserMapper;
import com.shubham.grain.model.User;
import com.shubham.grain.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserMapper userMapper;
	
	@Transactional
	public UserResponseDto createUser(UserRegisterationDto userRegisterationDto) {
		if (userRepository.existsByEmail(userRegisterationDto.getEmail())) {
			return new UserResponseDto("Email already Exisits");
		}

		User user = userMapper.toEntity(userRegisterationDto);
		user=userRepository.save(user);
		UserResponseDto userResponseDto=userMapper.toUserReposnseDto(user);
		return userResponseDto;
	}
	@Transactional
    public UserResponseDto getUserById(Integer userId) {
		try{
			
			User user=userRepository.findWithRelationsByUserId(userId).orElseThrow(
				()-> new EntityNotFoundException("User with this id does not exisits")
			);
			return userMapper.toUserReposnseDto(user);

		}catch(Exception e){
			return new UserResponseDto(e.getMessage());
		}
    }

}
