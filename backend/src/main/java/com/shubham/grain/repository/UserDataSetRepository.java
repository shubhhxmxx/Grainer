package com.shubham.grain.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.shubham.grain.model.UserDataSet;

@Repository
public interface UserDataSetRepository extends JpaRepository<UserDataSet, Integer> {

	@Query("Select u FROM UserDataSet u where u.publicVisible=true")
	List<UserDataSet> findAllPublicDataSets();

}
