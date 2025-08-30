package com.shubham.grain.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.shubham.grain.model.UserProgress;

@Repository
public interface UserProgressRepository extends JpaRepository<UserProgress,Integer> {

}
