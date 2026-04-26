package hu.tanit.kds.services;

import hu.tanit.kds.models.Order;
import hu.tanit.kds.repos.OrderRepository;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class OrderService {

    private final OrderRepository orderRepository;

    public OrderService(OrderRepository orderRepository) {
        this.orderRepository = orderRepository;
    }

    public List<Order> getAll() {
        return orderRepository.findAll();
    }

    public Order getById(Long id) {
        return orderRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));
    }

    public List<Order> getByUser(Long userId) {
        return orderRepository.findByUserUserId(userId);
    }

    public List<Order> getByStatus(String status) {
        return orderRepository.findByStatus(status);
    }

    public Order create(Order order) {
        order.setTimeStamp(LocalDateTime.now());
        return orderRepository.save(order);
    }

    public Order update(Long id, Order updated) {
        Order o = getById(id);
        o.setStatus(updated.getStatus());
        o.setTableNumb(updated.getTableNumb());
        o.setFullPrice(updated.getFullPrice());
        o.setUser(updated.getUser());
        return orderRepository.save(o);
    }

    public Order updateStatus(Long id, String status) {
        Order o = getById(id);
        o.setStatus(status);
        return orderRepository.save(o);
    }

    public void delete(Long id) {
        if (!orderRepository.existsById(id))
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found");
        orderRepository.deleteById(id);
    }
}
