package com.shubham.grain.dto;

import com.fasterxml.jackson.annotation.JsonInclude;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter @Setter
@NoArgsConstructor @AllArgsConstructor
@Builder
@JsonInclude(JsonInclude.Include.NON_NULL)
public class UserDataSetDTO {
	
    private Integer id;
    private Integer progress;
    private Integer itemCount;
    @JsonInclude(JsonInclude.Include.NON_EMPTY)
    private String message;
    
    private String topic;
    
    public UserDataSetDTO(String message) {
		this.message=message;
	}
}