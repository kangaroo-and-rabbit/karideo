package org.kar.karideo.api;

import org.kar.karideo.GenericContext;
import org.kar.karideo.Secured;
import org.kar.karideo.UserDB;
import org.kar.karideo.WebLauncher;
import org.kar.karideo.db.DBEntry;
import org.kar.karideo.model.User;
import org.kar.karideo.model.UserExtern;
import org.kar.karideo.model.UserPerso;

import javax.annotation.security.PermitAll;
import javax.annotation.security.RolesAllowed;
import javax.ws.rs.*;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.SecurityContext;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.ArrayList;
import java.util.List;
import java.util.Random;


@Path("/users")
@PermitAll
@Produces({MediaType.APPLICATION_XML, MediaType.APPLICATION_JSON})
public class UserResource {

    public UserResource() {
    }

    private static String randomString(int count) {
        Random rand = new Random(System.nanoTime());
        String s = new String();
        int nbChar = count;
        for (int i = 0; i < nbChar; i++) {
            char c = (char) rand.nextInt();
            while ((c < 'a' || c > 'z') && (c < 'A' || c > 'Z') && (c < '0' || c > '9'))
                c = (char) rand.nextInt();
            s = s + c;
        }
        return s;
    }

    // I do not understand why angular request option before, but this is needed..
	/*
	@OPTIONS
	public Response getOption(){
		return Response.ok()
				.header("Allow", "POST")
				.header("Allow", "GET")
				.header("Allow", "OPTIONS")
				.build();
	}
	 */
    // curl http://localhost:9993/api/users
    @GET
    public List<UserExtern> getUsers() {
        System.out.println("getUsers");
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        List<UserExtern> out = new ArrayList<>();
        String query = "SELECT * FROM user";
        try {
            Statement st = entry.connection.createStatement();
            ResultSet rs = st.executeQuery(query);
            while (rs.next()) {
                out.add(new UserExtern(new User(rs)));
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        entry = null;
        return out;
    }

    // I do not understand why angular request option before, but this is needed..
	/*
	@OPTIONS
	@Path("{id}")
	public Response getTokenOption(@PathParam("id") long userId){
		return Response.ok()
				.header("Allow", "POST")
				.header("Allow", "GET")
				.header("Allow", "OPTIONS")
				.build();
	}
	*/
    // curl http://localhost:9993/api/users/3
    @Secured
    @GET
    @Path("{id}")
    @RolesAllowed("USER")
    public UserExtern getUser(@Context SecurityContext sc, @PathParam("id") long userId) {
        System.out.println("getUser " + userId);
        GenericContext gc = (GenericContext) sc.getUserPrincipal();
        System.out.println("===================================================");
        System.out.println("== USER ? " + gc.user);
        System.out.println("===================================================");
        return new UserExtern(UserDB.getUsers(userId));
    }

    /*
    @OPTIONS
    @Path("me")
    public Response getOptionMe(){
        return Response.ok()
                .header("Allow", "GET")
                .header("Allow", "OPTIONS")
                .build();
    }
    */
    // curl http://localhost:9993/api/users/3
    @Secured
    @GET
    @Path("me")
    @RolesAllowed("USER")
    public UserPerso getMe(@Context SecurityContext sc) {
        System.out.println("getMe()");
        GenericContext gc = (GenericContext) sc.getUserPrincipal();
        System.out.println("===================================================");
        System.out.println("== USER ? " + gc.user);
        System.out.println("===================================================");
        return new UserPerso(gc.user);
    }

    // curl -d '{"id":3,"login":"HeeroYui","password":"bouloued","email":"yui.heero@gmail.com","emailValidate":0,"newEmail":null,"authorisationLevel":"ADMIN"}' -H "Content-Type: application/json" -X POST http://localhost:9993/api/users
    @POST
    public Response createUser(User user) {
        System.out.println("getUser " + user);
		/*
		DBEntry entry = new DBEntry(WebLauncher.dbConfig);
		String query = "SELECT * FROM user WHERE id = ?";
		try {
			PreparedStatement ps = entry.connection.prepareStatement(query);
			ps.setLong(1, userId);
			ResultSet rs = ps.executeQuery();
			if (rs.next()) {
				User out = new User(rs);
				entry.disconnect();
				return out;
			}
		} catch (SQLException throwables) {
			throwables.printStackTrace();
		}
		entry.disconnect();
		entry = null;
		return null;
		 */
        String result = "User saved ... : " + user;
        return Response.status(201).entity(result).build();
    }

    @GET
    @Path("/check_login")
    public Response checkLogin(@QueryParam("login") String login) {
        System.out.println("checkLogin: " + login);

        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT COUNT(*) FROM user WHERE login = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setString(1, login);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                entry.disconnect();
                if (count >= 1) {
                    return Response.ok().build();
                }
                return Response.status(404).build();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        entry.disconnect();
        return Response.status(520).build();
    }

    @GET
    @Path("/check_email")
    public Response checkEmail(@QueryParam("email") String email) {
        System.out.println("checkEmail: " + email);

        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT COUNT(*) FROM user WHERE email = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setString(1, email);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                int count = rs.getInt(1);
                entry.disconnect();
                if (count >= 1) {
                    return Response.ok().build();
                }
                return Response.status(404).build();
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        entry.disconnect();
        return Response.status(520).build();
    }

    public String getSHA512(String passwordToHash) {
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            byte[] bytes = md.digest(passwordToHash.getBytes(StandardCharsets.UTF_8));
            StringBuilder sb = new StringBuilder();
            for (int i = 0; i < bytes.length; i++) {
                sb.append(Integer.toString((bytes[i] & 0xff) + 0x100, 16).substring(1));
            }
            return sb.toString();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
        return null;
    }
}
































