import { Component, ElementRef, AfterViewInit, EventEmitter, Output, NgZone, AfterViewChecked } from '@angular/core';
import { StoreService, UserRemoteService } from '../../services';
import { User, RemoteAPIStatus } from 'src/app/models';
declare const gapi: any;
declare const location: any;

@Component({
  selector: 'app-google-signin',
  templateUrl: './google-signin.component.html',
  styleUrls: ['./google-signin.component.css']
})
export class GoogleSigninComponent implements AfterViewInit, AfterViewChecked {

  // Output: Event emitter
  @Output() userLogin: EventEmitter<any> = new EventEmitter<any>();

  private clientId = '186040109992-4atkjmhs3gthsqiqfr70pub073kmn04b.apps.googleusercontent.com';
  //'186040109992-4atkjmhs3gthsqiqfr70pub073kmn04b.apps.googleusercontent.com';

  private scope = [
      'profile',
      'email'
  ].join(' ');

  public auth2: any;
  public googleInit() {
      gapi.load('auth2', () => {
          this.auth2 = gapi.auth2.init({
              client_id: this.clientId,
              cookiepolicy: 'single_host_origin',
              scope: this.scope
          });
          this.attachSignin(this.element.nativeElement.firstChild);
      });
  }
  public attachSignin(element: ElementRef) {
      this.auth2.attachClickHandler(element, {},
          (googleUser: any) => {
            // Logging
            const profile = googleUser.getBasicProfile();
            console.log('Token => ' + googleUser.getAuthResponse().id_token);
            console.log('ID => ' + profile.getId());
            console.log('Name: => ' + profile.getName());
            console.log('Image URL: => ' + profile.getImageUrl());
            console.log('Email: =>' + profile.getEmail());
            // YOUR CODE HERE
            const user: User = {
              name: profile.getName(),
              email: profile.getEmail(),
              id: profile.getId(),
              token: googleUser.getAuthResponse().id_token,
              profileImageURL: profile.getImageUrl()
            };
            StoreService.getInstance().saveUser(user);
            location.href = `http://localhost:80`;
          }, (error: any)  => {
              console.log(JSON.stringify(error, undefined, 2));
              location.href = `http://localhost:3030`;
          });
      }

      constructor(private element: ElementRef, private zone: NgZone, private userService: UserRemoteService) {
          console.log('ElementRef: ', this.element);
      }

      ngAfterViewInit() {

      }

      ngAfterViewChecked() {
          if (gapi) {
              this.googleInit();
          } else {
              console.log(`gapi is not loaded => reloading`);
              location.reload();
          }
      }

}
