package com.shubham.grain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.shubham.grain.dto.UserRegisterationDto;
import com.shubham.grain.dto.UserResponseDto;
import com.shubham.grain.model.User;

import com.shubham.grain.mapper.MapStructConfig;
import com.shubham.grain.mapper.UserDataSetMapper;


@Mapper(componentModel = "spring",config = MapStructConfig.class, uses = {UserDataSetMapper.class})
public interface UserMapper {
	   
	@Mapping(source = "userDataSets", target = "userDataSets")
	UserResponseDto toUserReposnseDto(User user);
	
	@Mapping(target = "userId", ignore = true)
    @Mapping(target = "userDataSets", ignore = true)
	User toEntity(UserRegisterationDto userRegisterationDto);
}
