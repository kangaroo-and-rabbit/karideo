package org.kar.karideo.api;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.kar.karideo.WebLauncher;
import org.kar.karideo.db.DBEntry;
import org.kar.karideo.model.Data;
import org.kar.karideo.model.NodeSmall;

import javax.ws.rs.core.Response;
import java.io.IOException;
import java.io.InputStream;
import java.sql.*;
import java.util.ArrayList;
import java.util.List;

public class NodeInterface {
    /* test en SQL qui fait joli...
        SELECT node.id,
            node.name,
            node.description,
            node.parent_id,
            GROUP_CONCAT(cover_link_node.data_id  SEPARATOR '-') as covers
        FROM node, cover_link_node
        WHERE node.deleted = false AND cover_link_node.deleted = false AND node.type = "TYPE" AND cover_link_node.node_id = node.id
        GROUP BY node.id
        ORDER BY node.name

        // bon c'est bien mais c'est mieux en faisant un left join avec préfiltrage ...


        SELECT node.id,
            node.name,
            node.description,
            node.parent_id,
            cover_link_node.data_id
        FROM node
        LEFT JOIN cover_link_node
             ON node.id = cover_link_node.node_id
             AND cover_link_node.deleted = false
        WHERE node.deleted = false
        AND node.type = "TYPE"
        ORDER BY node.name

        // marche pas:
        SELECT node.id,
            node.name,
            node.description,
            node.parent_id,
            `extract.covers`
        FROM node
        LEFT JOIN (SELECT tmp.node_id,
                          GROUP_CONCAT(`tmp.data_id` SEPARATOR '-') as `covers`
                     FROM cover_link_node tmp
                     WHERE tmp.deleted = false
                 GROUP BY tmp.node_id) extract
             ON node.id = extract.node_id
        WHERE node.deleted = false
        AND node.type = "TYPE"
        ORDER BY node.name

        // et enfin une version qui fonctionne ...
        SELECT node.id,
            node.name,
            node.description,
            node.parent_id,
            (SELECT GROUP_CONCAT(tmp.data_id)
                FROM cover_link_node tmp
                WHERE tmp.deleted = false
                      AND node.id = tmp.node_id
                GROUP BY tmp.node_id) AS covers
        FROM node
        WHERE node.deleted = false
        AND node.type = "TYPE"
        ORDER BY node.name

     */
    public static List<NodeSmall> get(String typeInNode) {
        System.out.println(typeInNode + " get");
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        List<NodeSmall> out = new ArrayList<>();
        String query = "SELECT node.id," +
                "              node.name," +
                "              node.description," +
                "              node.parent_id," +
                "              (SELECT GROUP_CONCAT(tmp.data_id SEPARATOR '-')" +
                "                      FROM cover_link_node tmp" +
                "                      WHERE tmp.deleted = false" +
                "                            AND node.id = tmp.node_id" +
                "                      GROUP BY tmp.node_id) AS covers" +
                " FROM node" +
                " WHERE  node.deleted = false " +
                "        AND node.type = ?" +
                " ORDER BY node.name";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setString(iii++, typeInNode);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                out.add(new NodeSmall(rs));
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        entry = null;
        System.out.println("retrieve " + out.size() + "  " + typeInNode);
        return out;
    }

