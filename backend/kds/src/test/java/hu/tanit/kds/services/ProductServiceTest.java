package hu.tanit.kds.services;

import hu.tanit.kds.models.Category;
import hu.tanit.kds.models.Product;
import hu.tanit.kds.repos.ProductRepository;
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
class ProductServiceTest {

    @Mock
    private ProductRepository productRepository;

    @InjectMocks
    private ProductService productService;

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

    private Category categoryOf(Long id, String name) {
        Category cat = new Category();
        cat.setCategoryId(id);
        cat.setName(name);
        return cat;
    }

    @Test
    void getAll_returnsAllProducts() {
        when(productRepository.findAll()).thenReturn(List.of(sampleProduct(), new Product()));

        assertThat(productService.getAll()).hasSize(2);
    }

    @Test
    void getById_found_returnsProduct() {
        when(productRepository.findById(1L)).thenReturn(Optional.of(sampleProduct()));

        Product result = productService.getById(1L);

        assertThat(result.getName()).isEqualTo("Classic Burger");
        assertThat(result.getPrice()).isEqualTo(2490);
    }

    @Test
    void getById_notFound_throwsResponseStatusException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.getById(99L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void getByCategory_returnsProductsInCategory() {
        when(productRepository.findByCategoryCategoryId(1L)).thenReturn(List.of(sampleProduct()));

        List<Product> result = productService.getByCategory(1L);

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getName()).isEqualTo("Classic Burger");
    }

    @Test
    void getAvailable_returnsOnlyAvailableProducts() {
        when(productRepository.findByAvailable(true)).thenReturn(List.of(sampleProduct()));

        List<Product> result = productService.getAvailable();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getAvailable()).isTrue();
    }

    @Test
    void create_savesAndReturnsProduct() {
        Product p = sampleProduct();
        when(productRepository.save(p)).thenReturn(p);

        Product result = productService.create(p);

        assertThat(result).isEqualTo(p);
        verify(productRepository).save(p);
    }

    @Test
    void update_updatesAllFields() {
        Product existing = sampleProduct();
        Product updated = new Product();
        updated.setName("BBQ Burger");
        updated.setDescription("Füstölt sajt és BBQ szósz");
        updated.setPrice(2790);
        updated.setAvailable(false);
        updated.setCategory(categoryOf(1L, "Burgerek"));

        when(productRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(productRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        Product result = productService.update(1L, updated);

        assertThat(result.getName()).isEqualTo("BBQ Burger");
        assertThat(result.getPrice()).isEqualTo(2790);
        assertThat(result.getAvailable()).isFalse();
    }

    @Test
    void update_notFound_throwsResponseStatusException() {
        when(productRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> productService.update(99L, new Product()))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void delete_exists_callsDeleteById() {
        when(productRepository.existsById(1L)).thenReturn(true);

        productService.delete(1L);

        verify(productRepository).deleteById(1L);
    }

    @Test
    void delete_notFound_throwsResponseStatusException() {
        when(productRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> productService.delete(99L))
                .isInstanceOf(ResponseStatusException.class);
        verify(productRepository, never()).deleteById(any());
    }
}
