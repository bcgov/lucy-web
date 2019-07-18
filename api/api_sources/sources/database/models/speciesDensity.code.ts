// ** Model  SpeciesDensityCode from schema SpeciesDensityCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { SpeciesDensityCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType } from '../../libs/core-model';
import { DataModelController } from '../data.model.controller';

@Entity( { name: SpeciesDensityCodeSchema.dbTable} )
export class SpeciesDensityCode {

	/**
	 * Class Properties
	 */

	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	species_density_code_id: number;

	@Column({ name: SpeciesDensityCodeSchema.columns.code})
	@ModelProperty({type: PropertyType.string})
	code: string;

	@Column({ name: SpeciesDensityCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	@Column({ name: SpeciesDensityCodeSchema.columns.activeIndicator})
	@ModelProperty({type: PropertyType.boolean})
	activeIndicator: boolean;

}


// ** DataModel controller of SpeciesDensityCode **
export class SpeciesDensityCodeController extends DataModelController<SpeciesDensityCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): SpeciesDensityCodeController {
		return this.sharedInstance<SpeciesDensityCode>(SpeciesDensityCode, SpeciesDensityCodeSchema) as SpeciesDensityCodeController;
	}
}

// -------------------------------------
