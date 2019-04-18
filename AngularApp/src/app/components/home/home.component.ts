import { Component, OnInit } from '@angular/core';
import { UtilityService, Store, UserRemoteService, CategoryService} from '../../services';
import { RemoteAPIStatus} from '../../models';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  isLogin = false;

  constructor(private userService: UserRemoteService, private categoryService: CategoryService) {
    this.update();
  }

  async update() {
    if (UtilityService.isUserLogin) {
      const user = Store.user;
      const status: RemoteAPIStatus = await this.userService.updateUser(user) as RemoteAPIStatus;

      await this.categoryService.categories();
    }
  }

  ngOnInit() {
    this.isLogin = UtilityService.isUserLogin;
  }

}
