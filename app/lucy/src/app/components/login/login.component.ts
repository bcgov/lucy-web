import { Component, OnInit } from '@angular/core';
import { SsoService, SSOLoginProvider } from '../../services/sso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

//  constructor(private ssoService: SsoService) { }
  constructor() { }

  ngOnInit() {
  }

  loginWithBCeID() {
//    this.ssoService.login(SSOLoginProvider.BCeID);
  }

  loginWithIDIR() {
 //   this.ssoService.login(SSOLoginProvider.idir);
  }

}
