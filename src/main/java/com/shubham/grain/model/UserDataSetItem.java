package com.shubham.grain.model;


import jakarta.persistence.*;
import lombok.EqualsAndHashCode;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(
    name = "user_data_set_item",
    indexes = {
        @Index(name = "idx_udsi_dataset", columnList = "user_data_set_id")
    },
    uniqueConstraints = {
        @UniqueConstraint(name = "uk_udsi_dataset_row", columnNames = {"user_data_set_id", "row_id"})
    }
)
@Getter
@Setter
@NoArgsConstructor
public class UserDataSetItem {

	@Id
    @SequenceGenerator(
        name = "user_data_set_item_seq",
        sequenceName = "user_data_set_item_seq",
        allocationSize = 50 // set to 1 if not using pooled optimizer
    )
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "user_data_set_item_seq")
    private Integer userDataSetItemId;
		
		private Integer rowId;
		
		@Column(name = "row_data", columnDefinition = "text")
		private String rowData;
		
		@ManyToOne(fetch = FetchType.LAZY, optional = false)
	    @JoinColumn(name = "user_data_set_id", nullable = false)
	    private UserDataSet userDataSet;
		
		public UserDataSetItem(Integer rowId,String rowData) {
			this.rowData=rowData;
			this.rowId=rowId;
		}
		
}
