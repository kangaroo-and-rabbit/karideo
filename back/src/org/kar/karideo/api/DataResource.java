package org.kar.karideo.api;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.kar.karideo.ConfigVariable;
import org.kar.karideo.WebLauncher;
import org.kar.karideo.db.DBEntry;
import org.kar.karideo.model.Data;
import org.kar.karideo.model.DataSmall;

import javax.annotation.security.PermitAll;
import javax.imageio.ImageIO;
import javax.ws.rs.*;
import javax.ws.rs.core.HttpHeaders;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import javax.ws.rs.core.StreamingOutput;
import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.Date;


// https://stackoverflow.com/questions/35367113/jersey-webservice-scalable-approach-to-download-file-and-reply-to-client
// https://gist.github.com/aitoroses/4f7a2b197b732a6a691d

@Path("/data")
@PermitAll
@Produces({MediaType.APPLICATION_JSON})
public class DataResource {
    private final static int CHUNK_SIZE = 1024 * 1024; // 1MB chunks
    private final static int CHUNK_SIZE_IN = 50 * 1024 * 1024; // 1MB chunks
    /**
     * Upload some datas
     */
    private static long tmpFolderId = 1;

    private static void createFolder(String path) throws IOException {
        if (!Files.exists(java.nio.file.Path.of(path))) {
            //Log.print("Create folder: " + path);
            Files.createDirectories(java.nio.file.Path.of(path));
        }
    }

    public static long getTmpDataId() {
        return tmpFolderId++;
    }

    public static String getTmpFileInData(long tmpFolderId) {
        String filePath = ConfigVariable.getTmpDataFolder() + File.separator + tmpFolderId;
        try {
            createFolder(ConfigVariable.getTmpDataFolder() + File.separator);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return filePath;
    }

    public static String getFileData(long tmpFolderId) {
        String filePath = ConfigVariable.getMediaDataFolder() + File.separator + tmpFolderId + File.separator + "data";
        try {
            createFolder(ConfigVariable.getMediaDataFolder() + File.separator + tmpFolderId + File.separator);
        } catch (IOException e) {
            e.printStackTrace();
        }
        return filePath;
    }

    public static Data getWithSha512(String sha512) {
        System.out.println("find sha512 = " + sha512);
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT `id`, `deleted`, `sha512`, `mime_type`, `size` FROM `data` WHERE `sha512` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setString(1, sha512);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Data out = new Data(rs);
                entry.disconnect();
                return out;
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        return null;

    }

    public static Data getWithId(long id) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT `id`, `deleted`, `sha512`, `mime_type`, `size` FROM `data` WHERE `deleted` = false AND `id` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                Data out = new Data(rs);
                entry.disconnect();
                return out;
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        return null;

    }

    public static Data createNewData(long tmpUID, String originalFileName, String sha512) throws IOException, SQLException {
        // determine mime type:
        String mimeType = "";
        String extension = originalFileName.substring(originalFileName.lastIndexOf('.') + 1);
        switch (extension.toLowerCase()) {
            case "jpg":
            case "jpeg":
                mimeType = "image/jpeg";
                break;
            case "png":
                mimeType = "image/png";
                break;
            case "webp":
                mimeType = "image/webp";
                break;
            case "mka":
                mimeType = "audio/x-matroska";
                break;
            case "mkv":
                mimeType = "video/x-matroska";
                break;
            case "webm":
                mimeType = "video/webm";
                break;
            default:
                throw new IOException("Can not find the mime type of data input: '" + extension + "'");
        }
        String tmpPath = getTmpFileInData(tmpUID);
        long fileSize = Files.size(Paths.get(tmpPath));
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        long uniqueSQLID = -1;
        try {
            // prepare the request:
            String query = "INSERT INTO `data` (`sha512`, `mime_type`, `size`, `original_name`) VALUES (?, ?, ?, ?)";
            PreparedStatement ps = entry.connection.prepareStatement(query,
                    Statement.RETURN_GENERATED_KEYS);
            int iii = 1;
            ps.setString(iii++, sha512);
            ps.setString(iii++, mimeType);
            ps.setLong(iii++, fileSize);
            ps.setString(iii++, originalFileName);
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
        entry.disconnect();
        System.out.println("Add Data raw done. uid data=" + uniqueSQLID);
        Data out = getWithId(uniqueSQLID);

        String mediaPath = getFileData(out.id);
        System.out.println("src = " + tmpPath);
        System.out.println("dst = " + mediaPath);
        Files.move(Paths.get(tmpPath), Paths.get(mediaPath), StandardCopyOption.ATOMIC_MOVE);

        System.out.println("Move done");
        // all is done the file is corectly installed...

        return out;
    }

    public static void undelete(Long id) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "UPDATE `data` SET `deleted` = false WHERE `id` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setLong(1, id);
            ps.execute();
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
    }

