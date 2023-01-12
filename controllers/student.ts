import { Record } from "../types/record";
import { IStudent, StudentAuth } from "../types/student";
import { O6U } from "./browser";

type StudentData = {
  name: string;
  id: string;
  records: Record[];
};

export class Student implements IStudent {
  readonly name: string;
  readonly id: string;
  readonly records: Record[];

  static async initialize(studentAuth: StudentAuth) {
    const O6UPage = await O6U.initialize();

    await (await O6UPage.login(studentAuth)).goToRecordsPage();

    const student = {
      name: await O6UPage.getStudentName(),
      id: "202011111",
      records: [],
    };

    await O6UPage.closePage();

    return new Student(student);
  }

  constructor(student: StudentData) {
    this.id = student.id;
    this.records = student.records;
    this.name = student.name;
  }
}
