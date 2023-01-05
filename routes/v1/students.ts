import express from "express";
import { O6U } from "../../controllers/browser";
import { StudentAuth } from "../../types/student";

const studentsRoutes = express.Router();

studentsRoutes.get("/students/records", async (request, response) => {
  const studentAuth: Readonly<StudentAuth> = request.body;
  console.log("STUDENT DATA: ", studentAuth);
  const page = await O6U.initialize();

  await O6U.closeBrowser();

  response.end("TEST");
});

export { studentsRoutes };
