package hu.tanit.kds.controllers;

import hu.tanit.kds.models.OrderItem;
import hu.tanit.kds.repos.OrderItemRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order-items")
public class OrderItemController {

    private final OrderItemRepository orderItemRepository;

    public OrderItemController(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    @GetMapping
    public List<OrderItem> getAll() {
        return orderItemRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<OrderItem> getById(@PathVariable Long id) {
        return orderItemRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public OrderItem create(@RequestBody OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    @PutMapping("/{id}")
    public ResponseEntity<OrderItem> update(@PathVariable Long id, @RequestBody OrderItem updated) {
        return orderItemRepository.findById(id).map(item -> {
            item.setQuantity(updated.getQuantity());
            item.setComment(updated.getComment());
            item.setItemStatus(updated.getItemStatus());
            item.setProduct(updated.getProduct());
            item.setOrder(updated.getOrder());
            return ResponseEntity.ok(orderItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<OrderItem> updateStatus(@PathVariable Long id, @RequestParam String status) {
        return orderItemRepository.findById(id).map(item -> {
            item.setItemStatus(status);
            return ResponseEntity.ok(orderItemRepository.save(item));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!orderItemRepository.existsById(id)) return ResponseEntity.notFound().build();
        orderItemRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }
}
