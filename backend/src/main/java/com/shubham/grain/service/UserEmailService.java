package com.shubham.grain.service;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.kafka.KafkaProperties.Retry.Topic;
import org.springframework.mail.MailSender;
import org.springframework.mail.SimpleMailMessage;

import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;
import com.shubham.grain.model.UserDataSetItem;
import com.shubham.grain.model.UserProgress;
import com.shubham.grain.repository.UserProgressRepository;
import com.shubham.grain.repository.UserRepository;

import jakarta.transaction.Transactional;

@Service
public class UserEmailService {
	
	@Autowired
	private JavaMailSender javaMailSender;
	
	@Autowired
	private UserRepository userRepository;
	
	@Autowired
	private UserProgressRepository userProgressRepository;
	
	@Transactional
	public void sendDailyMail() {
		List<User> activeUsers=userRepository.findAllUsersWithActiveDataSets("Active");
		for(User user:activeUsers) {
			List<String> contentList=new ArrayList();
			List<String> topicList=new ArrayList();
			for(UserDataSet userDataSet:user.getUserDataSets()) {
				UserProgress userProgress=userDataSet.getUserProgress();
				Integer rowNumber=userProgress.getLastSentItem();
				topicList.add(userDataSet.getTopic());
				UserDataSetItem item=userDataSet.getItems().get(rowNumber);
				contentList.add(item.getRowData());
				userProgress.setLastSentItem(rowNumber+1);
				if(rowNumber>=userDataSet.getItems().size()) {
					userProgress.setStatus("InActive");
				}
			}
			sendEmail(user.getEmail(),prepareContent(contentList,topicList));
		}
	}
	
	private String prepareContent(List<String> content,List<String> topic) {
		StringBuffer buffer=new StringBuffer();
		
		for(Integer i=0;i<topic.size();i++) {
			buffer.append(topic.get(i)+" of the day:\n");
			buffer.append(content.get(i)+"\n");
			
		}
		return buffer.toString();
	}
	public void sendEmail(String email,String content) {
		SimpleMailMessage message=new SimpleMailMessage();
		message.setFrom("grainerlearn@gmail.com");
		message.setTo(email);
		message.setText(content);
		message.setSubject("DailyLearner");
		try {
			javaMailSender.send(message);
		}catch (Exception e) {
			System.out.println("e:"+e.getMessage());
		}
	}
}
