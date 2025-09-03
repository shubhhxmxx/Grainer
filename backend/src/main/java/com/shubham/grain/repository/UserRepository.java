package com.shubham.grain.repository;

import java.util.List;
import java.util.Optional;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import com.shubham.grain.model.User;

@Repository
public interface UserRepository extends JpaRepository<User, Integer> {

    boolean existsByEmail(String email);

    @EntityGraph(attributePaths = { "userDataSets", "userDataSets.userProgress" })
    Optional<User> findWithRelationsByUserId(Integer userId);
    
    @Query("select distinct u from User u join u.userDataSets uds join uds.userProgress up where up.status = :status")
    List<User> findAllUsersWithActiveDataSets(@Param("status") String status);
    
    Optional<User> findByEmail(String email);


}
