package hu.tanit.kds.controllers;

import hu.tanit.kds.models.Order;
import hu.tanit.kds.repos.OrderRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    private final OrderRepository orderRepository;

    public OrderController(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    @GetMapping
    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Order> getById(@PathVariable Long id) {
        return orderRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/user/{userId}")
    public List<Order> getByUser(@PathVariable Long userId) {
        return orderRepository.findByUserUserId(userId);
    }

    @GetMapping("/status/{status}")
    public List<Order> getByStatus(@PathVariable String status) {
        return orderRepository.findByStatus(status);
    }

    @PostMapping
    public Order create(@RequestBody Order order) {
        order.setTimeStamp(LocalDateTime.now());
        return orderRepository.save(order);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Order> update(@PathVariable Long id, @RequestBody Order updated) {
        return orderRepository.findById(id).map(o -> {
            o.setStatus(updated.getStatus());
            o.setTableNumb(updated.getTableNumb());
            o.setFullPrice(updated.getFullPrice());
            o.setUser(updated.getUser());
            return ResponseEntity.ok(orderRepository.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<Order> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderRepository.findById(id).map(o -> {
            o.setStatus(status);
            return ResponseEntity.ok(orderRepository.save(o));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!orderRepository.existsById(id)) return ResponseEntity.notFound().build();
        orderRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
