package com.shubham.grain.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.shubham.grain.dto.UserDataSetDTO;
import com.shubham.grain.dto.UserRegisterationDto;
import com.shubham.grain.dto.UserResponseDto;
import com.shubham.grain.mapper.UserDataSetMapper;
import com.shubham.grain.mapper.UserMapper;
import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserService {
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserMapper userMapper;
	
	@Autowired
	private UserDataSetMapper userDataSetMapper;
	
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
			
			List<UserDataSet> subsribedList=user.getSubscriptions().stream().map(s->(s.getUserDataSetForDTO())).collect(Collectors.toList());
			return  userMapper.toUserReposnseDto(user,subsribedList);

		}catch(Exception e){
			return new UserResponseDto(e.getMessage());
		}
    }

	@Transactional
    public UserResponseDto signIn(String email) {
        return userRepository.findByEmail(email)
            .map(userMapper::toUserReposnseDto)
            .orElseGet(() -> new UserResponseDto("User not found"));
    }

    @Transactional
    public UserResponseDto signInOrCreate(UserRegisterationDto dto) {
        return userRepository.findByEmail(dto.getEmail())
            .map(userMapper::toUserReposnseDto)
            .orElseGet(() -> {
                User user = userMapper.toEntity(dto);
                user = userRepository.save(user);
                return userMapper.toUserReposnseDto(user);
            });
    }
}
