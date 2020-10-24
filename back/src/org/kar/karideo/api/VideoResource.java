package org.kar.karideo.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.kar.karideo.WebLauncher;
import org.kar.karideo.db.DBEntry;
import org.kar.karideo.model.Data;
import org.kar.karideo.model.MediaSmall;
import org.kar.karideo.model.NodeSmall;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

@Path("/video")
@PermitAll
@Produces({MediaType.APPLICATION_JSON})
public class VideoResource {
    // UPDATE `node` SET `type` = "SEASON" WHERE `type` = "SAISON"
    // UPDATE `node` SET `type` = "UNIVERSE" WHERE `type` = "UNIVERS"
    // UPDATE `node` SET `type` = "SERIES" WHERE `type` = "SERIE"

    @GET
    public List<MediaSmall> get() {
        System.out.println("VIDEO get");
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        List<MediaSmall> out = new ArrayList<>();
        String query = "SELECT media.id," +
                "              media.name," +
                "              media.description," +
                "              media.data_id," +
                "              media.type_id," +
                "              media.universe_id," +
                "              media.series_id," +
                "              media.season_id," +
                "              media.episode," +
                "              media.date," +
                "              media.time," +
                "              media.age_limit," +
                "              (SELECT GROUP_CONCAT(tmp.data_id SEPARATOR '-')" +
                "                      FROM cover_link_media tmp" +
                "                      WHERE tmp.deleted = false" +
                "                            AND media.id = tmp.media_id" +
                "                      GROUP BY tmp.media_id) AS covers" +
                " FROM media" +
                " WHERE  media.deleted = false " +
                " GROUP BY media.id" +
                " ORDER BY media.name";
        try {
            Statement st = entry.connection.createStatement();
            ResultSet rs = st.executeQuery(query);
            while (rs.next()) {
                out.add(new MediaSmall(rs));
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        entry = null;
        System.out.println("retrieve " + out.size() + "  VIDEO");
        return out;
    }

    @GET
    @Path("{id}")
    public MediaSmall get(@PathParam("id")  Long id) {
        System.out.println("VIDEO get " + id);
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT media.id," +
                "              media.name," +
                "              media.description," +
                "              media.data_id," +
                "              media.type_id," +
                "              media.universe_id," +
                "              media.series_id," +
                "              media.season_id," +
                "              media.episode," +
                "              media.date," +
                "              media.time," +
                "              media.age_limit," +
                "              (SELECT GROUP_CONCAT(tmp.data_id SEPARATOR '-')" +
                "                      FROM cover_link_media tmp" +
                "                      WHERE tmp.deleted = false" +
                "                            AND media.id = tmp.media_id" +
                "                      GROUP BY tmp.media_id) AS covers" +
                " FROM media" +
                " WHERE  media.deleted = false " +
                "    AND media.id = ? " +
                " GROUP BY media.id" +
                " ORDER BY media.name";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setLong(iii++, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                MediaSmall out = new MediaSmall(rs);
                entry.disconnect();
                entry = null;
                return out;
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        entry = null;
        return null;
    }

    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response put(@PathParam("id") Long id, String jsonRequest) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(jsonRequest);
            String query = "UPDATE `media` SET `modify_date`=now(3)";
            if (!root.path("name").isMissingNode()) {
                query += ", `name` = ? ";
            }
            if (!root.path("description").isMissingNode()) {
                query += ", `description` = ? ";
            }
            if (!root.path("episode").isMissingNode()) {
                query += ", `episode` = ? ";
            }
            if (!root.path("time").isMissingNode()) {
                query += ", `time` = ? ";
            }
            if (!root.path("type_id").isMissingNode()) {
                query += ", `type_id` = ? ";
            }
            if (!root.path("universe_id").isMissingNode()) {
                query += ", `universe_id` = ? ";
            }
            if (!root.path("series_id").isMissingNode()) {
                query += ", `series_id` = ? ";
            }
            if (!root.path("season_id").isMissingNode()) {
                query += ", `season_id` = ? ";
            }
            query += " WHERE `id` = ?";
            DBEntry entry = new DBEntry(WebLauncher.dbConfig);

            try {
                PreparedStatement ps = entry.connection.prepareStatement(query);
                int iii = 1;
                if (!root.path("name").isMissingNode()) {
                    if (root.path("name").isNull()) {
                        ps.setString(iii++, "???");
                    } else {
                        ps.setString(iii++, root.path("name").asText());
                    }
                }
                if (!root.path("description").isMissingNode()) {
                    if (root.path("description").isNull()) {
                        ps.setNull(iii++, Types.VARCHAR);
                    } else {
                        ps.setString(iii++, root.path("description").asText());
                    }
                }
                if (!root.path("episode").isMissingNode()) {
                    if (root.path("episode").isNull()) {
                        ps.setNull(iii++, Types.INTEGER);
                    } else {
                        ps.setInt(iii++, root.path("episode").asInt());
                    }
                }
                if (!root.path("time").isMissingNode()) {
                    if (root.path("time").isNull()) {
                        ps.setNull(iii++, Types.INTEGER);
                    } else {
                        ps.setInt(iii++, root.path("time").asInt());
                    }
                }
                if (!root.path("type_id").isMissingNode()) {
                    if (root.path("type_id").isNull()) {
                        ps.setNull(iii++, Types.BIGINT);
                    } else {
                        ps.setLong(iii++, root.path("type_id").asLong());
                    }
                }
                if (!root.path("universe_id").isMissingNode()) {
                    if (root.path("universe_id").isNull()) {
                        ps.setNull(iii++, Types.BIGINT);
                    } else {
                        ps.setLong(iii++, root.path("universe_id").asLong());
                    }
                }
                if (!root.path("series_id").isMissingNode()) {
                    if (root.path("series_id").isNull()) {
                        ps.setNull(iii++, Types.BIGINT);
                    } else {
                        ps.setLong(iii++, root.path("series_id").asLong());
                    }
                }
                if (!root.path("season_id").isMissingNode()) {
                    if (root.path("season_id").isNull()) {
                        ps.setNull(iii++, Types.BIGINT);
                    } else {
                        ps.setLong(iii++, root.path("season_id").asLong());
                    }
                }
                ps.setLong(iii++, id);
                System.out.println(" request : " + ps.toString());
                ps.executeUpdate();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
                entry.disconnect();
                entry = null;
                return Response.notModified("SQL error").build();
            }
            entry.disconnect();
            entry = null;
        } catch (IOException e) {
            e.printStackTrace();
            return Response.notModified("input json error error").build();
        }
        return Response.ok(get(id)).build();
    }
    /*
        public static void update_time(String table, Long id, Timestamp dateCreate, Timestamp dateModify) {
            DBEntry entry = new DBEntry(WebLauncher.dbConfig);
            String query = "UPDATE " + table + " SET create_date = ?, modify_date = ? WHERE id = ?";
            try {
                PreparedStatement ps = entry.connection.prepareStatement(query);
                ps.setTimestamp(1, dateCreate);
                ps.setTimestamp(2, dateModify);
                ps.setLong(3, id);
                ps.execute();
            } catch (SQLException throwables) {
                throwables.printStackTrace();
            }
            entry.disconnect();
        }
    */
    private String multipartCorrection(String data) {
        if (data == null) {
            return null;
        }
        if (data.isEmpty()) {
            return null;
        }
        if (data.contentEquals("null")) {
            return null;
        }
        return data;
    }



    @POST
    @Path("/upload/")
    @Consumes({MediaType.MULTIPART_FORM_DATA})
    public Response uploadFile(@FormDataParam("file_name") String file_name,
                               @FormDataParam("universe") String universe,
                               @FormDataParam("series") String series,
                               @FormDataParam("season") String season,
                               @FormDataParam("episode") String episode,
                               @FormDataParam("title") String title,
                               @FormDataParam("type_id") String type_id,
                               @FormDataParam("file") InputStream fileInputStream,
                               @FormDataParam("file") FormDataContentDisposition fileMetaData
    ) {
        try {
            // correct input string stream :
            file_name = multipartCorrection(file_name);
            universe = multipartCorrection(universe);
            series = multipartCorrection(series);
            season = multipartCorrection(season);
            episode = multipartCorrection(episode);
            title = multipartCorrection(title);
            type_id = multipartCorrection(type_id);

            //public NodeSmall uploadFile(final FormDataMultiPart form) {
            System.out.println("Upload media file: " + fileMetaData);
            System.out.println("    - file_name: " + file_name);
            System.out.println("    - universe: " + universe);
            System.out.println("    - series: " + series);
            System.out.println("    - season: " + season);
            System.out.println("    - episode: " + episode);
            System.out.println("    - title: " + title);
            System.out.println("    - type_id: " + type_id);
            System.out.println("    - fileInputStream: " + fileInputStream);
            System.out.println("    - fileMetaData: " + fileMetaData);
            System.out.flush();


            long tmpUID = DataResource.getTmpDataId();
            String sha512 = DataResource.saveTemporaryFile(fileInputStream, tmpUID);
            Data data = DataResource.getWithSha512(sha512);
            if (data == null) {
                System.out.println("Need to add the data in the BDD ... ");
                System.out.flush();
                try {
                    data = DataResource.createNewData(tmpUID, file_name, sha512);
                } catch (IOException ex) {
                    DataResource.removeTemporaryFile(tmpUID);
                    ex.printStackTrace();
                    return Response.notModified("can not create input media").build();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                    DataResource.removeTemporaryFile(tmpUID);
                    return Response.notModified("Error in SQL insertion ...").build();
                }
            } else if (data.deleted == true) {
                System.out.println("Data already exist but deleted");
                System.out.flush();
                DataResource.undelete(data.id);
                data.deleted = false;
            } else {
                System.out.println("Data already exist ... all good");
                System.out.flush();
            }
            // Fist step: retive all the Id of each parents:...
            System.out.println("Find typeNode");
            // check if id of type exist:
            NodeSmall typeNode = TypeResource.getWithId(Long.parseLong(type_id));
            if (typeNode == null) {
                DataResource.removeTemporaryFile(tmpUID);
                return Response.notModified("TypeId does not exist ...").build();
            }
            System.out.println("    ==> " + typeNode);
            System.out.println("Find universeNode");
            // get id of universe:
            NodeSmall universeNode = UniverseResource.getOrCreate(universe);

            System.out.println("    ==> " + universeNode);
            System.out.println("Find seriesNode");
            // get uid of group:
            NodeSmall seriesNode = SeriesResource.getOrCreate(series, typeNode.id);

            System.out.println("    ==> " + seriesNode);
            System.out.println("Find seasonNode");
            // get uid of season:
            Integer seasonId = null;
            NodeSmall seasonNode = null;
            try {
                seasonId = Integer.parseInt(season);
                seasonNode = SeasonResource.getOrCreate(Integer.parseInt(season), seriesNode.id);
            } catch (java.lang.NumberFormatException ex) {
                // nothing to do ....
            }

            System.out.println("    ==> " + seasonNode);
            System.out.println("add media");


            DBEntry entry = new DBEntry(WebLauncher.dbConfig);
            long uniqueSQLID = -1;
            // real add in the BDD:
            try {
                // prepare the request:
                String query = "INSERT INTO media (create_date, modify_date, name, data_id, type_id, universe_id, series_id, season_id, episode)" +
                        " VALUES (now(3), now(3), ?, ?, ?, ?, ?, ?, ?)";
                PreparedStatement ps = entry.connection.prepareStatement(query,
                        Statement.RETURN_GENERATED_KEYS);
                int iii = 1;
                ps.setString(iii++, title);
                ps.setLong(iii++, data.id);
                ps.setLong(iii++, typeNode.id);
                if (universeNode == null) {
                    ps.setNull(iii++, Types.BIGINT);
                } else {
                    ps.setLong(iii++, universeNode.id);
                }
                if (seriesNode == null) {
                    ps.setNull(iii++, Types.BIGINT);
                } else {
                    ps.setLong(iii++, seriesNode.id);
                }
                if (seasonNode == null) {
                    ps.setNull(iii++, Types.BIGINT);
                } else {
                    ps.setLong(iii++, seasonNode.id);
                }
                if (episode == null || episode.contentEquals("")) {
                    ps.setNull(iii++, Types.INTEGER);
                } else {
                    ps.setInt(iii++, Integer.parseInt(episode));
                }
                // execute the request
                int affectedRows = ps.executeUpdate();
                if (affectedRows == 0) {
                    throw new SQLException("Creating data failed, no rows affected.");
                }
                // retreive uid inserted
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        uniqueSQLID = generatedKeys.getLong(1);
                    } else {
                        throw new SQLException("Creating user failed, no ID obtained (1).");
                    }
                } catch (Exception ex) {
                    System.out.println("Can not get the UID key inserted ... ");
                    ex.printStackTrace();
                    throw new SQLException("Creating user failed, no ID obtained (2).");
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            // if we do not une the file .. remove it ... otherwise this is meamory leak...
            DataResource.removeTemporaryFile(tmpUID);
            System.out.println("uploaded .... compleate: " + uniqueSQLID);
            MediaSmall creation = get(uniqueSQLID);
            return Response.ok(creation).build();
        } catch (Exception ex) {
            System.out.println("Cat ann unexpected error ... ");
            ex.printStackTrace();
        }
        return Response.serverError().build();
    }
    @POST
    @Path("{id}/add_cover")
    @Consumes({MediaType.MULTIPART_FORM_DATA})
    public Response uploadCover(@PathParam("id") Long id,
                                @FormDataParam("file_name") String file_name,
                                @FormDataParam("file") InputStream fileInputStream,
                                @FormDataParam("file") FormDataContentDisposition fileMetaData
    ) {
        try {
            // correct input string stream :
            file_name = multipartCorrection(file_name);

            //public NodeSmall uploadFile(final FormDataMultiPart form) {
            System.out.println("Upload media file: " + fileMetaData);
            System.out.println("    - id: " + id);
            System.out.println("    - file_name: " + file_name);
            System.out.println("    - fileInputStream: " + fileInputStream);
            System.out.println("    - fileMetaData: " + fileMetaData);
            System.out.flush();
            MediaSmall media = get(id);
            if (media == null) {
                return Response.notModified("Media Id does not exist or removed...").build();
            }

            long tmpUID = DataResource.getTmpDataId();
            String sha512 = DataResource.saveTemporaryFile(fileInputStream, tmpUID);
            Data data = DataResource.getWithSha512(sha512);
            if (data == null) {
                System.out.println("Need to add the data in the BDD ... ");
                System.out.flush();
                try {
                    data = DataResource.createNewData(tmpUID, file_name, sha512);
                } catch (IOException ex) {
                    DataResource.removeTemporaryFile(tmpUID);
                    ex.printStackTrace();
                    return Response.notModified("can not create input media").build();
                } catch (SQLException ex) {
                    ex.printStackTrace();
                    DataResource.removeTemporaryFile(tmpUID);
                    return Response.notModified("Error in SQL insertion ...").build();
                }
            } else if (data.deleted == true) {
                System.out.println("Data already exist but deleted");
                System.out.flush();
                DataResource.undelete(data.id);
                data.deleted = false;
            } else {
                System.out.println("Data already exist ... all good");
                System.out.flush();
            }
            // Fist step: retrieve all the Id of each parents:...
            System.out.println("Find typeNode");

            DBEntry entry = new DBEntry(WebLauncher.dbConfig);
            long uniqueSQLID = -1;
            // real add in the BDD:
            try {
                // prepare the request:
                String query = "INSERT INTO cover_link_media (create_date, modify_date, media_id, data_id)" +
                        " VALUES (now(3), now(3), ?, ?)";
                PreparedStatement ps = entry.connection.prepareStatement(query,
                        Statement.RETURN_GENERATED_KEYS);
                int iii = 1;
                ps.setLong(iii++, media.id);
                ps.setLong(iii++, data.id);
                // execute the request
                int affectedRows = ps.executeUpdate();
                if (affectedRows == 0) {
                    throw new SQLException("Creating data failed, no rows affected.");
                }
                // retreive uid inserted
                try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        uniqueSQLID = generatedKeys.getLong(1);
                    } else {
                        throw new SQLException("Creating user failed, no ID obtained (1).");
                    }
                } catch (Exception ex) {
                    System.out.println("Can not get the UID key inserted ... ");
                    ex.printStackTrace();
                    throw new SQLException("Creating user failed, no ID obtained (2).");
                }
            } catch (SQLException ex) {
                ex.printStackTrace();
            }
            // if we do not une the file .. remove it ... otherwise this is meamory leak...
            DataResource.removeTemporaryFile(tmpUID);
            System.out.println("uploaded .... compleate: " + uniqueSQLID);
            MediaSmall creation = get(id);
            return Response.ok(creation).build();
        } catch (Exception ex) {
            System.out.println("Cat ann unexpected error ... ");
            ex.printStackTrace();
        }
        return Response.serverError().build();
    }
    @GET
    @Path("{id}/rm_cover/{cover_id}")
    public Response removeCover(@PathParam("id") Long mediaId, @PathParam("cover_id") Long coverId) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `cover_link_media` SET `modify_date`=now(3), `deleted`=true WHERE `media_id` = ? AND `data_id` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setLong(iii++, mediaId);
            ps.setLong(iii++, coverId);
            ps.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            entry.disconnect();
            return Response.serverError().build();
        }
        entry.disconnect();
        return Response.ok(get(mediaId)).build();
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Long id) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `media` SET `modify_date`=now(3), `deleted`=true WHERE `id` = ? and `deleted` = false ";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setLong(iii++, id);
            ps.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            entry.disconnect();
            return Response.serverError().build();
        }
        entry.disconnect();
        return Response.ok().build();
    }
}
