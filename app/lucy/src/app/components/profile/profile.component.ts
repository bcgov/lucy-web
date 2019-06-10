import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, UserAccessType } from 'src/app/models';
import { StringConstants } from 'src/app/constants/string-constants';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  private userAccessType: UserAccessType = UserAccessType.view

  public get requestDataEntryAccessMessage(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Message;
  }

  public get requestDataEntryAccessTitle(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Title;
  }

  public get showRequestDataEntryAccessMessage(): boolean {
    if (this.userAccessType == UserAccessType.dataEntry) {
      return false;
    } else {
      return this.userService.showRequestDataEntryAccessMessage();
    }
  }

  public userRoleAndOrganization: string = "";
  public accessTypeMessage: string = "";
  public userFullName: string = "";
  public userInitials: string = "";

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    this.userService.getFullName().then((value) => {
      this.userFullName = value;
    });

    this.userService.getInitials().then((value) => {
      this.userInitials = value;
    });

    this.userService.getAccess().then((value) => {
      this.userAccessType = value
      switch(value) {
        case UserAccessType.dataEntry:
            this.accessTypeMessage = StringConstants.databaseAccess_DataEntry_Badge;
        case UserAccessType.view:
            this.accessTypeMessage = StringConstants.databaseAccess_View_Badge;
      }
    });

    this.userService.getOranizarionAndRole().then((value) => {
      this.userRoleAndOrganization = value;
    });

    // Redirect to user info page if basic information isnt filled
    this.userService.basicInformationExists().then((exists) => {
      if (!exists) {
        this.router.navigate([AppRoutes.UserInfo])
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

  }
  

}
