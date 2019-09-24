export class Task {
  id: string;
  task: string;
  priority: string;
  parentTask: string;
  startDate: string;
  endDate: string;
  userId: string;
  projectId: string;
  status: string;
  constructor() {
    this.priority = '0';
    this.status='open';
    this.startDate = new Date().toISOString().slice(0,16);
    console.log(this.startDate);
    this.endDate = new Date(new Date().getTime()+24*1000*60*60).toISOString().slice(0,16);
   }

}
