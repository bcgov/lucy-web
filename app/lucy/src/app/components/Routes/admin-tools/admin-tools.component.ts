/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Component, OnInit, AfterViewInit } from '@angular/core';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { RolesService } from 'src/app/services/roles.service';
import { AdminService } from 'src/app/services/admin.service';
import { User } from 'src/app/models';
import { Role } from 'src/app/models/Role';
import { LoadingService } from 'src/app/services/loading.service';
import { ExportService } from 'src/app/services/export/export.service';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css']
})

export class AdminToolsComponent implements OnInit, AfterViewInit {
  public requests: AccessRequest[] = [];
  public allUsers: User[] = [];
  public activeRoles: Role[] = [];

  public focusedAccessRequest: AccessRequest;

  constructor(private roles: RolesService, private admin: AdminService, private loadingService: LoadingService, private exportService: ExportService) { }

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
