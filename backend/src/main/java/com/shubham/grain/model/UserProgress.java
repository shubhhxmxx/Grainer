package com.shubham.grain.model;


import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "user_progress")
@Getter
@Setter
public class UserProgress {
	
	@Id
    @SequenceGenerator(
        name = "user_progress_seq",
        sequenceName = "user_progress_seq",
        allocationSize = 50 
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_progress_seq")
	private Integer userProgressId;

	private Integer lastSentItem;
	
	
	private String status;
	
	@OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_data_set_id", nullable = false, unique = true)
	private UserDataSet userDataSet;
	
	public UserProgress() {
		this.lastSentItem=1;
		this.status="Active";
		
	}
}
