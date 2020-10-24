package org.kar.karideo.model;
/*
CREATE TABLE `node` (
  `id` bigint NOT NULL COMMENT 'table ID' AUTO_INCREMENT PRIMARY KEY,
  `deleted` BOOLEAN NOT NULL DEFAULT false,
  `create_date` datetime NOT NULL DEFAULT now() COMMENT 'Time the element has been created',
  `modify_date` datetime NOT NULL DEFAULT now() COMMENT 'Time the element has been update',
  `type` enum("TYPE", "UNIVERS", "SERIE", "SAISON", "MEDIA") NOT NULL DEFAULT 'TYPE',
  `name` TEXT COLLATE 'utf8_general_ci' NOT NULL,
  `description` TEXT COLLATE 'utf8_general_ci',
  `parent_id` bigint
) AUTO_INCREMENT=10;
*/

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class NodeSmall {
    public Long id;
    public String name;
    public String description;
    public Long parent_id;
    public List<Long> covers = new ArrayList<>();

    public NodeSmall(ResultSet rs) {
        int iii = 1;
        try {
            this.id = rs.getLong(iii++);
            this.name = rs.getString(iii++);
            this.description = rs.getString(iii++);
            this.parent_id = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.parent_id = null;
            }
            String coversString = rs.getString(iii++);
            if (!rs.wasNull()) {
                String[] elements = coversString.split("-");
                for (String elem : elements) {
                    Long tmp = Long.parseLong(elem);
                    covers.add(tmp);
                }
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }

    @Override
    public String toString() {
        return "NodeSmall{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", description='" + description + '\'' +
                ", parent_id=" + parent_id +
                ", covers=" + covers +
                '}';
    }
}
