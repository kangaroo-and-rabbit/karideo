package org.kar.karideo;

import org.kar.karideo.model.User;
import org.kar.karideo.model.UserSmall;

import javax.annotation.Priority;
import javax.ws.rs.Priorities;
import javax.ws.rs.container.ContainerRequestContext;
import javax.ws.rs.container.ContainerRequestFilter;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.Response;
import javax.ws.rs.ext.Provider;
import java.io.IOException;
// https://stackoverflow.com/questions/26777083/best-practice-for-rest-token-based-authentication-with-jax-rs-and-jersey
// https://stackoverflow.com/questions/26777083/best-practice-for-rest-token-based-authentication-with-jax-rs-and-jersey/45814178#45814178
// https://stackoverflow.com/questions/32817210/how-to-access-jersey-resource-secured-by-rolesallowed

//@Provider
//@PreMatching
@Secured
@Provider
@Priority(Priorities.AUTHENTICATION)
public class AuthenticationFilter implements ContainerRequestFilter {

    private static final String REALM = "example";
    private static final String AUTHENTICATION_SCHEME = "Yota";

    @Override
    public void filter(ContainerRequestContext requestContext) throws IOException {
        System.out.println("-----------------------------------------------------");
        System.out.println("----          Check if have authorization        ----");
        System.out.println("-----------------------------------------------------");
        // Get the Authorization header from the request
        String authorizationHeader = requestContext.getHeaderString(HttpHeaders.AUTHORIZATION);

        System.out.println("authorizationHeader: " + authorizationHeader);
        // Validate the Authorization header
        if (!isTokenBasedAuthentication(authorizationHeader)) {
            abortWithUnauthorized(requestContext);
            return;
        }

        // Extract the token from the Authorization header
        String token = authorizationHeader.substring(AUTHENTICATION_SCHEME.length()).trim();
        System.out.println("token: " + token);
        User user = null;
        try {
            user = validateToken(token);
        } catch (Exception e) {
            abortWithUnauthorized(requestContext);
        }
        if (user == null) {
            abortWithUnauthorized(requestContext);
        }
        String scheme = requestContext.getUriInfo().getRequestUri().getScheme();
        requestContext.setSecurityContext(new MySecurityContext(user, scheme));
        System.out.println("Get local user : " + user);
    }

    private boolean isTokenBasedAuthentication(String authorizationHeader) {

        // Check if the Authorization header is valid
        // It must not be null and must be prefixed with "Bearer" plus a whitespace
        // The authentication scheme comparison must be case-insensitive
        return authorizationHeader != null && authorizationHeader.toLowerCase()
                .startsWith(AUTHENTICATION_SCHEME.toLowerCase() + " ");
    }

    private void abortWithUnauthorized(ContainerRequestContext requestContext) {

        // Abort the filter chain with a 401 status code response
        // The WWW-Authenticate header is sent along with the response
        requestContext.abortWith(
                Response.status(Response.Status.UNAUTHORIZED)
                        .header(HttpHeaders.WWW_AUTHENTICATE,
                                AUTHENTICATION_SCHEME + " realm=\"" + REALM + "\"")
                        .build());
    }

    private User validateToken(String authorization) throws Exception {
        System.out.println("-----------------------------------------------------");
        System.out.println("----          TODO validate token                ----");
        System.out.println("-----------------------------------------------------");
        // Check if the token was issued by the server and if it's not expired
        // Throw an Exception if the token is invalid
        String[] value = authorization.split(":");
        long user = Long.valueOf(value[0]);
        String token = value[1];
        UserSmall userOAuth = UserDB.getUserOAuth(user, token);
        System.out.println("Get local userOAuth : " + userOAuth);
        return UserDB.getUserOrCreate(userOAuth);
    }
}