// ** Model: Herbicide from schema HerbicideSchema **

import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { HerbicideSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description Herbicide create interface
 */
export interface HerbicideSpec {
	herbicideCode: string;
	compositeName: string;
	activeIngredient: string;
	tradeName: string;
	pmraNum: number;
	formulation: string;
	applicationRate: number;
	applicationUnits: string;
}
// -- End: HerbicideSpec --


/** Interface **/
/**
 * @description Herbicide update interface
 */
export interface HerbicideUpdateSpec {
	herbicideCode?: string;
	compositeName?: string;
	activeIngredient?: string;
	tradeName?: string;
	pmraNum?: number;
	formulation?: string;
	applicationRate?: number;
	applicationUnits?: string;
}
// -- End: HerbicideUpdateSpec --

/**
 * @description Data Model Class for HerbicideSchema
 */
@ModelDescription({
	description: 'Data Model Class for HerbicideSchema',
	schema: HerbicideSchema,
	apiResource: false
})
@Entity( { name: HerbicideSchema.dbTable} )
export class Herbicide extends Record implements HerbicideSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {herbicide_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	herbicide_id: number;

	/**
	 * @description Getter/Setter property for column {herbicide_code}
	 */
	@Column({ name: HerbicideSchema.columns.herbicideCode})
	@ModelProperty({type: PropertyType.string})
	herbicideCode: string;

	/**
	 * @description Getter/Setter property for column {composite_name}
	 */
	@Column({ name: HerbicideSchema.columns.compositeName})
	@ModelProperty({type: PropertyType.string})
	compositeName: string;

	/**
	 * @description Getter/Setter property for column {active_ingredient}
	 */
	@Column({ name: HerbicideSchema.columns.activeIngredient})
	@ModelProperty({type: PropertyType.string})
	activeIngredient: string;

	/**
	 * @description Getter/Setter property for column {trade_name}
	 */
	@Column({ name: HerbicideSchema.columns.tradeName})
	@ModelProperty({type: PropertyType.string})
	tradeName: string;

	/**
	 * @description Getter/Setter property for column {pmra_reg_num}
	 */
	@Column({name: HerbicideSchema.columns.pmraNum, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	pmraNum: number;

	/**
	 * @description Getter/Setter property for column {formulation}
	 */
	@Column({ name: HerbicideSchema.columns.formulation})
	@ModelProperty({type: PropertyType.string})
	formulation: string;

	/**
	 * @description Getter/Setter property for column {application_rate}
	 */
	@Column({name: HerbicideSchema.columns.applicationRate, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	applicationRate: number;

	/**
	 * @description Getter/Setter property for column {application_units}
	 */
	@Column({ name: HerbicideSchema.columns.applicationUnits})
	@ModelProperty({type: PropertyType.string})
	applicationUnits: string;

}

// -------------------------------------
