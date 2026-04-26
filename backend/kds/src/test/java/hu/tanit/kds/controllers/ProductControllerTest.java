package hu.tanit.kds.controllers;

import hu.tanit.kds.models.Category;
import hu.tanit.kds.models.Product;
import hu.tanit.kds.services.ProductService;
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
class ProductControllerTest {

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private ProductService productService;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private Product sampleProduct() {
        Category cat = new Category();
        cat.setCategoryId(1L);
        cat.setName("Burgerek");

        Product p = new Product();
        p.setProductId(1L);
        p.setName("Classic Burger");
        p.setDescription("Marhahúsos burger sajttal és salátával");
        p.setPrice(2490);
        p.setAvailable(true);
        p.setCategory(cat);
        return p;
    }

    @Test
    void getAll_noAuth_returns200() throws Exception {
        when(productService.getAll()).thenReturn(List.of(sampleProduct()));

        mockMvc.perform(get("/api/products"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Classic Burger"))
                .andExpect(jsonPath("$[0].price").value(2490));
    }

    @Test
    void getById_noAuth_returns200() throws Exception {
        when(productService.getById(1L)).thenReturn(sampleProduct());

        mockMvc.perform(get("/api/products/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Classic Burger"))
                .andExpect(jsonPath("$.available").value(true));
    }

    @Test
    void getById_notFound_returns404() throws Exception {
        when(productService.getById(99L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Product not found"));

        mockMvc.perform(get("/api/products/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    void getAvailable_noAuth_returns200() throws Exception {
        when(productService.getAvailable()).thenReturn(List.of(sampleProduct()));

        mockMvc.perform(get("/api/products/available"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].available").value(true));
    }

    @Test
    void getByCategory_noAuth_returns200() throws Exception {
        when(productService.getByCategory(1L)).thenReturn(List.of(sampleProduct()));

        mockMvc.perform(get("/api/products/category/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].name").value("Classic Burger"))
                .andExpect(jsonPath("$[0].category.name").value("Burgerek"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_asAdmin_returns201() throws Exception {
        when(productService.create(any())).thenReturn(sampleProduct());

        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Classic Burger\",\"description\":\"Marhahúsos\",\"price\":2490,\"available\":true,\"category\":{\"categoryId\":1}}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Classic Burger"));
    }

    @Test
    void create_noAuth_returns401() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Classic Burger\",\"price\":2490}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "KITCHEN")
    void create_asKitchen_returns403() throws Exception {
        mockMvc.perform(post("/api/products")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Classic Burger\",\"price\":2490}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void update_asAdmin_returns200() throws Exception {
        Product updated = new Product();
        updated.setProductId(1L);
        updated.setName("BBQ Burger");
        updated.setPrice(2790);
        updated.setAvailable(true);
        when(productService.update(eq(1L), any())).thenReturn(updated);

        mockMvc.perform(put("/api/products/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"BBQ Burger\",\"description\":\"Füstölt sajt\",\"price\":2790,\"available\":true}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("BBQ Burger"))
                .andExpect(jsonPath("$.price").value(2790));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_asAdmin_returns204() throws Exception {
        doNothing().when(productService).delete(1L);

        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void delete_asWaiter_returns403() throws Exception {
        mockMvc.perform(delete("/api/products/1"))
                .andExpect(status().isForbidden());
    }
}
