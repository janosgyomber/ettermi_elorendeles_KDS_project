package hu.tanit.kds.services;

import hu.tanit.kds.models.OrderItem;
import hu.tanit.kds.repos.OrderItemRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@Service
public class OrderItemService {

    private final OrderItemRepository orderItemRepository;

    public OrderItemService(OrderItemRepository orderItemRepository) {
        this.orderItemRepository = orderItemRepository;
    }

    public List<OrderItem> getAll() {
        return orderItemRepository.findAll();
    }

    public OrderItem getById(Long id) {
        return orderItemRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found"));
    }

    public OrderItem create(OrderItem orderItem) {
        return orderItemRepository.save(orderItem);
    }

    public OrderItem update(Long id, OrderItem updated) {
        OrderItem item = getById(id);
        item.setQuantity(updated.getQuantity());
        item.setComment(updated.getComment());
        item.setItemStatus(updated.getItemStatus());
        item.setProduct(updated.getProduct());
        item.setOrder(updated.getOrder());
        return orderItemRepository.save(item);
    }

    public OrderItem updateStatus(Long id, String status) {
        OrderItem item = getById(id);
        item.setItemStatus(status);
        return orderItemRepository.save(item);
    }

    public void delete(Long id) {
        if (!orderItemRepository.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "OrderItem not found");
        orderItemRepository.deleteById(id);
    }
}
