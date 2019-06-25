import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StringConstants } from 'src/app/constants/string-constants';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/constants';
import { UserAccessType } from 'src/app/models/Role';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  private userAccessType: UserAccessType = UserAccessType.DataViewer

  public get requestDataEntryAccessMessage(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Message;
  }

  public get requestDataEntryAccessTitle(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Title;
  }

  public get showRequestDataEntryAccessMessage(): boolean {
    // TODO: Create access service: if accessService.hasDataEntryAccess
    if (this.userAccessType == UserAccessType.DataEditor || this.userAccessType == UserAccessType.Admin) {
      return false;
    } else {
      return this.userService.showRequestDataEntryAccessMessage();
    }
  }

  public userRoleAndOrganization = ``;
  public accessTypeMessage = ``;
  public userFullName = ``;
  public userInitials = ``;

  // Not yet used.. if loadingQue > 0, something is loading
  public loadingQue = 0;

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.loadingQue = 0;
  }

  ngAfterViewInit() {
    this.loadingQue++;
    this.userService.getFullName().then((value) => {
      this.userFullName = value;
      this.loadingQue--;
    });

    this.loadingQue++;
    this.userService.getInitials().then((value) => {
      this.userInitials = value;
      this.loadingQue--;
    });

    this.loadingQue++;
    this.userService.getAccess().then((value) => {
      this.userAccessType = value
      switch (value) {
        case UserAccessType.DataEditor:
          this.accessTypeMessage = StringConstants.databaseAccess_DataEntry_Badge;
          break;
        case UserAccessType.DataViewer:
          this.accessTypeMessage = StringConstants.databaseAccess_View_Badge;
          break;
        case UserAccessType.Admin:
          this.accessTypeMessage = StringConstants.databaseAccess_Admin_Badge;
          break;
      }
      this.loadingQue--;
    });

    this.loadingQue++;
    this.userService.getOranizarionAndRole().then((value) => {
      this.userRoleAndOrganization = value;
      this.loadingQue--;
    });

    // Redirect to user info page if basic information isnt filled
    this.loadingQue++;
    this.userService.basicInformationExists().then((exists) => {
      this.loadingQue--;
      if (!exists) {
        this.navigateToUserInfo();
      }
    });
  }

  /**
   * Uses UserService -> setShowRequestDataEntryAccessMessage()
   * to create a cookie to save the user preference.
   */
  public hideRequestDataEntryAccessMessage() {
    this.userService.setShowRequestDataEntryAccessMessage(false);
  }

  // TODO:
  public requestDataEntryAccess() {
    const success = this.userService.submitDataEntryRequest(`Let me in please.`);
    if (success) {
      console.log(`Request sent`);
    } else {
      console.log(`Request failed`);
    }
  }

  public navigateToUserInfo() {
    this.router.navigate([AppRoutes.UserInfo]);
  }
}
