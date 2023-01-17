import { Course } from "./course";

export type Record = {
  name: string;
  hours: number;
  GPA: number;
  courses: Course[];
};
