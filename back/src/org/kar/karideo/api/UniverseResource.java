package org.kar.karideo.api;

import org.glassfish.jersey.media.multipart.FormDataContentDisposition;
import org.glassfish.jersey.media.multipart.FormDataParam;
import org.kar.karideo.model.NodeSmall;

import javax.annotation.security.PermitAll;
import javax.ws.rs.*;
import javax.ws.rs.core.MediaType;
import javax.ws.rs.core.Response;
import java.io.InputStream;
import java.util.List;

@Path("/universe")
@PermitAll
@Produces({MediaType.APPLICATION_JSON})
public class UniverseResource {
    private static final String typeInNode = "UNIVERSE";

    @GET
    @Path("{id}")
    public static NodeSmall getWithId(@PathParam("id") Long id) {
        return NodeInterface.getWithId(typeInNode, id);
    }

    public static List<NodeSmall> getWithName(String name) {
        return NodeInterface.getWithName(typeInNode, name);
    }

    public static NodeSmall getOrCreate(String universe) {
        return NodeInterface.getOrCreate(typeInNode, universe, null);
    }

    @GET
    public List<NodeSmall> get() {
        return NodeInterface.get(typeInNode);
    }

    @PUT
    @Path("{id}")
    @Consumes(MediaType.APPLICATION_JSON)
    public Response put(@PathParam("id") Long id, String jsonRequest) {
        return NodeInterface.put(typeInNode, id, jsonRequest);
    }

    @DELETE
    @Path("{id}")
    public Response delete(@PathParam("id") Long id) {
        return NodeInterface.delete(typeInNode, id);
    }

    @POST
    @Path("{id}/add_cover")
    @Consumes({MediaType.MULTIPART_FORM_DATA})
    public Response uploadCover(@PathParam("id") Long id,
                                @FormDataParam("file_name") String file_name,
                                @FormDataParam("file") InputStream fileInputStream,
                                @FormDataParam("file") FormDataContentDisposition fileMetaData
    ) {
        return NodeInterface.uploadCover(typeInNode, id, file_name, fileInputStream, fileMetaData);
    }
    @GET
    @Path("{id}/rm_cover/{cover_id}")
    public Response removeCover(@PathParam("id") Long nodeId, @PathParam("cover_id") Long coverId) {
        return NodeInterface.removeCover(typeInNode, nodeId, coverId);
    }
}
