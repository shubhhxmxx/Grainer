package com.shubham.grain.model;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
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
	
	@OneToMany(mappedBy = "user",cascade = CascadeType.ALL ,orphanRemoval = true)
	List<UserDataSet> userDataSets;
	
	public User(String name,String email) {
		this.email=email;
		this.name=name;
		
	}
	public void addUserDataSet(UserDataSet uds) {
        userDataSets.add(uds);
        uds.setUser(this); // keep owning side in sync
    }
	
	public void removeUserDataSet(UserDataSet uds) {
        userDataSets.remove(uds);
        uds.setUser(null); // detach owning side so orphanRemoval can delete it
    }
	
}
