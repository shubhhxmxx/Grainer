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
    @Index(name = "idx_userdataset_user", columnList = "user_id")
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
	
	@ManyToOne(fetch = FetchType.LAZY,optional=false)
	@JoinColumn(name = "user_id")
	private User user;
	
	@OneToOne(mappedBy = "userDataSet", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    private UserProgress userProgress;
	
	@OneToMany(mappedBy = "userDataSet", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @BatchSize(size = 50)         
    private List<UserDataSetItem> items = new ArrayList<>();
	
	private String topic;
	
	
	public void setUser(User user) {
        this.user = user;
        if (user != null && (user.getUserDataSets() == null || !user.getUserDataSets().contains(this))) {
            user.addUserDataSet(this);
        }
    }

    public void setUserProgress(UserProgress progress) {
        this.userProgress = progress;
        if (progress != null && progress.getUserDataSet() != this) {
            progress.setUserDataSet(this);
        }
    }

    public void addItem(UserDataSetItem item) {
        items.add(item);
        item.setUserDataSet(this);
    }

    public void removeItem(UserDataSetItem item) {
        items.remove(item);
        item.setUserDataSet(null);
    }
	
}
