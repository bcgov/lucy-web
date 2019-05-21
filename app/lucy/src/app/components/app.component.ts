import { Component } from '@angular/core';
import { SsoService } from '../services/sso.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'SEISM';

  constructor(private ssoService: SsoService) {

  }

  ngOnInit() {
    console.log(this.ssoService.getUsername());
  }
}
