import { SearchTask } from './../search-task';
import { Component, OnInit } from '@angular/core';
import { Task } from './task';
import { TaskService } from '../task.service';
import { Options } from 'ng5-slider';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user-management-component/user';
import { UserService } from '../user.service';
import { SearchUser } from '../user-management-component/search-user';
import { ProjectService } from '../project.service';
import { Project } from '../project-management-component/project';


@Component({
  selector: 'app-task-manager-component',
  templateUrl: './task-manager-component.component.html',
  styleUrls: ['./task-manager-component.component.css']
})
export class TaskManagerComponentComponent implements OnInit {

  tasks: Array<Task>;
  task: Task;
  parentTask: Task;
  addTaskEnabled: boolean;
  taskHandlerService: TaskService;
  saveButton: string;
  taskName: string;
  searchTask: SearchTask;
  errorMessage: string;
  closeResult: string;
  users: Array<User>;
  user: User;
  parentUser: User;
  addUserEnabled: boolean;
  userHandlerService: UserService;
  searchUser: SearchUser;
  projectHandlerService:  ProjectService;
  projects: Array<Project>;
  project: Project;
  searchProject: string;
  options: Options = {
    floor: 0,
    ceil: 30
  };
  constructor(userHandlerService: UserService, taskHandlerService: TaskService,
              private route: ActivatedRoute,projectHandlerService: ProjectService, private modalService: NgbModal) {
    this.tasks = new Array<Task>();
    this.task = new Task();
    this.searchTask = new SearchTask();
    this.addTaskEnabled = false;
    this.taskHandlerService = taskHandlerService;
    this.userHandlerService = userHandlerService;
    this.projectHandlerService = projectHandlerService;
   }

  ngOnInit() {
    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }

  filterUsers() {
    if (this.searchUser.searchString){
      this.userHandlerService.getAllUsers().subscribe(userList => this.postFilterUser(userList))
    } else {
      this.userHandlerService.getAllUsers().subscribe(userList => this.users = userList);
    }
  }

  filterProjects() {
    if (this.searchProject){
      this.projectHandlerService.getAllProjects().subscribe(projectList => this.postFilterProject(projectList))
    } else {
      this.projectHandlerService.getAllProjects().subscribe(projectList => this.projects = projectList);
    }
  }

  postFilterProject(projectList: Array<Project>){
    this.projects = projectList;
    
    this.projects = this.projects.filter(project => this.searchProject !== project.id)
                 
  }
  postFilterUser(userList: Array<User>){
    this.users = userList;
    this.users = this.users.filter(userEntry => this.searchUser.searchString === userEntry.firstName)
                 .concat(this.users.filter(userEntry => this.searchUser.searchString === userEntry.lastName)
                   .concat(this.users.filter(userEntry => this.searchUser.searchString === userEntry.employeeId)));
  }

  onSubmit() {
    this.errorMessage='';
    if (this.saveButton === 'Save')
    {

      if (this.task.parentTask){
        this.taskHandlerService.getTask(this.task.parentTask).subscribe(parentTask=>this.handlePostAdd(parentTask));
      }
      else{
        this.tasks.push(this.task);
        this.taskHandlerService.postTask(this.task);
        this.addTaskEnabled = false;
      }


    } else {
      this.addTaskEnabled = false;
      this.taskHandlerService.updateTask(this.task);
    }

  }

  handlePostAdd(parentTask: Task) {
      if(parentTask){
        this.tasks.push(this.task);
        this.taskHandlerService.postTask(this.task);
        this.addTaskEnabled = false;
      }
      else{
        this.errorMessage='Parent Task Not found';
        throw Error('Parent Task Not found');
      }
  }

  onClick(task: Task) {
   // this.taskHandlerService.deleteTask(task.task);
   task.status='completed';
   this.taskHandlerService.updateTask(this.task); 
   // this.tasks = this.tasks.filter(taskEntry => task.id !== taskEntry.id);
  }

  onSort(sortColumn: string) {
    
    
    if (sortColumn === 'startDate'){
      this.tasks = this.tasks.sort((task1, task2) => (new Date(task1.startDate)).getTime() - (new Date(task2.startDate)).getTime());

    } else if (sortColumn === 'endDate') {
      this.tasks = this.tasks.sort((task1, task2) =>  new Date(task1.endDate).getTime() -  new Date(task2.endDate).getTime());
    } else if (sortColumn === 'priority') {
      this.tasks = this.tasks.sort((task1, task2) => task1.priority.localeCompare(task2.priority));
    }
    else if (sortColumn === 'completed') {
      this.tasks = this.tasks.sort((task1, task2) => task1.status===null?0:task2.status===null?0:task1.status.localeCompare(task2.status));
    }
  }

  filterTasks() {
    this.taskHandlerService.getAllTasks().subscribe(taskList => this.postFilter(taskList))
  }

  postFilter(taskList: Array<Task>){
    this.tasks = taskList;
    if (this.searchTask.project)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.project === taskEntry.projectId);
      }
    if (this.searchTask.task)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.task === taskEntry.task);
      }
    if (this.searchTask.parentTask)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.parentTask === taskEntry.parentTask);
    }
    if (this.searchTask.startpriority)  {
      this.tasks = this.tasks.filter(taskEntry => +this.searchTask.startpriority <= +taskEntry.priority);
    }
    if (this.searchTask.endpriority)  {
      this.tasks = this.tasks.filter(taskEntry => +this.searchTask.endpriority >= +taskEntry.priority);
    }
    if (this.searchTask.startDate)  {

      this.tasks = this.tasks.filter(taskEntry => this.searchTask.startDate <= taskEntry.startDate);
    }
    if (this.searchTask.endDate)  {
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.endDate <= taskEntry.endDate);
    }
  }
  assignProject(project: Project) {
    this.project = project;
    this.searchTask.project = project.id;
    this.searchProject=project.id;
    this.filterTasks();
   }

  onAdd() {
    this.errorMessage='';

    this.task = new Task();
    this.saveButton = 'Save';
    this.addTaskEnabled = true;
  }

  onView() {

    this.task = new Task();
    this.saveButton = 'Save';
    this.addTaskEnabled = false;

    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }

  onUpdate(task: Task) {
    this.errorMessage='';
    this.saveButton = 'Update';
    this.task = task;
    this.addTaskEnabled = true;

  }

  

  open(content) {
    
    this.filterProjects();
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }

}
