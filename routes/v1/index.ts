import express from "express";
import { studentsRoutes } from "./students";

const v1Routes = express.Router();

v1Routes.use("/v1", studentsRoutes);

export default v1Routes;
