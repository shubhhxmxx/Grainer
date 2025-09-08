package com.shubham.grain.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.shubham.grain.model.DataSetSubscription;
import com.shubham.grain.model.User;
import com.shubham.grain.model.UserDataSet;

@Repository
public interface DataSetSubscriptionRepository extends JpaRepository<DataSetSubscription, Integer> {

    boolean existsByUserAndUserDataSet(User user, UserDataSet userDataSet);


	
    void deleteByUser_UserIdAndUserDataSet_UserDataSetId(Integer userId, Integer datasetId);



	Optional<DataSetSubscription> findByUserAndUserDataSet(User user, UserDataSet userDataSet);

	
}
