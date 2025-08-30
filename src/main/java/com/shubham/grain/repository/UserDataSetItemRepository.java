package com.shubham.grain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shubham.grain.model.UserDataSetItem;

@Repository
public interface UserDataSetItemRepository extends JpaRepository<UserDataSetItem, Integer> {

}
