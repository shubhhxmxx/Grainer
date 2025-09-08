package com.shubham.grain.model;


import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;
import org.hibernate.annotations.Fetch;
import org.hibernate.annotations.FetchMode;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Index;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.Transient;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "user_data_set", indexes = {
    @Index(name = "idx_userdataset_user", columnList = "owner_id")
})
public class UserDataSet {
	@Id
	@SequenceGenerator(
        name = "user_data_set_seq",
        sequenceName = "user_data_set_seq",
        allocationSize = 50 
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_data_set_seq")
	private Integer userDataSetId;
	
	@ManyToOne
	@JoinColumn(name =  "owner_id")
	private User user;
	
	@OneToMany(mappedBy = "userDataSet", cascade = CascadeType.ALL , orphanRemoval = true)
	private List<DataSetSubscription> subscriptions=new ArrayList<>();
	
	
	@Transient
	private Integer currentIndex;
	@OneToMany(mappedBy = "userDataSet", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 50)         
    private List<UserDataSetItem> items = new ArrayList<>();
	
	
	private String topic;
	
	private boolean publicVisible;
	

    public void addItem(UserDataSetItem item) {
        items.add(item);
        item.setUserDataSet(this);
    }

    public void removeItem(UserDataSetItem item) {
        items.remove(item);
        item.setUserDataSet(null);
    }
    public void addSubscription(DataSetSubscription subscription) {
        subscriptions.add(subscription);
        subscription.setUserDataSet(this);
    }
    public void removeSubscription(DataSetSubscription subscription) {
        subscriptions.remove(subscription);
        subscription.setUserDataSet(null);
    }
}
