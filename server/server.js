require("dotenv").config();
console.log("Starting server...");
console.log("Environment:", {
  PORT: process.env.PORT,
  DB_PATH: process.env.DB_PATH,
  NODE_ENV: process.env.NODE_ENV,
});

try {
  require("./dist/index.js");
  console.log("Server started successfully");
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
