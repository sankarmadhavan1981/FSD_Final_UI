import { SearchUser } from './search-user';
import { Component, OnInit } from '@angular/core';
import { User } from './user';
import { UserService } from '../user.service';
import { Options } from 'ng5-slider';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-user-management-component',
  templateUrl: './user-management-component.component.html',
  styleUrls: ['./user-management-component.component.css']
})
export class UserManagementComponentComponent implements OnInit {
  users: Array<User>;
  user: User;
  parentUser: User;
  addUserEnabled: boolean;
  userHandlerService: UserService;
  saveButton: string;
  closeResult: string;
  searchUser: SearchUser;

  errorMessage: string;
  options: Options = {
    floor: 0,
    ceil: 30
  };

  constructor(userHandlerService: UserService, private modalService: NgbModal) {
    this.users = new Array<User>();
    this.user = new User();
    this.searchUser = new SearchUser();
    this.userHandlerService = userHandlerService;
    this.addUserEnabled = true;
    this.saveButton = 'Add';
   }

  ngOnInit() {

    this.userHandlerService.getAllUsers().subscribe(usersList => this.users = usersList);
  }

  onReset() {
    this.user = new User();
    this.saveButton = 'Add';
  }


  onSubmit() {
    this.errorMessage = '';
    if (this.saveButton === 'Add')
    {
        this.users.push(this.user);
        this.userHandlerService.postUser(this.user);
    } else {
      this.userHandlerService.updateUser(this.user);
    }

  }


  onClick(user: User) {
    this.userHandlerService.deleteUser(user.id);
    this.users = this.users.filter(userEntry => user.id !== userEntry.id);
  }

  filterUsers() {
    if (this.searchUser.searchString){
      this.userHandlerService.getAllUsers().subscribe(userList => this.postFilter(userList))
    } else {
      this.userHandlerService.getAllUsers().subscribe(userList => this.users = userList);
    }
  }

  postFilter(userList: Array<User>){
    this.users = userList;
    this.users = this.users.filter(userEntry => this.searchUser.searchString === userEntry.firstName)
                 .concat(this.users.filter(userEntry => this.searchUser.searchString === userEntry.lastName)
                   .concat(this.users.filter(userEntry => this.searchUser.searchString === userEntry.employeeId)));
  }

  onSort(sortColumn: string) {
    if (sortColumn === 'firstName'){
      this.users = this.users.sort((user1, user2) => user1.firstName.localeCompare(user2.firstName));

    } else if (sortColumn === 'lastName') {
      this.users = this.users.sort((user1, user2) => user1.lastName.localeCompare(user2.lastName));
    } else if (sortColumn === 'employeeId') {
      this.users = this.users.sort((user1, user2) => user1.employeeId.localeCompare(user2.employeeId));
    }
  }

  onAdd() {
    this.errorMessage = '';

    this.user = new User();
    this.saveButton = 'Add';
    this.addUserEnabled = true;
  }

  onView() {

    this.user = new User();
    this.saveButton = 'Add';
    this.addUserEnabled = true;

    this.userHandlerService.getAllUsers().subscribe(usersList => this.users = usersList);
  }

  onUpdate(user: User) {
    this.errorMessage = '';
    this.saveButton = 'Update';
    this.user = user;
    this.addUserEnabled = true;

  }

  open(content) {
    this.modalService.open(content, {ariaLabelledBy: 'modal-basic-title'}).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed `;
    });
  }
}
