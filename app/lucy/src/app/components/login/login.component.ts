import { Component, OnInit } from '@angular/core';
import { SsoService, SSOLoginProvider } from '../../services/sso.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private ssoService?: SsoService) { }

  ngOnInit() {
  }

  loginWithBCeID() {
    if(this.ssoService)
	{	
    		this.ssoService.login(SSOLoginProvider.BCeID);
  	}
    }

  loginWithIDIR() {
    if(this.ssoService)
	{	
		this.ssoService.login(SSOLoginProvider.idir);
  	}
    }
}
