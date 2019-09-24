import { Component, OnInit, AfterViewInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';
import { StringConstants } from 'src/app/constants/string-constants';
import { Router } from '@angular/router';
import { AppRoutes } from 'src/app/constants';
import { UserAccessType } from 'src/app/models/Role';
import { AlertService } from 'src/app/services/alert.service';
import { RouterService } from 'src/app/services/router.service';
import { LoadingService } from 'src/app/services/loading.service';
import { RolesService } from 'src/app/services/roles.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  private userAccessType: UserAccessType;

  public get requestDataEntryAccessMessage(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Message;
  }

  public get requestDataEntryAccessTitle(): string {
    return StringConstants.databaseAccess_requestDataEntryAccess_Title;
  }

  public get showRequestDataEntryAccessMessage(): boolean {
    if (!this.userAccessType) {
      return false;
    }
    if (this.roleService.canCreate(this.userAccessType)) {
      return false;
    } else {
      return this.userService.showRequestDataEntryAccessMessage();
    }
  }

  public userRoleAndOrganization = ``;
  public accessTypeMessage = ``;
  public userFullName = ``;
  public userInitials = ``;

  // Lottie Animation
  public lottieConfig: Object;
  private anim: any;
  private animationSpeed = 1;
  /////////////////


  constructor(private userService: UserService, private router: RouterService, private alertService: AlertService, private loadingService: LoadingService, private roleService: RolesService) {
    this.lottieConfig = {
      path: 'https://assets3.lottiefiles.com/datafiles/cS8pm9FZK13Qo6e/data.json',
      renderer: 'canvas',
      autoplay: true,
      loop: false
    };
  }

  ngOnInit() {
  }

  ngAfterViewInit() {
    this.loadingService.add();
    this.userService.getFullName().then((value) => {
      this.userFullName = value;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.userService.getInitials().then((value) => {
      this.userInitials = value;
      this.loadingService.remove();
    });

    this.loadingService.add();
    this.userService.getOrganizationAndRole().then((value) => {
      this.userRoleAndOrganization = value;
      this.loadingService.remove();
    });

    // Redirect to user info page if basic information isnt filled
    this.loadingService.add();
    this.userService.basicInformationExists().then((exists) => {
      this.loadingService.remove();
      if (!exists) {
        this.navigateToUserInfo();
      }
    });
  }

  /////////// Lottie ///////////
  handleAnimation(anim: any) {
    this.anim = anim;
  }

  stop() {
    this.anim.stop();
  }

  play() {
    this.anim.play();
  }

  pause() {
    this.anim.pause();
  }

  setSpeed(speed: number) {
    this.animationSpeed = speed;
    this.anim.setSpeed(speed);
  }

  /////////// End Lottie ///////////

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
      this.alertService.show(`Success`, `Your Data Entry Access request has been sent.`, null);
      console.log(`Request sent`);
    } else {
      this.alertService.show(`Failed`, `Could not create request.`, null);
      console.log(`Request failed`);
    }
  }

  public navigateToUserInfo() {
    this.router.navigateTo(AppRoutes.UserInfo);
  }
}
