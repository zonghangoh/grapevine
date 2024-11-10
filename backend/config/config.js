const config = {
  "development": {
    "dialect": "postgres",
    "url": "postgresql://neondb_owner:L4GRMXTiwJm3@ep-morning-firefly-a1z392xb.ap-southeast-1.aws.neon.tech/neondb",
    "dialectOptions": { "ssl": { "require": true } },
  },
  "production": {
    "dialect": "postgres", 
    "url": "postgresql://neondb_owner:L4GRMXTiwJm3@ep-morning-firefly-a1z392xb.ap-southeast-1.aws.neon.tech/neondb",
    "dialectOptions": { "ssl": { "require": true } }
  }
};

module.exports = config;