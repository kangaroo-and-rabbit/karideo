/** Basic module interface.
 *
 * @author Edouard DUPIN */

open module io.scenarium.store {
	exports io.scenarium.oauth;
	requires java.util;
	requires javax.ws.rs.api;
	requires java.xml.bind;
	requires jackson.annotations;
	requires jersey.server;
}
