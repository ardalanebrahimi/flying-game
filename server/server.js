try {
  require("dotenv").config();
  require("./dist/index.js");
} catch (error) {
  console.error("Error starting the application:", error);
  process.exit(1);
}
