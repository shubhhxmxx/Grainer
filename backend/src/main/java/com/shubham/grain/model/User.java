package com.shubham.grain.model;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.annotations.BatchSize;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
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
@Table(name = "users")
public class User {
	
	@GeneratedValue(strategy = GenerationType.AUTO)
	@Id
	private Integer userId;
	
	
    @Column(nullable = false, unique = true, length = 220)
	private String email;
	
	private String name;
	
	@OneToMany(mappedBy = "user",cascade = CascadeType.ALL ,orphanRemoval = true,fetch = FetchType.LAZY)
	@BatchSize(size = 20)
	List<UserDataSet> userDataSets=new ArrayList<>();
	
	@OneToMany(mappedBy = "user" , cascade = CascadeType.ALL , orphanRemoval = true,fetch = FetchType.LAZY)
	@BatchSize(size = 20)
	List<DataSetSubscription> subscriptions=new ArrayList<>();
	
	public User(String name,String email) {
		this.email=email;
		this.name=name;
		
	}
	
	public void addDataSet(UserDataSet u){
		userDataSets.add(u);
		u.setUser(this);
	}
	
	public void removeDataSet(UserDataSet u) {
		userDataSets.remove(u);
		u.setUser(null);
	}
	public void addSubscription(DataSetSubscription d){
		subscriptions.add(d);
		d.setUser(this);
	}
	
	public void removesubscription(UserDataSet u) {
		subscriptions.remove(u);
		u.setUser(null);
	}
	
	
	
	
	
}
