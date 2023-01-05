import { Record } from "./record";

export type Student = {
  email: string;
  password: string;
  id: string;
  records: Record[];
};

export type StudentAuth = Omit<Student, "id" | "records">;
