import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-information',
  templateUrl: './user-information.component.html',
  styleUrls: ['./user-information.component.css']
})
export class UserInformationComponent implements OnInit {

  organizations: string[] = ['Private Citizen', 'Freshworks Studio', 'Ministry of Transportation']; 
  organization: string = ""
  firstName: string = ""
  lastName: string = ""
  email: string = ""

  constructor() { }

  ngOnInit() {
    // Fetch organizations
    // fetch user info
  }

  public chooseOrganization(organization: string) {
    this.organization = organization
  }

  public organizationChanged() {

  }

  public emailAddressChanged() {

  }

  public lastNameChanged() {

  }

  public firstNameChanged() {

  }

}
