package hu.tanit.kds.controllers;

import hu.tanit.kds.models.Order;
import hu.tanit.kds.services.OrderService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.context.WebApplicationContext;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
class OrderControllerTest {

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private OrderService orderService;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private Order sampleOrder() {
        Order o = new Order();
        o.setOrderId(1L);
        o.setStatus("PENDING");
        o.setTableNumb(5);
        o.setFullPrice(3000);
        return o;
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getAll_asAdmin_returns200() throws Exception {
        when(orderService.getAll()).thenReturn(List.of(sampleOrder()));

        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"))
                .andExpect(jsonPath("$[0].tableNumb").value(5));
    }

    @Test
    void getAll_noAuth_returns401() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void getAll_asWaiter_returns403() throws Exception {
        mockMvc.perform(get("/api/orders"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getById_asAdmin_returns200() throws Exception {
        when(orderService.getById(1L)).thenReturn(sampleOrder());

        mockMvc.perform(get("/api/orders/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.orderId").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getById_notFound_returns404() throws Exception {
        when(orderService.getById(99L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Order not found"));

        mockMvc.perform(get("/api/orders/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getByUser_returns200() throws Exception {
        when(orderService.getByUser(1L)).thenReturn(List.of(sampleOrder()));

        mockMvc.perform(get("/api/orders/user/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].orderId").value(1));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void getByStatus_returns200() throws Exception {
        when(orderService.getByStatus("PENDING")).thenReturn(List.of(sampleOrder()));

        mockMvc.perform(get("/api/orders/status/PENDING"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].status").value("PENDING"));
    }

    @Test
    void create_noAuth_returns201() throws Exception {
        when(orderService.create(any())).thenReturn(sampleOrder());

        mockMvc.perform(post("/api/orders")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"status\":\"PENDING\",\"tableNumb\":5,\"fullPrice\":3000}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.tableNumb").value(5));
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void updateStatus_asWaiter_returns200() throws Exception {
        Order order = sampleOrder();
        order.setStatus("DONE");
        when(orderService.updateStatus(eq(1L), eq("DONE"))).thenReturn(order);

        mockMvc.perform(patch("/api/orders/1/status")
                        .param("status", "DONE"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("DONE"));
    }

    @Test
    @WithMockUser(roles = "KITCHEN")
    void updateStatus_asKitchen_returns200() throws Exception {
        Order order = sampleOrder();
        order.setStatus("IN_PROGRESS");
        when(orderService.updateStatus(eq(1L), eq("IN_PROGRESS"))).thenReturn(order);

        mockMvc.perform(patch("/api/orders/1/status")
                        .param("status", "IN_PROGRESS"))
                .andExpect(status().isOk());
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void delete_asWaiter_returns204() throws Exception {
        doNothing().when(orderService).delete(1L);

        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_asAdmin_returns204() throws Exception {
        doNothing().when(orderService).delete(1L);

        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    void delete_noAuth_returns401() throws Exception {
        mockMvc.perform(delete("/api/orders/1"))
                .andExpect(status().isUnauthorized());
    }
}
