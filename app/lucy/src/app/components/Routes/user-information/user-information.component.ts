import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AppRoutes } from 'src/app/constants';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

  organizations: string[] = ['Private Citizen', 'Freshworks Studio', 'Ministry of Transportation'];

  organization = ``;
  firstName = ``;
  lastName = ``;
  email = ``;

  get organizationIsValid(): boolean {
    return (this.organization !== ``);
  }
  get firstNameIsValid(): boolean {
    return (this.firstName !== ``);
  }
  get lastNameIsValid(): boolean {
    return (this.lastName !== ``);
  }
  get emailIsValid(): boolean {
    // anystring@anystring.anystring
    var regex = /\S+@\S+\.\S+/;
    return regex.test(this.email);
  }

  get isValid(): boolean {
    return (this.firstNameIsValid && this.lastNameIsValid && this.emailIsValid && this.organizationIsValid);
  }

  public get invalidMessage(): string {
    if (this.isValid) {
      return ``;
    }

    let invalidFields = ``;
    if (!this.firstNameIsValid) {
      invalidFields = invalidFields + `First Name, `;
    }

    if (!this.lastNameIsValid) {
      invalidFields = invalidFields + `Last Name, `;
    }

    if (!this.organizationIsValid) {
      invalidFields = invalidFields + `Organization Name, `;
    }

    if (!this.emailIsValid) {
      invalidFields = invalidFields + `Email, `;
    }

    return (invalidFields.substring(0, invalidFields.lastIndexOf(`,`)) + `.`);

  }

  constructor(private userService: UserService, private router: Router) { }

  ngOnInit() {
    // Fetch organizations
    // fetch user info
    this.userService.getFirstName().then((value) => {
      this.firstName = value;
    });
    this.userService.getLastName().then((value) => {
      this.lastName = value;
    });
    this.userService.getOrganization().then((value) => {
      this.organization = value;
    });
    this.userService.getEmail().then((value) => {
      this.email = value;
    });
  }

  public chooseOrganization(organization: string) {
    this.organization = organization;
  }

  public onNext() {
    if (this.isValid) {
      this.userService.updateUserInfo(this.firstName, this.lastName).then((success) => {
        console.log(`called set basic info: ` + success);
        if (success) {
          this.router.navigateByUrl(AppRoutes.Profile);
        } else {
          // TODO: Create a re-usable modal alert component.
          console.log(`Couldnt update user information`);
        }
      });
    } else {
      console.log(`not valid`);
    }
  }
}