    public static NodeSmall getWithId(String typeInNode, long id) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT node.id," +
                "              node.name," +
                "              node.description," +
                "              node.parent_id," +
                "              (SELECT GROUP_CONCAT(tmp.data_id SEPARATOR '-')" +
                "                      FROM cover_link_node tmp" +
                "                      WHERE tmp.deleted = false" +
                "                            AND node.id = tmp.node_id" +
                "                      GROUP BY tmp.node_id) AS covers" +
                " FROM node" +
                " WHERE  node.deleted = false " +
                "        AND node.type = ?" +
                "        AND node.id = ?" +
                " ORDER BY node.name";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setString(iii++, typeInNode);
            ps.setLong(iii++, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                NodeSmall out = new NodeSmall(rs);
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

    public static List<NodeSmall> getWithName(String typeInNode, String name) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        List<NodeSmall> out = new ArrayList<>();
        String query = "SELECT node.id," +
                "              node.name," +
                "              node.description," +
                "              node.parent_id," +
                "              (SELECT GROUP_CONCAT(tmp.data_id SEPARATOR '-')" +
                "                      FROM cover_link_node tmp" +
                "                      WHERE tmp.deleted = false" +
                "                            AND node.id = tmp.node_id" +
                "                      GROUP BY tmp.node_id) AS covers" +
                " FROM node" +
                " WHERE  node.deleted = false " +
                "        AND node.type = ?" +
                "        AND node.name = ?" +
                " ORDER BY node.name";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setString(iii++, typeInNode);
            ps.setString(iii++, name);
            ResultSet rs = ps.executeQuery();
            while (rs.next()) {
                out.add(new NodeSmall(rs));
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        entry = null;
        return out;
    }

    public static NodeSmall getWithNameAndParent(String typeInNode, String name, long parentId) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT node.id," +
                "              node.name," +
                "              node.description," +
                "              node.parent_id," +
                "              (SELECT GROUP_CONCAT(tmp.data_id SEPARATOR '-')" +
                "                      FROM cover_link_node tmp" +
                "                      WHERE tmp.deleted = false" +
                "                            AND node.id = tmp.node_id" +
                "                      GROUP BY tmp.node_id) AS covers" +
                " FROM node" +
                " WHERE  node.deleted = false " +
                "        AND node.type = ?" +
                "        AND node.name = ?" +
                "        AND node.parent_id = ?" +
                " ORDER BY node.name";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setString(iii++, typeInNode);
            ps.setString(iii++, name);
            ps.setLong(iii++, parentId);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                NodeSmall out = new NodeSmall(rs);
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

    public static NodeSmall createNode(String typeInNode, String name, String descrition, Long parentId) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        long uniqueSQLID = -1;
        // real add in the BDD:
        try {
            // prepare the request:
            String query = "INSERT INTO node (`type`, `name`, `description`, `parent_id`) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = entry.connection.prepareStatement(query,
                    Statement.RETURN_GENERATED_KEYS);
            int iii = 1;
            ps.setString(iii++, typeInNode);
            ps.setString(iii++, name);
            if (descrition == null) {
                ps.setNull(iii++, Types.VARCHAR);
            } else {
                ps.setString(iii++, descrition);
            }
            if (parentId == null) {
                ps.setNull(iii++, Types.BIGINT);
            } else {
                ps.setLong(iii++, parentId);
            }
            // execute the request
            int affectedRows = ps.executeUpdate();
            if (affectedRows == 0) {
                throw new SQLException("Creating node failed, no rows affected.");
            }
            // retreive uid inserted
            try (ResultSet generatedKeys = ps.getGeneratedKeys()) {
                if (generatedKeys.next()) {
                    uniqueSQLID = generatedKeys.getLong(1);
                } else {
                    throw new SQLException("Creating node failed, no ID obtained (1).");
                }
            } catch (Exception ex) {
                System.out.println("Can not get the UID key inserted ... ");
                ex.printStackTrace();
                throw new SQLException("Creating node failed, no ID obtained (2).");
            }
            ps.execute();
        } catch (SQLException ex) {
            ex.printStackTrace();
        }
        return getWithId(typeInNode, uniqueSQLID);

    }

    public static NodeSmall getOrCreate(String typeInNode, String name, Long parentId) {
        if (name == null || name.isEmpty()) {
            return null;
        }
        NodeSmall node = getWithNameAndParent(typeInNode, name, parentId);
        if (node != null) {
            return node;
        }
        return createNode(typeInNode, name, null, parentId);
    }

    static private String multipartCorrection(String data) {
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

    static public Response uploadCover(String typeInNode,
                                Long nodeId,
                                String file_name,
                                InputStream fileInputStream,
                                FormDataContentDisposition fileMetaData
    ) {
        try {
            // correct input string stream :
            file_name = multipartCorrection(file_name);

            //public NodeSmall uploadFile(final FormDataMultiPart form) {
            System.out.println("Upload media file: " + fileMetaData);
            System.out.println("    - id: " + nodeId);
            System.out.println("    - file_name: " + file_name);
            System.out.println("    - fileInputStream: " + fileInputStream);
            System.out.println("    - fileMetaData: " + fileMetaData);
            System.out.flush();
            NodeSmall media = getWithId(typeInNode, nodeId);
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
                String query = "INSERT INTO cover_link_node (create_date, modify_date, node_id, data_id)" +
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
                entry.disconnect();
                return Response.serverError().build();
            }
            // if we do not une the file .. remove it ... otherwise this is meamory leak...
            DataResource.removeTemporaryFile(tmpUID);
            System.out.println("uploaded .... compleate: " + uniqueSQLID);
            return Response.ok(getWithId(typeInNode, nodeId)).build();
        } catch (Exception ex) {
            System.out.println("Cat ann unexpected error ... ");
            ex.printStackTrace();
        }
        return Response.serverError().build();
    }
    static public Response removeCover(String typeInNode, Long nodeId, Long coverId) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `cover_link_node` SET `modify_date`=now(3), `deleted`=true WHERE `node_id` = ? AND `data_id` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setLong(iii++, nodeId);
            ps.setLong(iii++, coverId);
            ps.executeUpdate();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
            entry.disconnect();
            return Response.serverError().build();
        }
        entry.disconnect();
        return Response.ok(getWithId(typeInNode, nodeId)).build();
    }

    static public Response put(String typeInNode, Long id, String jsonRequest) {
        ObjectMapper mapper = new ObjectMapper();
        try {
            JsonNode root = mapper.readTree(jsonRequest);
            String query = "UPDATE `node` SET `modify_date`=now(3)";
            if (!root.path("name").isMissingNode()) {
                query += ", `name` = ? ";
            }
            if (!root.path("description").isMissingNode()) {
                query += ", `description` = ? ";
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
        return Response.ok(getWithId(typeInNode, id)).build();
    }


    static public Response delete(String typeInNode, Long nodeId) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `node` SET `modify_date`=now(3), `deleted`=true WHERE `id` = ? AND `type` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            int iii = 1;
            ps.setLong(iii++, nodeId);
            ps.setString(iii++, typeInNode);
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
