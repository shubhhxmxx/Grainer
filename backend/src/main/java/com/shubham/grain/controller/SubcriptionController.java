package com.shubham.grain.controller;

import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.shubham.grain.model.DataSetSubscription;
import com.shubham.grain.service.DataSetSubscriptionService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping(value = "/subscriptions")
@RequiredArgsConstructor
@CrossOrigin
public class SubcriptionController {
	
	private final DataSetSubscriptionService dataSetSubscriptionService;
	
	@PostMapping
	public ResponseEntity<Map<String, String>> addSubcription(@RequestParam("userId") Integer userId,@RequestParam("dataSetId") Integer dataSetId
			,@RequestParam(name="frequency" ,defaultValue = "daily") String frequency,
	        @RequestParam(name = "aiEnabled" ,defaultValue = "false") boolean useAi) {
		return  ResponseEntity.ok(dataSetSubscriptionService.addSubscription(userId,dataSetId, useAi));
	}
	
	@DeleteMapping
	public ResponseEntity<Map<String, String>> deleteSubcription(@RequestParam("userId") Integer userId,@RequestParam("dataSetId") Integer dataSetId) {
		return  ResponseEntity.ok(dataSetSubscriptionService.deleteSubscription(userId,dataSetId));
	}
	


}
