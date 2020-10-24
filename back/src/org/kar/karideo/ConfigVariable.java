package org.kar.karideo;

public class ConfigVariable {

    public static String getTmpDataFolder() {
        String out = System.getProperty("org.kar.karideo.dataTmpFolder");
        if (out == null) {
            return "/application/data/tmp";
        }
        return out;
    }

    public static String getMediaDataFolder() {
        String out = System.getProperty("org.kar.karideo.dataFolder");
        if (out == null) {
            return "/application/data/media";
        }
        return out;
    }

    public static String getRestOAuthServer() {
        String out = System.getProperty("org.kar.karideo.rest.oauth");
        if (out == null) {
            return "http://localhost:17080/oauth/api/";
        }
        return out;
    }

    public static String getDBHost() {
        String out = System.getProperty("org.kar.karideo.db.host");
        if (out == null) {
            return "localhost";
        }
        return out;
    }

    public static String getDBPort() {
        String out = System.getProperty("org.kar.karideo.db.port");
        if (out == null) {
            return "3306";
        }
        return out;
    }

    public static String getDBLogin() {
        String out = System.getProperty("org.kar.karideo.db.login");
        if (out == null) {
            return "root";
        }
        return out;
    }

    public static String getDBPassword() {
        String out = System.getProperty("org.kar.karideo.db.password");
        if (out == null) {
            return "klkhj456gkgtkhjgvkujfhjgkjhgsdfhb3467465fgdhdesfgh";
        }
        return out;
    }

    public static String getDBName() {
        String out = System.getProperty("org.kar.karideo.db.name");
        if (out == null) {
            return "karideo";
        }
        return out;
    }

    public static String getlocalAddress() {
        String out = System.getProperty("org.kar.karideo.address");
        if (out == null) {
            return "http://localhost:18080/karideo/api/";
        }
        return out;
    }
}
