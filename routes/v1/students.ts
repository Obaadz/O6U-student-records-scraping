import express from "express";
import { O6U } from "../../controllers/browser";
import { Student } from "../../controllers/student";
import { StudentAuth } from "../../types/student";

const studentsRoutes = express.Router();

studentsRoutes.get("/students", async (request, response) => {
  const studentAuth: Readonly<StudentAuth> = request.body;
  console.log("STUDENT DATA: ", studentAuth);

  try {
    const student = await Student.initialize(studentAuth);

    console.log("STUDENT DATA: ");
    console.log(student);

    response.send({ isSuccess: true, student });
  } catch (err: any) {
    console.log("ERROR OCCURED...");
    console.log(err);

    response.send({ isSuccess: false, message: err.message });
  } finally {
    const openedPagesCount = await O6U.getBrowserPagesCount();

    if (openedPagesCount === 0) await O6U.closeBrowser();
  }
});

export { studentsRoutes };
