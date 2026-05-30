package com.fsalazar.authorizationserver.repository;

import java.util.Optional;

import org.springframework.data.repository.Repository;

import com.fsalazar.authorizationserver.model.User;

public interface UserRepository extends Repository<User, Long> {

	Optional<User> findById(Long id);

	Optional<User> findByUsername(String username);
}
