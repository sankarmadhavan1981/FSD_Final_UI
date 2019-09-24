import { SearchTask } from './../search-task';
import { Component, OnInit } from '@angular/core';

import { TaskService } from '../task.service';
import { Options } from 'ng5-slider';
import { Task } from '../task-manager-component/task';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user-management-component/user';
import { UserService } from '../user.service';
import { SearchUser } from '../user-management-component/search-user';
import { ProjectService } from '../project.service';
import { Project } from '../project-management-component/project';


@Component({
  selector: 'app-task-view-component',
  templateUrl: './task-view-component.component.html',
  styleUrls: ['./task-view-component.component.css']
})
export class TaskViewComponentComponent implements OnInit {
  tasks: Array<Task>;
  task: Task;
  parentTask: Task;
  addTaskEnabled: boolean;
  taskHandlerService: TaskService;
  saveButton: string;
  taskName: string;
  searchTask: SearchTask;
  searchProject: string;
  errorMessage: string;
  closeResult: string;
  users: Array<User>;
  user: User;
  projects: Array<Project>;
  project: Project;

  parentUser: User;
  addUserEnabled: boolean;
  userHandlerService: UserService;
  projectHandlerService:  ProjectService;
  searchUser: SearchUser;
  searchParentTask: string;
  parentTasks: Array<Task>;
  options: Options = {
    floor: 0,
    ceil: 30
  };
  constructor(userHandlerService: UserService, taskHandlerService: TaskService,
              private route: ActivatedRoute,  private modalService: NgbModal,
              projectHandlerService: ProjectService, private router: Router) {
    this.tasks = new Array<Task>();
    this.task = new Task();
    this.searchTask = new SearchTask();
    this.searchUser = new SearchUser();
    this.addTaskEnabled = false;
    this.taskHandlerService = taskHandlerService;
    this.saveButton = 'Add Task';
    this.userHandlerService = userHandlerService;
    this.projectHandlerService = projectHandlerService;
    this.router = router;
   }

  ngOnInit() {
    this.userHandlerService.getAllUsers().subscribe(userList => this.users = userList);
    this.route.paramMap.pipe(
      switchMap(params => {
        // (+) before `params.get()` turns the string into a number
        this.taskName = params.get('id');
        
        return this.taskHandlerService.getTask(this.taskName);
      })
    ).subscribe(selectedTask => {this.task = selectedTask; if (this.task) {this.saveButton = 'Update'} else {this.task=new Task();}});
    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.parentTasks = tasksList);
	this.projectHandlerService.getAllProjects().subscribe(projects => this.projects = projects);
  }


  filterUsers() {
    if (this.searchUser.searchString){
      this.userHandlerService.getAllUsers().subscribe(userList => this.postFilterUser(userList))
    } else {
      this.userHandlerService.getAllUsers().subscribe(userList => this.users = userList);
    }
  }

  postFilterUser(userList: Array<User>){
    this.users = userList;
    this.users = this.users.filter(userEntry => this.searchUser.searchString === userEntry.firstName)
                 .concat(this.users.filter(userEntry => this.searchUser.searchString === userEntry.lastName)
                   .concat(this.users.filter(userEntry => this.searchUser.searchString === userEntry.employeeId)));
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
    this.projects = this.projects.filter(project => this.searchProject === project.project)
                 
  }


  filterParentTasks() {
    if (this.searchParentTask){
      this.taskHandlerService.getAllTasks().subscribe(taskList => this.postFilterUserParentTask(taskList))
    } else {
      this.taskHandlerService.getAllTasks().subscribe(taskList => this.parentTasks = taskList);
    }
  }
  postFilterUserParentTask(taskList: Array<Task>){
    this.parentTasks = taskList;
    this.parentTasks = this.parentTasks.filter(taskEntry => this.searchParentTask === taskEntry.task);
  }

  onReset(){
    this.task = new Task();
    this.saveButton = 'Add Task';
  }

  onSubmit() {
    
    this.errorMessage = '';
    if (this.saveButton === 'Add Task')
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
    this.router.navigateByUrl('/view-task');

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
    this.taskHandlerService.deleteTask(task.task);
    this.tasks = this.tasks.filter(taskEntry => task.id !== taskEntry.id);
  }

  assignUser(user: User) {
   this.user = user;
   this.task.userId = user.id;
  }

  
  assignProject(project: Project) {
   this.project = project;
   this.task.projectId = project.id;
  }
  assignParentTask(task: Task) {
    this.task.parentTask = task.task;
   }

  filterTasks() {
    this.taskHandlerService.getAllTasks().subscribe(taskList => this.postFilter(taskList))
  }

  postFilter(taskList: Array<Task>){
    this.tasks = taskList;
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
      this.tasks = this.tasks.filter(taskEntry => this.searchTask.endDate >= taskEntry.endDate);
    }
  }


  onAdd() {
    this.errorMessage='';

    this.task = new Task();
    this.saveButton = 'Add Task';
    this.addTaskEnabled = true;
  }

  onView() {

    this.task = new Task();
    this.saveButton = 'Add Task';
    this.addTaskEnabled = false;

    this.taskHandlerService.getAllTasks().subscribe(tasksList => this.tasks = tasksList);
  }

  onUpdate(task: Task) {
    this.errorMessage='';
    this.saveButton = 'Update';
    this.task = task;
    this.addTaskEnabled = true;

  }

  open(content: any) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }


}
