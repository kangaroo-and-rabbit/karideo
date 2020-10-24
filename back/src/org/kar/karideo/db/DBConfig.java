package org.kar.karideo.db;

public class DBConfig {
    private final String hostname;
    private final int port;
    private final String login;
    private final String password;
    private final String dbName;

    public DBConfig(String hostname, Integer port, String login, String password, String dbName) {
        if (hostname == null) {
            this.hostname = "localhost";
        } else {
            this.hostname = hostname;
        }
        if (port == null) {
            this.port = 3306;
        } else {
            this.port = port;
        }
        this.login = login;
        this.password = password;
        this.dbName = dbName;
    }

    @Override
    public String toString() {
        return "DBConfig{" +
                "hostname='" + hostname + '\'' +
                ", port=" + port +
                ", login='" + login + '\'' +
                ", password='" + password + '\'' +
                ", dbName='" + dbName + '\'' +
                '}';
    }

    public String getHostname() {
        return hostname;
    }

    public int getPort() {
        return port;
    }

    public String getLogin() {
        return login;
    }

    public String getPassword() {
        return password;
    }

    public String getDbName() {
        return dbName;
    }

    public String getUrl() {
        return "jdbc:mysql://" + this.hostname + ":" + this.port + "/" + this.dbName + "?useSSL=false&serverTimezone=UTC";
    }
}
