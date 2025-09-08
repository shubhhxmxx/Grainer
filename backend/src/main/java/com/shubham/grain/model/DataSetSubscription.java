package com.shubham.grain.model;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter@Setter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DataSetSubscription {

	
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Id
	private Integer dataSetSubscriptionId;
	
	@ManyToOne
	@JoinColumn(name = "user_id")
	private User user;
	
	@ManyToOne
	@JoinColumn(name ="user_data_set_id")
	private UserDataSet userDataSet;
	
	private String frequency;
	
	private Boolean aiEnabled;
	
    private Integer currentIndex;
    private LocalDate lastSentDate;
	
    private String status;


    public UserDataSet getUserDataSetForDTO() {
    	userDataSet.setCurrentIndex(currentIndex);
    	return userDataSet;
    }
	
}
