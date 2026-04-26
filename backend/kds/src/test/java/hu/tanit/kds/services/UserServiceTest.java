package hu.tanit.kds.services;

import hu.tanit.kds.dto.UserDTO;
import hu.tanit.kds.models.User;
import hu.tanit.kds.repos.UserRepository;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private User sampleUser() {
        User u = new User();
        u.setUserId(1L);
        u.setUsername("admin");
        u.setPassword("$2a$encoded");
        u.setName("Adminisztrátor");
        u.setRole("ADMIN");
        return u;
    }

    @Test
    void loadUserByUsername_found_returnsUserDetails() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(sampleUser()));

        UserDetails details = userService.loadUserByUsername("admin");

        assertThat(details.getUsername()).isEqualTo("admin");
        assertThat(details.getAuthorities())
                .anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"));
    }

    @Test
    void loadUserByUsername_notFound_throwsUsernameNotFoundException() {
        when(userRepository.findByUsername("ismeretlen")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.loadUserByUsername("ismeretlen"))
                .isInstanceOf(UsernameNotFoundException.class);
    }

    @Test
    void getAll_returnsDTOList() {
        when(userRepository.findAll()).thenReturn(List.of(sampleUser()));

        List<UserDTO> result = userService.getAll();

        assertThat(result).hasSize(1);
        assertThat(result.get(0).getUsername()).isEqualTo("admin");
        assertThat(result.get(0).getRole()).isEqualTo("ADMIN");
    }

    @Test
    void getById_found_returnsDTO() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(sampleUser()));

        UserDTO result = userService.getById(1L);

        assertThat(result.getUserId()).isEqualTo(1L);
        assertThat(result.getName()).isEqualTo("Adminisztrátor");
    }

    @Test
    void getById_notFound_throwsResponseStatusException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getById(99L))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void getByUsername_found_returnsDTO() {
        when(userRepository.findByUsername("admin")).thenReturn(Optional.of(sampleUser()));

        UserDTO result = userService.getByUsername("admin");

        assertThat(result.getUsername()).isEqualTo("admin");
    }

    @Test
    void getByUsername_notFound_throwsResponseStatusException() {
        when(userRepository.findByUsername("nincs")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.getByUsername("nincs"))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void create_encodesPasswordAndReturnsDTO() {
        User user = new User();
        user.setUsername("pincér");
        user.setPassword("jelszo123");
        user.setName("Kiss Péter");
        user.setRole("WAITER");

        when(passwordEncoder.encode("jelszo123")).thenReturn("$2a$encoded_jelszo");
        when(userRepository.save(any())).thenAnswer(inv -> {
            User saved = inv.getArgument(0);
            saved.setUserId(2L);
            return saved;
        });

        UserDTO result = userService.create(user);

        verify(passwordEncoder).encode("jelszo123");
        assertThat(user.getPassword()).isEqualTo("$2a$encoded_jelszo");
        assertThat(result.getUsername()).isEqualTo("pincér");
        assertThat(result.getUserId()).isEqualTo(2L);
    }

    @Test
    void update_withNewPassword_encodesPassword() {
        User existing = sampleUser();
        User updated = new User();
        updated.setUsername("admin2");
        updated.setName("Adminisztrátor 2");
        updated.setRole("ADMIN");
        updated.setPassword("ujjelszo");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(passwordEncoder.encode("ujjelszo")).thenReturn("$2a$encoded_new");
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        UserDTO result = userService.update(1L, updated);

        verify(passwordEncoder).encode("ujjelszo");
        assertThat(result.getUsername()).isEqualTo("admin2");
        assertThat(result.getRole()).isEqualTo("ADMIN");
    }

    @Test
    void update_withBlankPassword_doesNotEncodePassword() {
        User existing = sampleUser();
        User updated = new User();
        updated.setUsername("admin");
        updated.setName("Adminisztrátor");
        updated.setRole("ADMIN");
        updated.setPassword("");

        when(userRepository.findById(1L)).thenReturn(Optional.of(existing));
        when(userRepository.save(any())).thenAnswer(inv -> inv.getArgument(0));

        userService.update(1L, updated);

        verify(passwordEncoder, never()).encode(any());
    }

    @Test
    void update_notFound_throwsResponseStatusException() {
        when(userRepository.findById(99L)).thenReturn(Optional.empty());

        assertThatThrownBy(() -> userService.update(99L, new User()))
                .isInstanceOf(ResponseStatusException.class);
    }

    @Test
    void delete_exists_callsDeleteById() {
        when(userRepository.existsById(1L)).thenReturn(true);

        userService.delete(1L);

        verify(userRepository).deleteById(1L);
    }

    @Test
    void delete_notFound_throwsResponseStatusException() {
        when(userRepository.existsById(99L)).thenReturn(false);

        assertThatThrownBy(() -> userService.delete(99L))
                .isInstanceOf(ResponseStatusException.class);
        verify(userRepository, never()).deleteById(any());
    }
}
