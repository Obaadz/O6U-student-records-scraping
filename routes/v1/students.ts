import express from "express";
import { O6U } from "../../controllers/browser";
import { StudentAuth } from "../../types/student";

const studentsRoutes = express.Router();

studentsRoutes.get("/students/records", async (request, response) => {
  const studentAuth: Readonly<StudentAuth> = request.body;
  console.log("STUDENT DATA: ", studentAuth);

  try {
    const page = await O6U.initialize();

    await page.waitForNetworkIdle({ idleTime: 3000 });

    await O6U.login(page, studentAuth);

    await page.waitForNetworkIdle({ idleTime: 3000 });
    
    const body = await page.$(".Stdname");
    const studentName = await body?.evaluate((x) => x.textContent);

    console.log(studentName);
    await O6U.closeBrowser();
  } catch (err) {
    console.log("ERRORR OCCURED...");
    console.log(err);
  }

  response.end("TEST");
});

export { studentsRoutes };
