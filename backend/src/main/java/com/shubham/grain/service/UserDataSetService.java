package com.shubham.grain.service;

import java.io.BufferedReader;

import java.io.InputStreamReader;
import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.shubham.grain.dto.UserDataSetDTO;
import com.shubham.grain.dto.UserResponseDto;
import com.shubham.grain.mapper.UserDataSetMapper;
import com.shubham.grain.model.DataSetSubscription;
import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.model.UserDataSetItem;
import com.shubham.grain.repository.DataSetSubscriptionRepository;
import com.shubham.grain.repository.UserDataSetRepository;
import com.shubham.grain.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
public class UserDataSetService {
	
	@Autowired
	private UserDataSetMapper userDataSetMapper;
	
	@Autowired 
	private UserRepository userRepository;
	
	@Autowired
	private UserDataSetRepository userDataSetRepository;
	
	@Autowired
	private DataSetSubscriptionRepository dataSetSubscriptionRepository;
	
	@Transactional
	public UserDataSetDTO uploadCsv(Integer userId,MultipartFile file,String topic) {
		User user;
		try{	
		 user=userRepository.findWithRelationsByUserId(userId).orElseThrow(
				()-> new EntityNotFoundException("User with this id does not exisits")
			);

		}catch(Exception e){
			return new UserDataSetDTO(e.getMessage());
		}
		UserDataSet userDataSet=new UserDataSet();
		userDataSet.setUser(user);
		userDataSet.setTopic(topic);
		userDataSet.setPublicVisible(true);
		try(BufferedReader reader=new BufferedReader(new InputStreamReader(file.getInputStream()))){
			String[] header=reader.readLine().split(",");
			
			String line;
			int j=1;
			int row=0;
			while((line=reader.readLine())!=null) {
				row++;
				String[] values=line.split(",");
				StringBuffer data=new StringBuffer();
				for(int i=0;i<header.length;i++) {
					data.append(header[i]+": "+values[i]+"\n");
				}
				UserDataSetItem userDataSetItem=new UserDataSetItem(row,data.toString());
				userDataSet.addItem(userDataSetItem);
			}
			
			
		}catch (Exception e) {
			return new UserDataSetDTO(e.getMessage());
		}
		userDataSet=userDataSetRepository.save(userDataSet);
		
		// create subscription for user
		DataSetSubscription dataSetSubscription=DataSetSubscription.builder()
				.currentIndex(0)
				.user(user)
				.userDataSet(userDataSet)
				.aiEnabled(false)
				.status("Active").build();
		dataSetSubscriptionRepository.save(dataSetSubscription);
		return userDataSetMapper.toDto(userDataSet);
	}
}
