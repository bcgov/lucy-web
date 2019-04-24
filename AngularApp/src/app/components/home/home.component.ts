import { Component, OnInit } from '@angular/core';
import { UtilityService} from '../../services';
import { RemoteAPIStatus} from '../../models';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLogin = true;

  constructor() {
    this.update();
  }

  async update() {
    
  }

  ngOnInit() {
   
  }

}
