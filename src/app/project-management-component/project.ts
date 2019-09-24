export class Project {
  id: string;
  project: string;
  priority: string;
  startDate: string;
  endDate: string;
  mgrId: string;
  countOfTasks: string;
  countOfCompletedTasks: string;
  constructor() {
    this.priority = '0';
   }
}
