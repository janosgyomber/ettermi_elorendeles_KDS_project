package hu.tanit.kds.controllers;

import hu.tanit.kds.models.Category;
import hu.tanit.kds.services.CategoryService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.http.HttpStatus;
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
class CategoryControllerTest {

    @Autowired
    private WebApplicationContext context;

    @MockitoBean
    private CategoryService categoryService;

    private MockMvc mockMvc;

    @BeforeEach
    void setup() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
    }

    private Category sampleCategory() {
        Category cat = new Category();
        cat.setCategoryId(1L);
        cat.setName("Burgerek");
        cat.setDescription("Friss húsos burgerek");
        return cat;
    }

    private List<Category> allCategories() {
        return List.of(
                categoryOf(1L, "Burgerek", "Friss húsos burgerek"),
                categoryOf(2L, "Italok", "Meleg és hideg italok"),
                categoryOf(3L, "Köretek", "Sültek és saláták"),
                categoryOf(4L, "Desszertek", "Édességek"),
                categoryOf(5L, "Egyéb", "Egyéb termékek")
        );
    }

    private Category categoryOf(Long id, String name, String description) {
        Category cat = new Category();
        cat.setCategoryId(id);
        cat.setName(name);
        cat.setDescription(description);
        return cat;
    }

    @Test
    void getAll_noAuth_returns200() throws Exception {
        when(categoryService.getAll()).thenReturn(allCategories());

        mockMvc.perform(get("/api/categories"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.length()").value(5))
                .andExpect(jsonPath("$[0].name").value("Burgerek"))
                .andExpect(jsonPath("$[1].name").value("Italok"))
                .andExpect(jsonPath("$[2].name").value("Köretek"))
                .andExpect(jsonPath("$[3].name").value("Desszertek"))
                .andExpect(jsonPath("$[4].name").value("Egyéb"));
    }

    @Test
    void getById_noAuth_returns200() throws Exception {
        when(categoryService.getById(1L)).thenReturn(sampleCategory());

        mockMvc.perform(get("/api/categories/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Burgerek"));
    }

    @Test
    void getById_notFound_returns404() throws Exception {
        when(categoryService.getById(99L))
                .thenThrow(new ResponseStatusException(HttpStatus.NOT_FOUND, "Category not found"));

        mockMvc.perform(get("/api/categories/99"))
                .andExpect(status().isNotFound());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void create_asAdmin_returns201() throws Exception {
        when(categoryService.create(any())).thenReturn(sampleCategory());

        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Burgerek\",\"description\":\"Friss húsos burgerek\"}"))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.name").value("Burgerek"));
    }

    @Test
    void create_noAuth_returns401() throws Exception {
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Burgerek\",\"description\":\"Friss húsos burgerek\"}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @WithMockUser(roles = "WAITER")
    void create_asWaiter_returns403() throws Exception {
        mockMvc.perform(post("/api/categories")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Burgerek\",\"description\":\"Friss húsos burgerek\"}"))
                .andExpect(status().isForbidden());
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void update_asAdmin_returns200() throws Exception {
        Category updated = categoryOf(2L, "Italok", "Meleg és hideg italok");
        when(categoryService.update(eq(2L), any())).thenReturn(updated);

        mockMvc.perform(put("/api/categories/2")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"name\":\"Italok\",\"description\":\"Meleg és hideg italok\"}"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Italok"));
    }

    @Test
    @WithMockUser(roles = "ADMIN")
    void delete_asAdmin_returns204() throws Exception {
        doNothing().when(categoryService).delete(1L);

        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isNoContent());
    }

    @Test
    @WithMockUser(roles = "KITCHEN")
    void delete_asKitchen_returns403() throws Exception {
        mockMvc.perform(delete("/api/categories/1"))
                .andExpect(status().isForbidden());
    }
}
