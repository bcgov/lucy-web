import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { User, UserAccessType } from 'src/app/models';
import { StringConstants } from 'src/app/constants/string-constants';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public get requestDataEntryAccessMessage(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Message;
  }

  public get requestDataEntryAccessTitle(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Title;
  }

  public showRequestDataEntryAccessMessage: boolean = false
  public userRoleAndOrganization: string = ""
  public accessTypeMessage: string = ""
  public userFullName: string = "";
  public userInitials: string = "";

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getFullName().then((value) => {
      this.userFullName = value
    });

    this.userService.getInitials().then((value) => {
      this.userInitials = value
    });

    this.userService.getAccess().then((value) => {
      if (value == UserAccessType.dataEntry) {
        this.showRequestDataEntryAccessMessage = false
      } else {
        this.showRequestDataEntryAccessMessage = this.userService.showRequestDataEntryAccessMessage()
      }
    });

    this.userService.getAccess().then((value) => {
      switch(value) {
        case UserAccessType.dataEntry:
            this.accessTypeMessage = StringConstants.databaseAccess_DataEntry_Badge;
        case UserAccessType.view:
            this.accessTypeMessage = StringConstants.databaseAccess_View_Badge;
      }
    });

    this.userService.getOranizarionAndRole().then((value) => {
      this.userRoleAndOrganization = value
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