    static String saveTemporaryFile(InputStream uploadedInputStream, long idData) {
        return saveFile(uploadedInputStream, DataResource.getTmpFileInData(idData));
    }

    static void removeTemporaryFile(long idData) {
        String filepath = DataResource.getTmpFileInData(idData);
        if (Files.exists(Paths.get(filepath))) {
            try {
                Files.delete(Paths.get(filepath));
            } catch (IOException e) {
                System.out.println("can not delete temporary file : " + Paths.get(filepath));
                e.printStackTrace();
            }
        }
    }

    // save uploaded file to a defined location on the server
    static String saveFile(InputStream uploadedInputStream, String serverLocation) {
        String out = "";
        try {
            OutputStream outpuStream = new FileOutputStream(new File(
                    serverLocation));
            int read = 0;
            byte[] bytes = new byte[CHUNK_SIZE_IN];
            MessageDigest md = MessageDigest.getInstance("SHA-512");

            outpuStream = new FileOutputStream(new File(serverLocation));
            while ((read = uploadedInputStream.read(bytes)) != -1) {
                //System.out.println("write " + read);
                md.update(bytes, 0, read);
                outpuStream.write(bytes, 0, read);
            }
            System.out.println("Flush input stream ... " + serverLocation);
            System.out.flush();
            outpuStream.flush();
            outpuStream.close();
            // create the end of sha512
            byte[] sha512Digest = md.digest();
            // convert in hexadecimal
            out = bytesToHex(sha512Digest);
            uploadedInputStream.close();
        } catch (IOException ex) {
            System.out.println("Can not write in temporary file ... ");
            ex.printStackTrace();
        } catch (NoSuchAlgorithmException ex) {
            System.out.println("Can not find sha512 algorithms");
            ex.printStackTrace();
        }
        return out;
    }

    // curl http://localhost:9993/api/users/3
    //@Secured
    /*
    @GET
    @Path("{id}")
    //@RolesAllowed("GUEST")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response retriveData(@HeaderParam("Range") String range, @PathParam("id") Long id) throws Exception {
        return retriveDataFull(range, id, "no-name");
    }
    */

    public static String bytesToHex(byte[] bytes) {
        StringBuilder sb = new StringBuilder();
        for (byte b : bytes) {
            sb.append(String.format("%02x", b));
        }
        return sb.toString();
    }


/*
    @POST
	@Path("/upload")
	@Consumes(MediaType.MULTIPART_FORM_DATA)
	public Response uploadFile(FormDataMultiPart form) {

		 FormDataBodyPart filePart = form.getField("file");

		 ContentDisposition headerOfFilePart =  filePart.getContentDisposition();

		 InputStream fileInputStream = filePart.getValueAs(InputStream.class);

		 String filePath = ConfigVariable.getTmpDataFolder() + File.separator + tmpFolderId++;
		 //headerOfFilePart.getFileName();

		// save the file to the server
		saveFile(fileInputStream, filePath);

		String output = "File saved to server location using FormDataMultiPart : " + filePath;

		return Response.status(200).entity(output).build();

	}
*/

