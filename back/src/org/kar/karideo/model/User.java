package org.kar.karideo.model;

/*
CREATE TABLE `user` (
  `id` bigint NOT NULL COMMENT 'table ID' AUTO_INCREMENT PRIMARY KEY,
  `login` varchar(128) COLLATE 'utf8_general_ci' NOT NULL COMMENT 'login of the user',
  `email` varchar(512) COLLATE 'utf8_general_ci' NOT NULL COMMENT 'email of the user',
  `lastConnection` datetime NOT NULL COMMENT 'last connection time',
  `admin` enum("TRUE", "FALSE") NOT NULL DEFAULT 'FALSE',
  `blocked` enum("TRUE", "FALSE") NOT NULL DEFAULT 'FALSE',
  `removed` enum("TRUE", "FALSE") NOT NULL DEFAULT 'FALSE',
  `avatar` bigint DEFAULT NULL,
) AUTO_INCREMENT=10;

 */

import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Timestamp;

public class User {
    public Long id;
    public String login;
    public String email;
    public Timestamp lastConnection;
    public boolean admin;
    public boolean blocked;
    public boolean removed;
    public Long avatar;

    public User() {
    }

    public User(Long id, String login, Timestamp lastConnection, String email, boolean admin, boolean blocked, boolean removed, Long avatar) {
        this.id = id;
        this.login = login;
        this.lastConnection = lastConnection;
        this.email = email;
        this.admin = admin;
        this.blocked = blocked;
        this.removed = removed;
        this.avatar = avatar;
    }

    public User(ResultSet rs) {
        int iii = 1;
        try {
            this.id = rs.getLong(iii++);
            this.lastConnection = rs.getTimestamp(iii++);
            this.login = rs.getString(iii++);
            this.email = rs.getString(iii++);
            this.admin = Boolean.getBoolean(rs.getString(iii++));
            this.blocked = Boolean.getBoolean(rs.getString(iii++));
            this.removed = Boolean.getBoolean(rs.getString(iii++));
            this.avatar = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.avatar = null;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", login='" + login + '\'' +
                ", email='" + email + '\'' +
                ", lastConnection='" + lastConnection + '\'' +
                ", admin=" + admin +
                ", blocked=" + blocked +
                ", removed=" + removed +
                ", avatar=" + avatar +
                '}';
    }
}
