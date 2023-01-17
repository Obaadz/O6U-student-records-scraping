import { Record } from "../types/record";
import { IStudent, StudentAuth } from "../types/student";
import { O6U } from "./browser";

type StudentData = {
  name: string;
  id: string;
  records: Record[];
  nationality: string;
  CGPA: number;
  totalHours: number;
  level: string;
  section: string;
};

export class Student implements IStudent {
  readonly name: string;
  readonly id: string;
  readonly records: Record[];
  readonly nationality: string;
  readonly CGPA: number;
  readonly totalHours: number;
  readonly level: string;
  readonly section: string;

  static async initialize(studentAuth: StudentAuth) {
    const O6UPage = await O6U.initialize();

    await (await O6UPage.login(studentAuth)).goToRecordsPage();

    const student: StudentData = {
      name: await O6UPage.getStudentName(),
      id: await O6UPage.getStudentId(),
      records: [await O6UPage.getLastStudentRecord()],
      nationality: await O6UPage.getStudentNationality(),
      CGPA: await O6UPage.getStudentCGPA(),
      totalHours: await O6UPage.getStudentTotalHours(),
      level: await O6UPage.getStudentLevel(),
      section: await O6UPage.getStudentSection(),
    };

    await O6UPage.closePage();

    return new Student(student);
  }

  constructor(student: StudentData) {
    this.name = student.name;
    this.id = student.id;
    this.records = student.records;
    this.nationality = student.nationality;
    this.CGPA = student.CGPA;
    this.totalHours = student.totalHours;
    this.level = student.level;
    this.section = student.section;
  }
}
