export interface TimeBlock {
  openAt: string;
  closeAt: string;
}

export interface TimeTable {
  daysOfTheWeek: Array<number>;
  blocks: Array<TimeBlock>;
}
