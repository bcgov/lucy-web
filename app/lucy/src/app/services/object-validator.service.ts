import { Injectable } from '@angular/core';
import { User, Jurisdiction, InvasivePlantSpecies, Observation} from '../models';
import { AccessRequest } from '../models/AccessRequest';
import { Role } from '../models/Role';

@Injectable({
  providedIn: 'root'
})
export class ObjectValidatorService {

  constructor() { }
  /**
   * Check if object is a User object
   * @param user object
   */
  public isUserObject(user: any): user is User {
    if (user === undefined || user === null) { return false; }
    return (<User>user.email) !== undefined;
  }

  /**
   * Check if object is an access request object
   * @param request object
   */
  public isAccessRequestObject(request: any): request is AccessRequest {
    if (request === undefined || request === null) {return false; }
    return this.isUserObject(<AccessRequest>request.requester);
    // return (<AccessRequest>request.role) !== undefined;
  }

  /**
   * Check if object is a role object
   * @param role object
   */
  public isRoleObject(role: any): role is Role {
    if (role === undefined || role === null) {return false; }
    return (<Role>role.role) !== undefined;
  }

  /**
   * Check if object is a jurisdiction object
   * @param jurisdiction object
   */
  public isJurisdictionObject(jurisdiction: any): jurisdiction is Jurisdiction {
    if (jurisdiction === undefined || jurisdiction === null) {return false; }
    return (<Jurisdiction>jurisdiction.code) !== undefined;
  }

  /**
   * Check if object is an invasive plant species object
   * @param species object
   */
  public isInvasivePlantSpeciesObject(species: any): species is InvasivePlantSpecies {
    if (species === undefined || species === null) {return false; }
    return (<InvasivePlantSpecies>species.species) !== undefined;
  }

  public isObservationObject(observation: any): observation is Observation {
    if (observation === undefined || observation === null) {return false; }
    return (<Observation>observation.date) !== undefined;
  }

}
