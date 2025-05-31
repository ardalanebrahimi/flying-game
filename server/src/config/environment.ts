export const environment = {
  port: process.env.PORT || 3000,
  dbPath: process.env.DB_PATH || './db.sqlite',
  corsOrigin: process.env.CORS_ORIGIN || '*',
};
