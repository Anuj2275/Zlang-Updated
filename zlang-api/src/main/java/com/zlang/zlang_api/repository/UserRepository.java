package com.zlang.zlang_api.repository;  // separation of concerns (all DB interaction code lives in one place)

import com.zlang.zlang_api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional; // write safe and bug-resistant code

/**
 * Repository interface for User documents. This is the Data Access Layer (DAL).
 * It provides a powerful, abstracted way to interact with the 'users' collection in MongoDB.
 */
public interface UserRepository extends MongoRepository<User, String> {
//this MongoRepo give us some methods like save,findbyid,findall,delte,...

    /**
     * Finds a user by their username. Spring Data automatically generates the query
     * for this method based on its name. This is a "derived query method".
     *
     * @param username The username to search for in the database.
     * @return An Optional containing the User if found, otherwise an empty Optional.
     */
    Optional<User> findByUsername(String username);

}
