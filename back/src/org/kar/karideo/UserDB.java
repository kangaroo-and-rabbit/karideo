package org.kar.karideo;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.kar.karideo.db.DBEntry;
import org.kar.karideo.model.State;
import org.kar.karideo.model.User;
import org.kar.karideo.model.UserSmall;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;

public class UserDB {

    public UserDB() {
    }

    public static User getUsers(long userId) {
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
        return null;
    }

    @Deprecated
    public static User getAndCreate(long userId, String token) throws IOException {
        // check Token:
        URL obj = new URL(WebLauncher.getOAuthURI() + "users/check_token?id=" + userId + "&token=" + token);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "karideo");
        con.setRequestProperty("Cache-Control", "no-cache");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        int responseCode = con.getResponseCode();

        System.out.println("GET Response Code :: " + responseCode);
        if (responseCode == HttpURLConnection.HTTP_OK) { // success
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    con.getInputStream()));

            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            // print result
            System.out.println(response.toString());
            ObjectMapper mapper = new ObjectMapper();
            ;
            UserSmall value = mapper.readValue(response.toString(), UserSmall.class);
            System.out.println("user SMALL " + value);

            return null;
        } else {
            System.out.println("GET request not worked");
        }

        return null;
    }

    public static UserSmall getUserOAuth(long userId, String token) throws IOException {
        // check Token:
        URL obj = new URL(WebLauncher.getOAuthURI() + "users/check_token?id=" + userId + "&token=" + token);
        HttpURLConnection con = (HttpURLConnection) obj.openConnection();
        con.setRequestMethod("GET");
        con.setRequestProperty("User-Agent", "karideo");
        con.setRequestProperty("Cache-Control", "no-cache");
        con.setRequestProperty("Content-Type", "application/json");
        con.setRequestProperty("Accept", "application/json");
        int responseCode = con.getResponseCode();

        System.out.println("GET Response Code :: " + responseCode);
        if (responseCode == HttpURLConnection.HTTP_OK) { // success
            BufferedReader in = new BufferedReader(new InputStreamReader(
                    con.getInputStream()));

            String inputLine;
            StringBuffer response = new StringBuffer();
            while ((inputLine = in.readLine()) != null) {
                response.append(inputLine);
            }
            in.close();
            // print result
            System.out.println(response.toString());
            ObjectMapper mapper = new ObjectMapper();
            ;
            return mapper.readValue(response.toString(), UserSmall.class);
        }
        System.out.println("GET request not worked");
        return null;
    }

    public static User getUserOrCreate(UserSmall userOAuth) {
        User user = getUsers(userOAuth.id);
        if (user != null) {
            boolean blocked = false;
            boolean removed = false;
            if (userOAuth.authorisationLevel == State.BLOCKED) {
                blocked = true;
            } else if (userOAuth.authorisationLevel == State.REMOVED) {
                removed = true;
            }
            if (user.email != userOAuth.email || user.login != userOAuth.login || user.blocked != blocked || user.removed != removed) {
                updateUsersInfoFromOAuth(userOAuth.id, userOAuth.email, userOAuth.login, blocked, removed);
            } else {
                updateUsersConnectionTime(userOAuth.id);
            }
            return getUsers(userOAuth.id);
        } else {
            if (userOAuth.authorisationLevel == State.BLOCKED) {
                return null;
            } else if (userOAuth.authorisationLevel == State.REMOVED) {
                return null;
            }
            createUsersInfoFromOAuth(userOAuth.id, userOAuth.email, userOAuth.login);
        }
        return getUsers(userOAuth.id);
    }

    private static void updateUsersConnectionTime(long userId) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `user` SET `lastConnection`=now(3) WHERE `id` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setLong(1, userId);
            ps.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
    }

    private static void updateUsersInfoFromOAuth(long userId, String email, String login, boolean blocked, boolean removed) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `user` SET `login`=?, `email`=?, `lastConnection`=now(3), `blocked`=?, `removed`=? WHERE id = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setString(1, login);
            ps.setString(2, email);
            ps.setString(3, blocked ? "TRUE" : "FALSE");
            ps.setString(4, removed ? "TRUE" : "FALSE");
            ps.setLong(5, userId);
            ps.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
    }

    private static void createUsersInfoFromOAuth(long userId, String email, String login) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "INSERT INTO `user` (`id`, `login`, `email`, `lastConnection`, `admin`, `blocked`, `removed`) VALUE (?,?,?,now(3),'FALSE','FALSE','FALSE')";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setLong(1, userId);
            ps.setString(2, login);
            ps.setString(3, email);
            ps.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
    }

}
































