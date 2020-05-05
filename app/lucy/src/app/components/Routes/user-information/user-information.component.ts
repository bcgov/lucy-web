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
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { AppRoutes } from 'src/app/constants';
import { ToastService, ToastIconType } from 'src/app/services/toast/toast.service';
import { AlertService } from 'src/app/services/alert.service';

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
    return (this.firstNameIsValid && this.lastNameIsValid);
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

  constructor(private userService: UserService, private router: Router, private toast: ToastService, private alert: AlertService) { }

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
        if (success) {
          this.toast.show('Your information has been updated', ToastIconType.success);
          this.router.navigateByUrl(AppRoutes.Profile);
        } else {
          this.alert.show('Error', 'We couldnt update your indormation');
        }
      });
    } else {
      this.alert.show('Error', 'The information you entered is not valid');
    }
  }
}
