import { Component, OnInit } from '@angular/core';
import { SsoService } from 'src/app/services/sso.service';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  public get isAuthenticated() : boolean {
    return this.ssoService.isAuthenticated();
  }

  constructor(private ssoService: SsoService) {
    this.update();
  }

  async update() {
    
  }

  ngOnInit() {
    
  }

}
