import { Record } from "./record";

type Student = {
  name: string;
  email: string;
  password: string;
  id: string;
  records: Record[];
};

export interface IStudent extends Omit<Student, "email" | "password"> {}

export type StudentAuth = Pick<Student, "email" | "password">;
