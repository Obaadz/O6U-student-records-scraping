import { Record } from "./record";

type Student = {
  name: string;
  email: string;
  password: string;
  id: string;
  records: Record[];
  nationality: string;
  CGPA: number;
  totalHours: number;
  level: string;
  section: string;
};

export interface IStudent extends Omit<Student, "email" | "password"> {}

export type StudentAuth = Pick<Student, "email" | "password">;
