package com.shubham.grain.mapper;

import org.mapstruct.Mapper;

import org.mapstruct.Mapping;

import com.shubham.grain.dto.UserProgressDTO;
import com.shubham.grain.model.UserProgress;

@Mapper(config = MapStructConfig.class)
public interface UserProgressMapper {

    @Mapping(source = "userProgressId", target = "id")
    @Mapping(source ="status",target = "status")
    UserProgressDTO toDto(UserProgress entity);
}