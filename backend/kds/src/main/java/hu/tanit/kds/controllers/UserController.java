package hu.tanit.kds.controllers;

import hu.tanit.kds.dto.UserDTO;
import hu.tanit.kds.models.User;
import hu.tanit.kds.repos.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserRepository userRepository;

    public UserController(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @GetMapping
    public List<UserDTO> getAll() {
        return userRepository.findAll().stream().map(this::toDTO).toList();
    }

    @GetMapping("/{id}")
    public ResponseEntity<UserDTO> getById(@PathVariable Long id) {
        return userRepository.findById(id)
                .map(u -> ResponseEntity.ok(toDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/username/{username}")
    public ResponseEntity<UserDTO> getByUsername(@PathVariable String username) {
        return userRepository.findByUsername(username)
                .map(u -> ResponseEntity.ok(toDTO(u)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PostMapping
    public UserDTO create(@RequestBody User user) {
        return toDTO(userRepository.save(user));
    }

    @PutMapping("/{id}")
    public ResponseEntity<UserDTO> update(@PathVariable Long id, @RequestBody User updated) {
        return userRepository.findById(id).map(u -> {
            u.setUsername(updated.getUsername());
            u.setName(updated.getName());
            u.setRole(updated.getRole());
            if (updated.getPassword() != null && !updated.getPassword().isBlank()) {
                u.setPassword(updated.getPassword());
            }
            return ResponseEntity.ok(toDTO(userRepository.save(u)));
        }).orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        if (!userRepository.existsById(id)) return ResponseEntity.notFound().build();
        userRepository.deleteById(id);
        return ResponseEntity.noContent().build();
    }

    private UserDTO toDTO(User u) {
        return new UserDTO(u.getUserId(), u.getUsername(), u.getName(), u.getRole());
    }
}
