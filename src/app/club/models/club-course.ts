// TODO: upadte interface
export interface ClubCourse {
  id?: string;
  name?: string;
  levels?: number[];
  description?: string;
  date?: Date;
  duration?: number;
  attenders: number;
  max_attenders: number;
  photo: string;
}
