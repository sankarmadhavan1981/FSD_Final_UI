import { ProjectManagementComponentComponent } from './project-management-component/project-management-component.component';
import { TaskManagerComponentComponent } from './task-manager-component/task-manager-component.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { UserManagementComponentComponent } from './user-management-component/user-management-component.component';
import { TaskViewComponentComponent } from './task-view-component/task-view-component.component';

const routes: Routes = [{
  path: 'add-task', component: TaskViewComponentComponent },
  { path: 'add-project', component: ProjectManagementComponentComponent },
  { path: 'add-task/:id', component: TaskViewComponentComponent },
  { path: '', component: TaskManagerComponentComponent },
  { path: 'view-task', component: TaskManagerComponentComponent },
  { path: 'add-user', component: UserManagementComponentComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
