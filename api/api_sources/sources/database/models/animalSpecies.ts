// ** Model: AnimalSpecies from schema AnimalSpeciesSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AnimalSpeciesSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { BaseModel } from './baseModel';
import { DataModelController } from '../data.model.controller';

/** Interface **/
/**
 * @description AnimalSpecies create interface
 */
export interface AnimalSpeciesSpec {
	commonName: string;
	scientificName: string;
	speciesClass: string;
}
// -- End: AnimalSpeciesSpec --


/** Interface **/
/**
 * @description AnimalSpecies update interface
 */
export interface AnimalSpeciesUpdateSpec {
	commonName?: string;
	scientificName?: string;
	speciesClass?: string;
}
// -- End: AnimalSpeciesUpdateSpec --

/**
 * @description Data Model Class for AnimalSpeciesSchema
 */
@ModelDescription({
	description: 'Data Model Class for AnimalSpeciesSchema',
	schema: AnimalSpeciesSchema,
	apiResource: false
})
@Entity( { name: AnimalSpeciesSchema.dbTable} )
export class AnimalSpecies extends BaseModel implements AnimalSpeciesSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {animal_species_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	animal_species_id: number;

	/**
	 * @description Getter/Setter property for column {common_name}
	 */
	@Column({ name: AnimalSpeciesSchema.columns.commonName})
	@ModelProperty({type: PropertyType.string})
	commonName: string;

	/**
	 * @description Getter/Setter property for column {scientific_name}
	 */
	@Column({ name: AnimalSpeciesSchema.columns.scientificName})
	@ModelProperty({type: PropertyType.string})
	scientificName: string;

	/**
	 * @description Getter/Setter property for column {species_class}
	 */
	@Column({ name: AnimalSpeciesSchema.columns.speciesClass})
	@ModelProperty({type: PropertyType.string})
	speciesClass: string;

}


// ** AnimalSpeciesController ** //


/**
 * @description Data Model Controller Class for AnimalSpeciesSchema and AnimalSpecies
 */
export class AnimalSpeciesController extends DataModelController<AnimalSpecies> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): AnimalSpeciesController {
		return this.sharedInstance<AnimalSpecies>(AnimalSpecies, AnimalSpeciesSchema) as AnimalSpeciesController;
	}
}

// -------------------------------------
