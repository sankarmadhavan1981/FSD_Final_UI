import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { Ng5SliderModule } from 'ng5-slider';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TaskManagerComponentComponent } from './task-manager-component/task-manager-component.component';
import { UserManagementComponentComponent } from './user-management-component/user-management-component.component';
import { TaskViewComponentComponent } from './task-view-component/task-view-component.component';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import { ProjectManagementComponentComponent } from './project-management-component/project-management-component.component';
@NgModule({
  declarations: [
    AppComponent,
    TaskManagerComponentComponent,
    UserManagementComponentComponent,
    TaskViewComponentComponent,
    ProjectManagementComponentComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    Ng5SliderModule,
    NgbModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
