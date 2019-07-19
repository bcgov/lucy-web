import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { RolesService } from 'src/app/services/roles.service';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models';
import { Role } from 'src/app/models/Role';
import { LoadingService } from 'src/app/services/loading.service';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css']
})

export class AdminToolsComponent implements OnInit, AfterViewInit {
  public requests: AccessRequest[] = []
  public allUsers: User[] = []
  public activeRoles: Role[] = []

  public focusedAccessRequest: AccessRequest;

  constructor(private roles: RolesService, private admin: AdminService, private loadingService: LoadingService) { }

  ngOnInit() {}

  ngAfterViewInit() {
    this.fetchStaticData();
    this.fetchNonStaticData();
  }

  private fetchStaticData() {
    this.getAllRoles();
  }

  private fetchNonStaticData() {
    this.getAllUsers();
    this.getAllRequests();
  }

  private async getAllRequests() {
    this.loadingService.add();
    this.admin.getRequests().then((value) => {
      this.requests = value;
      this.loadingService.remove();
    });
  }

  private async getAllUsers() {
    this.loadingService.add();
    this.admin.getAllUsers().then((value) => {
      this.allUsers = value;
      this.loadingService.remove();
    });
  }

  private async getAllRoles() {
    this.loadingService.add();
    this.roles.getRoles().then((value) => {
      this.activeRoles = value;
      this.loadingService.remove();
    });
  }

  public requestResponseSent() {
    this.fetchNonStaticData();
  }
}
