package com.shubham.grain.mapper;

import java.util.List;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import com.shubham.grain.dto.UserRegisterationDto;
import com.shubham.grain.dto.UserResponseDto;
import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.mapper.MapStructConfig;
import com.shubham.grain.mapper.UserDataSetMapper;


@Mapper(componentModel = "spring",config = MapStructConfig.class, uses = {UserDataSetMapper.class})
public interface UserMapper {
	   
	@Mapping(source = "userDataSets", target = "userDataSets")
	UserResponseDto toUserResponseDto(User user);
	
	   
	@Mapping(source = "all", target = "userDataSets")
	UserResponseDto toUserResponseDto(User user,List<UserDataSet> all);
	
	@Mapping(target = "userId", ignore = true)
    @Mapping(target = "userDataSets", ignore = true)
	User toEntity(UserRegisterationDto userRegisterationDto);
}
