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
import { Component, OnInit, AfterViewInit, ElementRef, Renderer2 } from '@angular/core';
import { RolesService } from 'src/app/services/roles.service';
import { AdminService } from 'src/app/services/admin.service';
import { LoadingService } from 'src/app/services/loading.service';
import { ExportService, ExportType } from 'src/app/services/export/export.service';
import { AccessRequest } from 'src/app/models/AccessRequest';
import { User } from 'src/app/models';
import { Role } from 'src/app/models/Role';

@Component({
  selector: 'app-admin-tools',
  templateUrl: './admin-tools.component.html',
  styleUrls: ['./admin-tools.component.css']
})

export class AdminToolsComponent implements OnInit, AfterViewInit {
  public requests: AccessRequest[] = [];
  public allUsers: User[] = [];
  public activeRoles: Role[] = [];
  
  public selectedRequestUser: AccessRequest;

  public focusedAccessRequest: AccessRequest;

  public numberOfDataInInspectAppToExport: Number = 0;

  get hasExportData(): boolean {
    return this.numberOfDataInInspectAppToExport > 0;
  }

  // check if the request table is empty or not
  get hasRequests(): boolean {
    return this.requests.length !== 0;
  }

  requestLength(): number {
    return this.requests.length;
  }  

  constructor(
    private roles: RolesService,
    private admin: AdminService,
    private loadingService: LoadingService,
    private exportService: ExportService,
    private elementRef: ElementRef,
  ) { }

  ngOnInit() { }

  ngAfterViewInit() {
    this.fetchStaticData();
    this.fetchNonStaticData();
  }

  private fetchStaticData() {
    this.getAllRoles();
    this.getNumberOfDataInInspectAppToExport()
  }

  fetchNonStaticData() {
    this.getAllUsers();
    this.getAllRequests();
  }

  private async getAllRequests() {
    this.loadingService.add();
    this.admin.getRequests().then(async (value) => {
      this.requests = value;
      this.loadingService.remove();
    });
  }

  async getAllUsers() {
    this.loadingService.add();
    this.admin.getAllUsers().then(async (value) => {
      this.allUsers = value;
      this.loadingService.remove();
    });
  }

  private async getNumberOfDataInInspectAppToExport() {
    this.exportService.getInspectAppExportData(ExportType.WatercraftRiskAssessment).then((data) => {
      if (data){
        this.numberOfDataInInspectAppToExport = data.length
      }
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

  public async export() {
    this.exportService.exportCSV(ExportType.WatercraftRiskAssessment);
  }

  async menuItemClicked(id: string) {
    const el = this.elementRef.nativeElement.querySelector(`#${id}`);

    if (el) {
      el.scrollIntoView({
        block: 'start',
        behavior: 'smooth'
      });
    }
  }
  
}
