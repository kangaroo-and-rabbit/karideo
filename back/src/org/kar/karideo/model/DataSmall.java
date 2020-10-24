package org.kar.karideo.model;
/*
CREATE TABLE `data` (
  `id` bigint NOT NULL COMMENT 'table ID' AUTO_INCREMENT PRIMARY KEY,
  `deleted` BOOLEAN NOT NULL DEFAULT false,
  `create_date` datetime NOT NULL DEFAULT now() COMMENT 'Time the element has been created',
  `modify_date` datetime NOT NULL DEFAULT now() COMMENT 'Time the element has been update',
  `sha512` varchar(129) COLLATE 'utf8_general_ci' NOT NULL,
  `mime_type` varchar(128) COLLATE 'utf8_general_ci' NOT NULL,
  `size` bigint,
  `original_name` TEXT
) AUTO_INCREMENT=64;
*/

import java.sql.ResultSet;
import java.sql.SQLException;

public class DataSmall {
    public Long id;
    public String sha512;
    public String mimeType;
    public Long size;

    public DataSmall() {

    }

    public DataSmall(ResultSet rs) {
        int iii = 1;
        try {
            this.id = rs.getLong(iii++);
            this.sha512 = rs.getString(iii++);
            this.mimeType = rs.getString(iii++);
            this.size = rs.getLong(iii++);
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
}
