package hu.tanit.kds.models;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Order {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long orderId;

    private String status;

    private Integer tableNumb;

    private LocalDateTime timeStamp;

    private Integer fullPrice;

    @ManyToOne
    @JoinColumn
    private User user;

    @JsonIgnore
    @OneToMany(mappedBy = "order")
    private List<OrderItem> orderItems  = new ArrayList<>();

}
