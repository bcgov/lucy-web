import { Injectable } from '@angular/core';
import { User} from '../models';
import { AccessRequest } from '../models/AccessRequest';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class ObjectValidatorService {

  constructor() { }
  /**
   * Check if object is a User object
   * @param user 
   */
  public isUserObject(user: any): user is User {
    if (user === undefined || user === null) { return false };
    return (<User>user.email) !== undefined;
  }

  /**
   * Check if object is an access request object
   * @param request 
   */
  public isAccessRequestObject(request: any): request is AccessRequest {
    if (request === undefined || request === null) {return false}; 
    return this.isUserObject(<AccessRequest>request.requester)
    // return (<AccessRequest>request.role) !== undefined;
  }
  
  /**
   * Check if object is a role object
   * @param role 
   */
  public isRoleObject(role: any): role is Role {
    if (role === undefined || role === null) {return false}; 
    return (<Role>role.role) !== undefined;
  }


}
