module.exports = {
    user          : "admin",
  
    // Get the password from the environment variable
    // NODE_ORACLEDB_PASSWORD.  The password could also be a hard coded
    // string (not recommended), or it could be prompted for.
    // Alternatively use External Authentication so that no password is
    // needed.
    password      : "infoplus",
  
    // For information on connection strings see:
    // https://oracle.github.io/node-oracledb/doc/api.html#connectionstrings
    // connectString : "localhost/infobox",
    connectString : "192.168.22.179/xe",
  
    // Setting externalAuth is optional.  It defaults to false.  See:
    // https://oracle.github.io/node-oracledb/doc/api.html#extauth
    // externalAuth  : process.env.NODE_ORACLEDB_EXTERNALAUTH ? true : false
  };