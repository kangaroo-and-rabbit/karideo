package org.kar.karideo;


import org.kar.karideo.model.User;

import javax.ws.rs.core.SecurityContext;
import java.security.Principal;

// https://simplapi.wordpress.com/2015/09/19/jersey-jax-rs-securitycontext-in-action/
class MySecurityContext implements SecurityContext {

    private final GenericContext contextPrincipale;
    private final String sheme;

    public MySecurityContext(User user, String sheme) {
        this.contextPrincipale = new GenericContext(user);
        this.sheme = sheme;
    }

    @Override
    public Principal getUserPrincipal() {
        return contextPrincipale;
    }

    @Override
    public boolean isUserInRole(String role) {
        if (role.contentEquals("ADMIN")) {
            return contextPrincipale.user.admin == true;
        }
        if (role.contentEquals("USER")) {
            return contextPrincipale.user.admin == false;
        }
        return false;
    }

    @Override
    public boolean isSecure() {
        return true;
    }

    @Override
    public String getAuthenticationScheme() {
        return "Yota";
    }

}