package hu.tanit.kds.services;

import hu.tanit.kds.models.Category;
import hu.tanit.kds.repos.CategoryRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class CategoryServiceTest {

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private CategoryService categoryService;

    private Category sampleCategory() {
        Category cat = new Category();
        cat.setCategoryId(1L);
        cat.setName("Burgerek");
        cat.setDescription("Friss húsos burgerek");
        return cat;
    }

    @Test
    void getAll_returnsAllCategories() {
        List<Category> categories = List.of(
                sampleCategory(),
                categoryOf(2L, "Italok", "Meleg és hideg italok"),
                categoryOf(3L, "Köretek", "Sültek és saláták"),
                categoryOf(4L, "Desszertek", "Édességek"),
                categoryOf(5L, "Egyéb", "Egyéb termékek")
        );
        when(categoryRepository.findAll()).thenReturn(categories);

        assertThat(categoryService.getAll()).hasSize(5);
    }

    @Test
    void getById_found_returnsCategory() {
        when(categoryRepository.findById(1L)).thenReturn(Optional.of(sampleCategory()));

        Category result = categoryService.getById(1L);

        assertThat(result.getName()).isEqualTo("Burgerek");
        assertThat(result.getDescription()).isEqualTo("Friss húsos burgerek");
    }

    @Test
    void getById_notFound_throwsResponseStatusException() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.getById(99L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void create_savesAndReturnsCategory() {
        Category cat = sampleCategory();
        when(categoryRepository.save(cat)).thenReturn(cat);

        Category result = categoryService.create(cat);

        assertThat(result).isEqualTo(cat);
        verify(categoryRepository).save(cat);
    }

    private Category categoryOf(Long id, String name, String description) {
        Category cat = new Category();
        cat.setCategoryId(id);
        cat.setName(name);
        cat.setDescription(description);
        return cat;
    }

    @Test
    void update_updatesNameAndDescription() {
        Category existing = sampleCategory();
        Category updated = new Category();
        updated.setName("Italok");
        updated.setDescription("Meleg és hideg italok");

        when(categoryRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(categoryRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Category result = categoryService.update(1L, updated);

        assertThat(result.getName()).isEqualTo("Italok");
        assertThat(result.getDescription()).isEqualTo("Meleg és hideg italok");
        assertThat(result.getCategoryId()).isEqualTo(1L);
    }

    @Test
    void update_notFound_throwsResponseStatusException() {
        when(categoryRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> categoryService.update(99L, new Category()))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void delete_exists_callsDeleteById() {
        when(categoryRepository.existsById(1L)).thenReturn(true);

        categoryService.delete(1L);

        verify(categoryRepository).deleteById(1L);
    }

    @Test
    void delete_notFound_throwsResponseStatusException() {
        when(categoryRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> categoryService.delete(99L))
                .isInstanceOf(ResponseStatusException.class);
        verify(categoryRepository, never()).deleteById(any());
    }
}
