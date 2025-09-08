package com.shubham.grain.service;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.liquibase.LiquibaseProperties.UiService;
import org.springframework.stereotype.Service;

import com.shubham.grain.model.DataSetSubscription;
import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.repository.DataSetSubscriptionRepository;
import com.shubham.grain.repository.UserDataSetRepository;
import com.shubham.grain.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.NoArgsConstructor;
import lombok.RequiredArgsConstructor;

@Service
public class DataSetSubscriptionService {
	
	@Autowired
	private DataSetSubscriptionRepository dataSetSubscriptionRepository;
	@Autowired
	private UserRepository userRepository;
	@Autowired
	private UserDataSetRepository userDataSetRepository;

	public Map<String, String> addSubscription(Integer userId, Integer dataSetId,Boolean useAi) {
	HashMap<String, String> mp=new HashMap<>();
	try {
		User user=userRepository.findById(userId).orElseThrow(()-> 
		new EntityNotFoundException("User Not Found"));
		
		UserDataSet userDataSet= userDataSetRepository.findById(dataSetId).orElseThrow(
				()-> new EntityNotFoundException("DataSet not found")								
				);
		if (!userDataSet.isPublicVisible()) {
	        throw new IllegalStateException("Cannot subscribe to a private dataset");
	    }

	    // Prevent duplicate subscription
	    Optional<DataSetSubscription> d = dataSetSubscriptionRepository.findByUserAndUserDataSet(user, userDataSet);
    	if(d.isEmpty()) {
    		DataSetSubscription dataSetSubscription=new DataSetSubscription().builder()
    	    		.aiEnabled(useAi)
    	    		.currentIndex(0)
    	    		.frequency("daily")
    	    		.lastSentDate(null)
    	    		.status("Active")
    	    		.user(user)
    	    		.userDataSet(userDataSet).build();
    	    dataSetSubscriptionRepository.save(dataSetSubscription);
    	    mp.put("message", "subcribed");
    	}
    	else {
    		DataSetSubscription dataSetSubscription=d.get();
    		if(dataSetSubscription.getAiEnabled().equals(useAi)) {
        	    mp.put("message", "already subcribed");

    		}else {
    			dataSetSubscription.setAiEnabled(useAi);
        	    mp.put("message", "updated");
        	    dataSetSubscriptionRepository.save(dataSetSubscription);
    		}
    	}

	    
	} catch (Exception e) {
			mp.put("message", e.getMessage());
		}
	return mp;
	}

	@Transactional
	public Map<String, String> deleteSubscription(Integer userId, Integer dataSetId) {
		Map<String, String>mp=new HashMap<>();
		try {
		dataSetSubscriptionRepository.deleteByUser_UserIdAndUserDataSet_UserDataSetId(userId,dataSetId);
			mp.put("message","unsubcsribed");
		}catch (Exception e) {
			mp.put("message", e.getMessage());
		}
		return mp;
	}

}
