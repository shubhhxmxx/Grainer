package com.shubham.grain.dto;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.util.ArrayList;
import java.util.List;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserResponseDto {
		
	private Integer userId;
	private String  email;
	private String name;
	private String message;
	
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
	private List<UserDataSetDTO> userDataSets;
    
    public UserResponseDto(String message) {
    	this.message=message;
    }
	

}
