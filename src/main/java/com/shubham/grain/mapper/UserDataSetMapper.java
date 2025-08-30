package com.shubham.grain.mapper;

import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import com.shubham.grain.dto.UserDataSetDTO;
import com.shubham.grain.model.UserDataSet;

@Mapper(config = MapStructConfig.class , uses = {UserProgressMapper.class})
public interface UserDataSetMapper {

    @Mapping(source = "userDataSetId", target = "id")
    @Mapping(source = "userProgress", target = "progress")
    @Mapping(target = "itemCount", expression = "java(entity.getItems() == null ? 0 : entity.getItems().size())")
    UserDataSetDTO toDto(UserDataSet entity);
}