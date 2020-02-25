/**
 *  Copyright © 2019 Province of British Columbia
 *
 *  Licensed under the Apache License, Version 2.0 (the "License");
 *  you may not use this file except in compliance with the License.
 *  You may obtain a copy of the License at
 *
 *  http://www.apache.org/licenses/LICENSE-2.0
 *
 * 	Unless required by applicable law or agreed to in writing, software
 * 	distributed under the License is distributed on an "AS IS" BASIS,
 * 	WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * 	See the License for the specific language governing permissions and
 * 	limitations under the License.
 *
 * 	Created by Amir Shayegh on 2019-10-23.
 */
import { Injectable } from '@angular/core';
import { User,
         Jurisdiction,
         InvasivePlantSpecies,
         Observation,
         SpeciesDensityCodes,
         SpeciesDistributionCodes,
         SpeciesAgencyCodes,
         ObservationTypeCodes,
         SoilTextureCodes,
         ObservationGeometryCodes,
         SpecificUseCodes,
         SlopeCodes,
         AspectCodes,
         ProposedActionCodes} from '../models';
import { AccessRequest } from '../models/AccessRequest';
import { Role } from '../models/Role';
import { MechanicalTreatmentMethodsCodes,
         MechanicalTreatment,
         MechanicalDisposalMethodsCodes,
         MechanicalSoilDisturbanceCodes,
         MechanicalRootRemovalCodes,
         MechanicalIssueCodes,
         MechanicalTreatmentProviders } from '../models/MechanicalTreatment';
