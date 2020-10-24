package org.kar.karideo.model;

import java.sql.ResultSet;
import java.sql.SQLException;

public class Data {
    public Long id;
    public boolean deleted;
    public String sha512;
    public String mimeType;
    public Long size;

    public Data() {

    }

    public Data(ResultSet rs) {
        int iii = 1;
        try {
            this.id = rs.getLong(iii++);
            this.deleted = rs.getBoolean(iii++);
            this.sha512 = rs.getString(iii++);
            this.mimeType = rs.getString(iii++);
            this.size = rs.getLong(iii++);
            if (rs.wasNull()) {
                this.size = null;
            }
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
    }
}
