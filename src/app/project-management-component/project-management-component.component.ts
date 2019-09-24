import { Component, OnInit } from '@angular/core';
import { Project } from './project';
import { ProjectService } from '../project.service';
import { Options } from 'ng5-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { User } from '../user-management-component/user';
import { UserService } from '../user.service';
import { SearchUser } from '../user-management-component/search-user';
@Component({
  selector: 'app-project-management-component',
  templateUrl: './project-management-component.component.html',
  styleUrls: ['./project-management-component.component.css']
})
export class ProjectManagementComponentComponent implements OnInit {

  projects: Array<Project>;
  project: Project;
  parentProject: Project;
  addProjectEnabled: boolean;
  projectHandlerService: ProjectService;
  saveButton: string;
  closeResult: string;
  searchProject: string;
  userHandlerService: UserService;
  searchUser: SearchUser;
  users: Array<User>;
  user: User;

  errorMessage: string;
  options: Options = {
    floor: 0,
    ceil: 30
  };

  constructor(userHandlerService: UserService, projectHandlerService: ProjectService, private modalService: NgbModal) {
    this.projects = new Array<Project>();
    this.project = new Project();
    this.projectHandlerService = projectHandlerService;
    this.searchUser = new SearchUser();
    this.addProjectEnabled = true;
    this.saveButton = 'Add';
    this.userHandlerService = userHandlerService;
   }

  ngOnInit() {
    this.userHandlerService.getAllUsers().subscribe(userList => this.users = userList);
    this.projectHandlerService.getAllProjects().subscribe(projectsList => this.projects = projectsList);
  }

  onReset() {
    this.project = new Project();
    this.saveButton = 'Add';
  }


  onSubmit() {
    this.errorMessage = '';
    if (this.saveButton === 'Add')
    {
        this.projects.push(this.project);
        this.projectHandlerService.postProject(this.project);
    } else {
      this.projectHandlerService.updateProject(this.project);
    }

  }


  onClick(project: Project) {
    this.projectHandlerService.deleteProject(project.id);
    this.projects = this.projects.filter(projectEntry => project.id !== projectEntry.id);
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

  assignUser(user: User) {
    this.user = user;
    this.project.mgrId = user.id;
   }

  filterProjects() {
    if (this.searchProject){
      this.projectHandlerService.getAllProjects().subscribe(projectList => this.postFilter(projectList))
    } else {
      this.projectHandlerService.getAllProjects().subscribe(projectList => this.projects = projectList);
    }
  }

  postFilter(projectList: Array<Project>){
    this.projects = projectList;
    this.projects = this.projects.filter(projectEntry => this.searchProject === projectEntry.project);
  }

  onSort(sortColumn: string) {
    if (sortColumn === 'startDate'){
      this.projects = this.projects.sort((project1, project2) => (new Date(project1.startDate)).getTime() - (new Date(project2.startDate)).getTime());

    } else if (sortColumn === 'endDate') {
      this.projects = this.projects.sort((project1, project2) => (new Date(project1.endDate)).getTime() - (new Date(project2.endDate)).getTime());
    } else if (sortColumn === 'priority') {
      this.projects = this.projects.sort((project1, project2) => project1.priority.localeCompare(project2.priority));
    }
  }

  setDate(){
    this.project.startDate=new Date().toISOString().slice(0,16);
    this.project.endDate=new Date(new Date().getTime()+24*1000*60*60).toISOString().slice(0,16);
  }

  onAdd() {
    this.errorMessage = '';

    this.project = new Project();
    this.saveButton = 'Add';
    this.addProjectEnabled = true;
  }

  onView() {

    this.project = new Project();
    this.saveButton = 'Add';
    this.addProjectEnabled = true;

    this.projectHandlerService.getAllProjects().subscribe(projectsList => this.projects = projectsList);
  }

  onUpdate(project: Project) {
    this.errorMessage = '';
    this.saveButton = 'Update';
    this.project = project;
    this.addProjectEnabled = true;

  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }
}
