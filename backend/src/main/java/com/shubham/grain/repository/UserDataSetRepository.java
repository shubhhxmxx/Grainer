package com.shubham.grain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shubham.grain.model.UserDataSet;

@Repository
public interface UserDataSetRepository extends JpaRepository<UserDataSet, Integer> {

}
