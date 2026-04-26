package hu.tanit.kds.services;

import hu.tanit.kds.models.Order;
import hu.tanit.kds.repos.OrderRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class OrderServiceTest {

    @Mock
    private OrderRepository orderRepository;

    @InjectMocks
    private OrderService orderService;

    private Order sampleOrder() {
        Order o = new Order();
        o.setOrderId(1L);
        o.setStatus("PENDING");
        o.setTableNumb(5);
        o.setFullPrice(3000);
        return o;
    }

    @Test
    void getAll_returnsAllOrders() {
        when(orderRepository.findAll()).thenReturn(List.of(sampleOrder(), new Order()));

        assertThat(orderService.getAll()).hasSize(2);
    }

    @Test
    void getById_found_returnsOrder() {
        when(orderRepository.findById(1L)).thenReturn(Optional.of(sampleOrder()));

        Order result = orderService.getById(1L);

        assertThat(result.getOrderId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo("PENDING");
    }

    @Test
    void getById_notFound_throwsResponseStatusException() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.getById(99L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void getByUser_returnsOrdersForUser() {
        when(orderRepository.findByUserUserId(1L)).thenReturn(List.of(sampleOrder()));

        assertThat(orderService.getByUser(1L)).hasSize(1);
    }

    @Test
    void getByStatus_returnsMatchingOrders() {
        when(orderRepository.findByStatus("PENDING")).thenReturn(List.of(sampleOrder()));

        assertThat(orderService.getByStatus("PENDING")).hasSize(1);
    }

    @Test
    void create_setsTimestampAndSaves() {
        Order order = new Order();
        when(orderRepository.save(any(Order.class))).thenAnswer(inv -> inv.getArgument(0));

        Order result = orderService.create(order);

        assertThat(result.getTimeStamp()).isNotNull();
        assertThat(result.getTimeStamp()).isBeforeOrEqualTo(LocalDateTime.now());
        verify(orderRepository).save(order);
    }

    @Test
    void update_updatesAllFields() {
        Order existing = sampleOrder();
        Order updated = new Order();
        updated.setStatus("DONE");
        updated.setTableNumb(3);
        updated.setFullPrice(5000);

        when(orderRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Order result = orderService.update(1L, updated);

        assertThat(result.getStatus()).isEqualTo("DONE");
        assertThat(result.getTableNumb()).isEqualTo(3);
        assertThat(result.getFullPrice()).isEqualTo(5000);
    }

    @Test
    void update_notFound_throwsResponseStatusException() {
        when(orderRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> orderService.update(99L, new Order()))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void updateStatus_changesStatusOnly() {
        Order order = sampleOrder();
        when(orderRepository.findById(1L)).thenReturn(Optional.of(order));
        when(orderRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Order result = orderService.updateStatus(1L, "IN_PROGRESS");

        assertThat(result.getStatus()).isEqualTo("IN_PROGRESS");
        assertThat(result.getTableNumb()).isEqualTo(5);
    }

    @Test
    void delete_exists_callsDeleteById() {
        when(orderRepository.existsById(1L)).thenReturn(true);

        orderService.delete(1L);

        verify(orderRepository).deleteById(1L);
    }

    @Test
    void delete_notFound_throwsResponseStatusException() {
        when(orderRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> orderService.delete(99L))
                .isInstanceOf(ResponseStatusException.class);
        verify(orderRepository, never()).deleteById(any());
    }
}
