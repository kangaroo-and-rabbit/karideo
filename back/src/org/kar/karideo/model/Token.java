package org.kar.karideo.model;

import java.sql.ResultSet;
import java.sql.SQLException;

/*
CREATE TABLE `token` (
  `id` bigint NOT NULL COMMENT 'Unique ID of the TOKEN' AUTO_INCREMENT PRIMARY KEY,
  `userId` bigint NOT NULL COMMENT 'Unique ID of the user',
  `token` varchar(128) COLLATE 'latin1_bin' NOT NULL COMMENT 'Token (can be not unique)',
  `createTime` datetime NOT NULL COMMENT 'Time the token has been created',
  `endValidityTime` datetime NOT NULL COMMENT 'Time of the token end validity'
) AUTO_INCREMENT=10;

 */
public class Token {
    public Long id;
    public Long userId;
    public String token;
    public String createTime;
    public String endValidityTime;

    public Token() {
    }

    public Token(long id, long userId, String token, String createTime, String endValidityTime) {
        this.id = id;
        this.userId = userId;
        this.token = token;
        this.createTime = createTime;
        this.endValidityTime = endValidityTime;
    }

    public Token(ResultSet rs) {
        int iii = 1;
        try {
            this.id = rs.getLong(iii++);
            this.userId = rs.getLong(iii++);
            this.token = rs.getString(iii++);
            this.createTime = rs.getString(iii++);
            this.endValidityTime = rs.getString(iii++);
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return "Token{" +
                "id=" + id +
                ", userId=" + userId +
                ", token='" + token + '\'' +
                ", createTime=" + createTime +
                ", endValidityTime=" + endValidityTime +
                '}';
    }
}