import { HerbicideCodes, ChemicalTreatment, ChemicalTreatmentMethodCode } from '../models/ChemicalTreatment';
import { EfficacyCodes } from '../models/Monitor';
import { PreviousAISKnowledgeSource, PreviousInspectionSource, AdultMusselsLocation } from '../models/musselInspect';

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

  /**
   * Check if object is a herbicide object
   * @param herbicide object
   */
  public isHerbicideObject(herbicide: any): herbicide is HerbicideCodes {
    if (herbicide === undefined || herbicide === null) {return false; }
    return (<HerbicideCodes>herbicide.herbicideCode) !== undefined;
  }

  /**
   * Check if object is SpeciesDensityCode
   * @param density object
   */
  public isSpeciesDensityCodeObject(density: any): density is SpeciesDensityCodes {
    if (density === undefined || density === null) {return false; }
    return (<SpeciesDensityCodes>density.code) !== undefined;
  }

  /**
   * Check if object is speciesAgencyCode
   * @param distribution object
   */
  public isSpeciesAgencyCodeObject(agency: any): agency is SpeciesAgencyCodes {
    if (agency === undefined || agency === null) {return false; }
    return (<SpeciesAgencyCodes>agency.description) !== undefined;
  }

  /**
   * Check if object is SpeciesDistributionCode
   * @param distribution object
   */
  public isSpeciesDistributionCodeObject(distribution: any): distribution is SpeciesDistributionCodes {
    if (distribution === undefined || distribution === null) {return false; }
    return (<SpeciesDensityCodes>distribution.description) !== undefined;
  }

  /**
   * Check if object is ObservationTypeCodes
   * @param distribution object
   */
  public isObservationTypeCodesObject(observationType: any): observationType is ObservationTypeCodes {
    if (observationType === undefined || observationType === null) {return false; }
    return (<ObservationTypeCodes>observationType.description) !== undefined;
  }

  public isEfficacyCodesObject(efficacyCode: any): efficacyCode is EfficacyCodes {
    if (efficacyCode === undefined || efficacyCode === null) { return false; }
    return (<EfficacyCodes>efficacyCode.efficacyRating) !== undefined;
  }

  /**
   * Check if object is soilTextureCodes
   * @param distribution object
   */
  public isSoilTextureCodesObject(soilTexture: any): soilTexture is SoilTextureCodes {
    if (soilTexture === undefined || soilTexture === null) {return false; }
    return (<SoilTextureCodes>soilTexture.description) !== undefined;
  }

  /**
   * Check if object is ObservationGeometryCodes
   * @param distribution object
   */
  public isObservationGeometryCodesObject(observationGeometry: any): observationGeometry is ObservationGeometryCodes {
    if (observationGeometry === undefined || observationGeometry === null) {return false; }
    return (<ObservationGeometryCodes>observationGeometry.description) !== undefined;
  }

  /**
   * Check if object is specificUseCodes
   * @param distribution object
   */
  public isSpecificUseCodesObject(specificUseCodes: any): specificUseCodes is SpecificUseCodes {
    if (specificUseCodes === undefined || specificUseCodes === null) {return false; }
    return (<SpecificUseCodes>specificUseCodes.description) !== undefined;
  }

  /**
   * Check if object is an observation
   * @param observation object
   */
  public isObservationObject(observation: any): observation is Observation {
    if (observation === undefined || observation === null) {return false; }
    return (<Observation>observation.date) !== undefined;
  }

   /**
   * Check if object is ProposedActionCodes
   * @param proposedActionCodes object
   */
  public isProposedActionCodesObject(proposedActionCodes: any): proposedActionCodes is ProposedActionCodes {
    if (proposedActionCodes === undefined || proposedActionCodes === null) {return false; }
    return (<ProposedActionCodes>proposedActionCodes.description) !== undefined;
  }


   /**
   * Check if object is GroundAspectCodes
   * @param groundAspectCodes object
   */
  public isGroundAspectCodesObject(groundAspectCodes: any): groundAspectCodes is AspectCodes {
    if (groundAspectCodes === undefined || groundAspectCodes === null) {return false; }
    return (<AspectCodes>groundAspectCodes.description) !== undefined;
  }

  /**
   * Check if object is MechanicalDisposalMethodsCodes
   * @param MechanicalDisposalMethodsCodes object
   */
  public isMechanicalDisposalMethodCodesObject(mechanicalDisposalMethodCodes: any): mechanicalDisposalMethodCodes is MechanicalDisposalMethodsCodes {
    if (mechanicalDisposalMethodCodes === undefined || mechanicalDisposalMethodCodes === null) {return false; }
    return (<MechanicalDisposalMethodsCodes>mechanicalDisposalMethodCodes.description) !== undefined;
  }

  /**
   * Check if object is SoilDisturbanceCodes
   * @param SoilDisturbanceCodes object
   */
  public isMechanicalSoilDisturbanceCodesObject(mechanicalSoilDisturbanceCodes: any): mechanicalSoilDisturbanceCodes is MechanicalSoilDisturbanceCodes {
    if (mechanicalSoilDisturbanceCodes === undefined || mechanicalSoilDisturbanceCodes === null) {return false; }
    return (<MechanicalSoilDisturbanceCodes>mechanicalSoilDisturbanceCodes.description) !== undefined;
  }

  /**
   * Check if object is RootRemovalCodes
   * @param RootRemovalCodes object
   */
  public isMechanicalRootRemovalCodesObject(mechanicalRootRemovalCodes: any): mechanicalRootRemovalCodes is MechanicalRootRemovalCodes {
    if (mechanicalRootRemovalCodes === undefined || mechanicalRootRemovalCodes === null) {return false; }
    return (<MechanicalRootRemovalCodes>mechanicalRootRemovalCodes.description) !== undefined;
  }

   /**
   * Check if object is IssueCodes
   * @param IssueCodes object
   */
  public isMechanicalIssueCodesObject(mechanicalIssueCodes: any): mechanicalIssueCodes is MechanicalIssueCodes {
    if (mechanicalIssueCodes === undefined || mechanicalIssueCodes === null) {return false; }
    return (<MechanicalIssueCodes>mechanicalIssueCodes.description) !== undefined;
  }

   /**
   * Check if object is GroundSlopeCodes
   * @param groundSlopeCodes object
   */
  public isGroundSlopeCodesObject(groundSlopeCodes: any): groundSlopeCodes is SlopeCodes {
    if (groundSlopeCodes === undefined || groundSlopeCodes === null) {return false; }
    return (<SlopeCodes>groundSlopeCodes.description) !== undefined;
  }

   /**
   * Check if object is MechanicalTreatment
   * @param mechanicalTreatmentMethodsCodes object
   */
  public isMechanicalTreatmentObject(mechanicalTreatment: any): mechanicalTreatment is MechanicalTreatment {
    if (mechanicalTreatment === undefined || mechanicalTreatment === null) {return false; }
    return (<MechanicalTreatment>mechanicalTreatment.species) !== undefined;
  }

   /**
   * Check if object is MechanicalTreatmentMethodsCodes
   * @param mechanicalTreatmentMethodsCodes object
   */
  public isMechanicalTreatmentMethodsCodes(mechanicalTreatmentMethodsCodes: any): mechanicalTreatmentMethodsCodes is MechanicalTreatmentMethodsCodes {
    if (mechanicalTreatmentMethodsCodes === undefined || mechanicalTreatmentMethodsCodes === null) {return false; }
    return (<MechanicalTreatmentMethodsCodes>mechanicalTreatmentMethodsCodes.description) !== undefined;
  }

   /**
   * Check if object is MechanicalTreatmentProviders
   * @param mechanicalTreatmentMethodsCodes object
   */
  public isMechanicalTreatmentProvidersObject(mechanicalTreatmentProviders: any): mechanicalTreatmentProviders is MechanicalTreatmentProviders {
    if (mechanicalTreatmentProviders === undefined || mechanicalTreatmentProviders === null) {return false; }
    return (<MechanicalTreatmentProviders>mechanicalTreatmentProviders.registrationNumber) !== undefined;
  }

  /**
   * Check if object is ChemicalTreatmentMethodCode
   * @param chemicalTreatmentMethodsCodes object
   */
  public isChemicalTreatmentMethodsCodes(chemicalTreatmentMethodsCodes: any): chemicalTreatmentMethodsCodes is ChemicalTreatmentMethodCode {
    if (chemicalTreatmentMethodsCodes === undefined || chemicalTreatmentMethodsCodes === null) { return false; }
    return (<ChemicalTreatmentMethodCode>chemicalTreatmentMethodsCodes.description) !== undefined;
  }

  /**
   * Check if object is ChemicalTreatment
   * @param chemicalTreatment object
   */
  public isChemicalTreatmentObject(chemicalTreatment: any): chemicalTreatment is ChemicalTreatment {
    if (chemicalTreatment === undefined || chemicalTreatment === null) { return false; }
    return (<ChemicalTreatment>chemicalTreatment.tankMixes) !== undefined;
  }

  /**
   * Check if object is PreviousAISKnowledgeSource
   * @param knowledgeSource object
   */
  public isPreviousAISKnowledgeSourceObject(knowledgeSource: any): knowledgeSource is PreviousAISKnowledgeSource {
    if (knowledgeSource === undefined || knowledgeSource === null) { return false; }
    return (<PreviousAISKnowledgeSource>knowledgeSource.description) !== undefined;
  }

  /**
   * Check if object is PreviousInspectionSource
   * @param inspectionSource object
   */
  public isPreviousInspectionSourceObject(inspectionSource: any): inspectionSource is PreviousInspectionSource {
    if (inspectionSource === undefined || inspectionSource === null) { return false; }
    return (<PreviousInspectionSource>inspectionSource.description) !== undefined;
  }

  /**
   * Check if object is AdultMusselsLocation
   * @param locationFound object
   */
  public isAdultMusselsLocationObject(locationFound: any): locationFound is AdultMusselsLocation {
    if (locationFound === undefined || locationFound === null) { return false; }
    return (<AdultMusselsLocation>locationFound.description) !== undefined;
  }
}
