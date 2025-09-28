package com.zlang.zlang_api.repository;  // separation of concerns (all DB interaction code lives in one place)

import com.zlang.zlang_api.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional; // write safe and bug-resistant code


public interface UserRepository extends MongoRepository<User, String> {
//(MongoRepository<User, String>)this MongoRepo give us some methods like save,findbyid,findall,delete,...


    // derived query method, Spring data is smart enough to understand the name and auto generate the correct DB query
    Optional<User> findByUsername(String username);

}
