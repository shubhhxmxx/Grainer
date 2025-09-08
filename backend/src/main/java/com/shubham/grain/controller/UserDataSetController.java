package com.shubham.grain.controller;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.shubham.grain.dto.UserDataSetDTO;
import com.shubham.grain.mapper.UserDataSetMapper;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.repository.UserDataSetRepository;
import com.shubham.grain.service.UserDataSetService;

import jakarta.annotation.Nullable;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping
@RequiredArgsConstructor
@CrossOrigin
public class UserDataSetController {
	
	private final UserDataSetService userDataSetService;
	private final UserDataSetRepository userDataSetRepository;
	private final UserDataSetMapper mapper;
	
	@PostMapping("/readCsv")
	public ResponseEntity<UserDataSetDTO> readCsv(@RequestParam("file") MultipartFile file,@RequestParam("userId") Integer userId,@RequestParam("useAi") Boolean useAi, @RequestParam("topic") String topic){
		UserDataSetDTO userDataSetDTO=userDataSetService.uploadCsv(userId, file,topic);
		return  ResponseEntity.ok(userDataSetDTO); 
	}
	
	@GetMapping("/datasets/public")
	public List<UserDataSetDTO> getPublicDataSets(){
		List<UserDataSet> list=userDataSetRepository.findAllPublicDataSets();
		return list.stream().map(mapper::toDto).collect(Collectors.toList());
	}
	
}
