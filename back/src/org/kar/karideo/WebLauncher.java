package org.kar.karideo;

import org.glassfish.grizzly.http.server.HttpServer;
import org.glassfish.jersey.grizzly2.httpserver.GrizzlyHttpServerFactory;
import org.glassfish.jersey.media.multipart.MultiPartFeature;
import org.glassfish.jersey.server.ResourceConfig;
import org.kar.karideo.api.*;
import org.kar.karideo.db.DBConfig;
import org.glassfish.jersey.jackson.JacksonFeature;

import javax.ws.rs.core.UriBuilder;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URI;
import java.util.Properties;


public class WebLauncher {
    public static DBConfig dbConfig;
    private WebLauncher() {
    }

    private static URI getBaseURI() {
        return UriBuilder.fromUri(ConfigVariable.getlocalAddress()).build();
    }

    public static String getOAuthURI() {
        return ConfigVariable.getRestOAuthServer();
    }

    public static void main(String[] args) {
        try {
            FileInputStream propFile = new FileInputStream( "/application/properties.txt");
            Properties p = new Properties(System.getProperties());
            p.load(propFile);
			for (String name : p.stringPropertyNames()) {
				String value = p.getProperty(name);
				// inject property if not define in cmdline:
				if (System.getProperty(name) == null) {
					System.setProperty(name, value);
				}
			}
        } catch (FileNotFoundException e) {
            System.out.println("File of environment variable not found: 'properties.txt'");
        } catch (IOException e) {
            e.printStackTrace();
        }

        ResourceConfig rc = new ResourceConfig();
        // add multipart models ..
        //rc.register(new MultiPartFeature());
        //rc.register(new InjectionBinder());
        rc.register(new MultiPartFeature());
        //rc.register(new MyFileUploader());
        // global authentication system
        rc.register(new OptionFilter());
        // remove cors ==> all time called by an other system...
        rc.register(new CORSFilter());
        // global authentication system
        rc.register(new AuthenticationFilter());
        // add default resource:
        rc.registerClasses(UserResource.class);
        rc.registerClasses(SeriesResource.class);
        rc.registerClasses(DataResource.class);
        rc.registerClasses(SeasonResource.class);
        rc.registerClasses(TypeResource.class);
        rc.registerClasses(UniverseResource.class);
        rc.registerClasses(VideoResource.class);
        // add jackson to be discovenr when we are ins standalone server
        rc.register(JacksonFeature.class);
        // enable this to show low level request
        //rc.property(LoggingFeature.LOGGING_FEATURE_LOGGER_LEVEL_SERVER, Level.WARNING.getName());

		System.out.println("Connect on the BDD:");
		System.out.println("    getDBHost: '" + ConfigVariable.getDBHost() + "'");
		System.out.println("    getDBPort: '" + ConfigVariable.getDBPort() + "'");
		System.out.println("    getDBLogin: '" + ConfigVariable.getDBLogin() + "'");
		System.out.println("    getDBPassword: '" + ConfigVariable.getDBPassword() + "'");
		System.out.println("    getDBName: '" + ConfigVariable.getDBName() + "'");
        dbConfig = new DBConfig(ConfigVariable.getDBHost(),
				Integer.parseInt(ConfigVariable.getDBPort()),
				ConfigVariable.getDBLogin(),
                ConfigVariable.getDBPassword(),
                ConfigVariable.getDBName());
		System.out.println(" ==> " + dbConfig);
		System.out.println("OAuth service " + ConfigVariable.getRestOAuthServer());
		HttpServer server = GrizzlyHttpServerFactory.createHttpServer(getBaseURI(), rc);
		Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
			@Override
			public void run() {
				System.out.println("Stopping server..");
				server.shutdownNow();
			}
		}, "shutdownHook"));

		// run
		try {
			server.start();
			System.out.println("Jersey app started at " + getBaseURI());
			System.out.println("Press CTRL^C to exit..");
			Thread.currentThread().join();
		} catch (Exception e) {
			System.out.println("There was an error while starting Grizzly HTTP server.");
			e.printStackTrace();
		}
    }
}
