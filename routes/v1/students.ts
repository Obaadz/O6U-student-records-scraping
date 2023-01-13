import express from "express";
import { O6U } from "../../controllers/browser";
import { Student } from "../../controllers/student";
import { StudentAuth } from "../../types/student";

const studentsRoutes = express.Router();

studentsRoutes.get("/students/records", async (request, response) => {
  const studentAuth: Readonly<StudentAuth> = request.body;
  console.log("STUDENT DATA: ", studentAuth);

  try {
    const student = await Student.initialize(studentAuth);

    console.log("STUDENT DATA: ");
    console.log(student);

    response.end("OK");
  } catch (err) {
    console.log("ERROR OCCURED...");
    console.log(err);

    response.end("ERROR OCCURED");
  } finally {
    const openedPagesCount = await O6U.getBrowserPagesCount();

    if (openedPagesCount === 0) await O6U.closeBrowser();
  }
});

export { studentsRoutes };
