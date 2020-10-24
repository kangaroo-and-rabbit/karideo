package org.kar.karideo.model;
/*
CREATE TABLE `node` (
  `id` bigint NOT NULL COMMENT 'table ID' AUTO_INCREMENT PRIMARY KEY,
  `deleted` BOOLEAN NOT NULL DEFAULT false,
  `create_date` datetime NOT NULL DEFAULT now() COMMENT 'Time the element has been created',
  `modify_date` datetime NOT NULL DEFAULT now() COMMENT 'Time the element has been update',
  `type` enum("TYPE", "UNIVERSE", "SERIES", "SEASON") NOT NULL DEFAULT 'TYPE',
  `name` TEXT COLLATE 'utf8_general_ci' NOT NULL,
  `description` TEXT COLLATE 'utf8_general_ci',
  `parent_id` bigint
) AUTO_INCREMENT=10;
*/

import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class MediaSmall {
    public Long id;
    public String name;
    public String description;
    public Long data_id;
    public Long type_id;
    public Long universe_id;
    public Long series_id;
    public Long season_id;
    public Integer episode;
    public Integer date;
    public Integer time;
    public String age_limit;
    public List<Long> covers = new ArrayList<>();

    public MediaSmall(ResultSet rs) {
        int iii = 1;
        try {
            this.id = rs.getLong(iii++);
            this.name = rs.getString(iii++);
            this.description = rs.getString(iii++);
            this.data_id = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.data_id = null;
            }
            this.type_id = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.type_id = null;
            }
            this.universe_id = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.universe_id = null;
            }
            this.series_id = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.series_id = null;
            }
            this.season_id = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.season_id = null;
            }
            this.episode = rs.getInt(iii++);
            if (rs.wasNull()) {
                this.episode = null;
            }
            this.date = rs.getInt(iii++);
            if (rs.wasNull()) {
                this.date = null;
            }
            this.time = rs.getInt(iii++);
            if (rs.wasNull()) {
                this.time = null;
            }
            this.age_limit = rs.getString(iii++);
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
}
