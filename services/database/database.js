import {
  PG_DB,
  PG_USER,
  PG_PASS,
  PG_HOST,
  PG_PORT,
} from "../../config/variables.js";
import { Sequelize } from "sequelize";
import { createAdminUser } from "../../controllers/admin.controller.js";


const sequelize = new Sequelize(PG_DB, PG_USER, PG_PASS, {
  host: PG_HOST,
  port: PG_PORT || 5432,
  dialect: "postgres",
  logging: false,
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log("✅ PostgreSQL connected successfully");

    const { initModels } = await import("../../models/index.js");
    await initModels(sequelize);
    await createAdminUser()
    await sequelize.sync({ alter: true });
    console.log("✅ All models synchronized successfully");
  } catch (err) {
    console.error("❌ Error connecting to PostgreSQL:", err);
    process.exit(1);
  }
};

export const closeDB = async (signal) => {
  try {
    await sequelize.close();
    console.log(`PostgreSQL connection closed due to ${signal}`);
    process.exit(0);
  } catch (err) {
    console.error("Error closing PostgreSQL connection:", err);
    process.exit(1);
  }
};


export default sequelize;