    public DataSmall getSmall(Long id) {
        DBEntry entry = new DBEntry(WebLauncher.dbConfig);
        String query = "SELECT `id`, `sha512`, `mime_type`, `size` FROM `data` WHERE `deleted` = false AND `id` = ?";
        try {
            PreparedStatement ps = entry.connection.prepareStatement(query);
            ps.setLong(1, id);
            ResultSet rs = ps.executeQuery();
            if (rs.next()) {
                DataSmall out = new DataSmall(rs);
                entry.disconnect();
                return out;
            }
        } catch (SQLException throwables) {
            throwables.printStackTrace();
        }
        entry.disconnect();
        return null;
    }

    @POST
    @Path("/upload/")
    @Consumes({MediaType.MULTIPART_FORM_DATA})
    public Response uploadFile(@FormDataParam("file") InputStream fileInputStream, @FormDataParam("file") FormDataContentDisposition fileMetaData) {
        //public NodeSmall uploadFile(final FormDataMultiPart form) {
        System.out.println("Upload file: ");
        String filePath = ConfigVariable.getTmpDataFolder() + File.separator + tmpFolderId++;
        try {
            createFolder(ConfigVariable.getTmpDataFolder() + File.separator);
        } catch (IOException e) {
            e.printStackTrace();
        }
        saveFile(fileInputStream, filePath);
        return Response.ok("Data uploaded successfully !!").build();
        //return null;
    }

