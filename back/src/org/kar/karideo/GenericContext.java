package org.kar.karideo;

import org.kar.karideo.model.User;

import java.security.Principal;

public class GenericContext implements Principal {

    public User user;

    public GenericContext(User user) {
        this.user = user;
    }

    @Override
    public String getName() {
        if (user == null) {
            return "???";
        }
        return user.login;
    }
}