    //@Secured
    @GET
    @Path("{id}")
    //@RolesAllowed("GUEST")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response retriveDataId(/*@Context SecurityContext sc,*/ @HeaderParam("Range") String range, @PathParam("id") Long id) throws Exception {
        /*
        GenericContext gc = (GenericContext) sc.getUserPrincipal();
        System.out.println("===================================================");
        System.out.println("== USER get data ? " + gc.user);
        System.out.println("===================================================");
        */
        DataSmall value = getSmall(id);
        if (value == null) {
            Response.status(404).
                    entity("media NOT FOUND: " + id).
                    type("text/plain").
                    build();
        }
        return buildStream(ConfigVariable.getMediaDataFolder() + File.separator + id + File.separator + "data", range, value.mimeType);
    }
    //@Secured
    @GET
    @Path("thumbnail/{id}")
    //@RolesAllowed("GUEST")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response retriveDataThumbnailId(/*@Context SecurityContext sc,*/ @HeaderParam("Range") String range, @PathParam("id") Long id) throws Exception {
        /*
        GenericContext gc = (GenericContext) sc.getUserPrincipal();
        System.out.println("===================================================");
        System.out.println("== USER get data ? " + gc.user);
        System.out.println("===================================================");
        */
        DataSmall value = getSmall(id);
        if (value == null) {
            Response.status(404).
                    entity("media NOT FOUND: " + id).
                    type("text/plain").
                    build();
        }
        String filePathName = ConfigVariable.getMediaDataFolder() + File.separator + id + File.separator + "data";
        if (    value.mimeType.contentEquals("image/jpeg")
                || value.mimeType.contentEquals("image/png")
        //        || value.mimeType.contentEquals("image/webp")
        ) {
            // reads input image
            File inputFile = new File(filePathName);
            BufferedImage inputImage = ImageIO.read(inputFile);
            int scaledWidth = 250;
            int scaledHeight = (int)((float)inputImage.getHeight() / (float)inputImage.getWidth() * (float) scaledWidth);
            // creates output image
            BufferedImage outputImage = new BufferedImage(scaledWidth,
                                        scaledHeight, inputImage.getType());

            // scales the input image to the output image
            Graphics2D g2d = outputImage.createGraphics();
            g2d.drawImage(inputImage, 0, 0, scaledWidth, scaledHeight, null);
            g2d.dispose();
            // create the oputput stream:
            ByteArrayOutputStream baos = new ByteArrayOutputStream();
            ImageIO.write(outputImage, "JPG", baos);
            byte[] imageData = baos.toByteArray();
            Response.ok(new ByteArrayInputStream(imageData)).build();
            Response.ResponseBuilder out = Response.ok(imageData)
                    .header(HttpHeaders.CONTENT_LENGTH, imageData.length);
            out.type("image/jpeg");
            return out.build();
        }
        return buildStream(filePathName, range, value.mimeType);
    }
    //@Secured
    @GET
    @Path("{id}/{name}")
    //@RolesAllowed("GUEST")
    @Produces(MediaType.APPLICATION_OCTET_STREAM)
    public Response retriveDataFull(/*@Context SecurityContext sc,*/ @HeaderParam("Range") String range, @PathParam("id") Long id, @PathParam("name") String name) throws Exception {
        /*
        GenericContext gc = (GenericContext) sc.getUserPrincipal();
        System.out.println("===================================================");
        System.out.println("== USER get data ? " + gc.user);
        System.out.println("===================================================");
        */
        DataSmall value = getSmall(id);
        if (value == null) {
            Response.status(404).
                    entity("media NOT FOUND: " + id).
                    type("text/plain").
                    build();
        }
        return buildStream(ConfigVariable.getMediaDataFolder() + File.separator + id + File.separator + "data", range, value.mimeType);
    }

    /**
     * Adapted from http://stackoverflow.com/questions/12768812/video-streaming-to-ipad-does-not-work-with-tapestry5/12829541#12829541
     *
     * @param range range header
     * @return Streaming output
     * @throws Exception IOException if an error occurs in streaming.
     */
    private Response buildStream(final String filename, final String range, String mimeType) throws Exception {
        File file = new File(filename);
        //System.out.println("request range : " + range);
        // range not requested : Firefox does not send range headers
        if (range == null) {
            final StreamingOutput output = new StreamingOutput() {
                @Override
                public void write(OutputStream out) {
                    try (FileInputStream in = new FileInputStream(file)) {
                        byte[] buf = new byte[1024 * 1024];
                        int len;
                        while ((len = in.read(buf)) != -1) {
                            try {
                                out.write(buf, 0, len);
                                out.flush();
                                //System.out.println("---- wrote " + len + " bytes file ----");
                            } catch (IOException ex) {
                                System.out.println("remote close connection");
                                break;
                            }
                        }
                    } catch (IOException ex) {
                        throw new InternalServerErrorException(ex);
                    }
                }
            };
            Response.ResponseBuilder out = Response.ok(output)
                    .header(HttpHeaders.CONTENT_LENGTH, file.length());
            if (mimeType != null) {
                out.type(mimeType);
            }
            return out.build();

        }

        String[] ranges = range.split("=")[1].split("-");
        final long from = Long.parseLong(ranges[0]);

        //System.out.println("request range : " + ranges.length);
        //Chunk media if the range upper bound is unspecified. Chrome, Opera sends "bytes=0-"
        long to = CHUNK_SIZE + from;
        if (ranges.length == 1) {
            to = file.length() - 1;
        } else {
            if (to >= file.length()) {
                to = (long) (file.length() - 1);
            }
        }
        final String responseRange = String.format("bytes %d-%d/%d", from, to, file.length());
        //System.out.println("responseRange : " + responseRange);
        final RandomAccessFile raf = new RandomAccessFile(file, "r");
        raf.seek(from);

        final long len = to - from + 1;
        final MediaStreamer streamer = new MediaStreamer(len, raf);
        Response.ResponseBuilder out = Response.ok(streamer)
                .status(Response.Status.PARTIAL_CONTENT)
                .header("Accept-Ranges", "bytes")
                .header("Content-Range", responseRange)
                .header(HttpHeaders.CONTENT_LENGTH, streamer.getLenth())
                .header(HttpHeaders.LAST_MODIFIED, new Date(file.lastModified()));
        if (mimeType != null) {
            out.type(mimeType);
        }
        return out.build();
    }

}
