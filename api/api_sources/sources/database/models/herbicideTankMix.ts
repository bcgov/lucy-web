// ** Model: HerbicideTankMix from schema HerbicideTankMixSchema **

import { Column, Entity, PrimaryGeneratedColumn, JoinColumn, ManyToOne} from 'typeorm';
import { HerbicideTankMixSchema } from '../database-schema';
import {
	HerbicideSchema,
	ChemicalTreatmentSchema
} from '../database-schema';

import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { NumericTransformer } from '../../libs/transformer';
import {
	Herbicide,
	ChemicalTreatment
} from '../models';
import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description HerbicideTankMix create interface
 */
export interface HerbicideTankMixSpec {
	applicationRate: number;
	dilutionRate: number;
	herbicide: Herbicide;
	chemicalTreatment: ChemicalTreatment;
}
// -- End: HerbicideTankMixSpec --


/** Interface **/
/**
 * @description HerbicideTankMix update interface
 */
export interface HerbicideTankMixUpdateSpec {
	applicationRate?: number;
	dilutionRate?: number;
	herbicide?: Herbicide;
	chemicalTreatment?: ChemicalTreatment;
}
// -- End: HerbicideTankMixUpdateSpec --

/**
 * @description Data Model Class for HerbicideTankMixSchema
 */
@ModelDescription({
	description: 'Data Model Class for HerbicideTankMixSchema',
	schema: HerbicideTankMixSchema,
	apiResource: false
})
@Entity( { name: HerbicideTankMixSchema.dbTable} )
export class HerbicideTankMix extends Record implements HerbicideTankMixSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {herbicide_tank_mix_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	herbicide_tank_mix_id: number;

	/**
	 * @description Getter/Setter property for column {application_rate}
	 */
	@Column({name: HerbicideTankMixSchema.columns.applicationRate, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	applicationRate: number;

	/**
	 * @description Getter/Setter property for column {dilution_rate}
	 */
	@Column({name: HerbicideTankMixSchema.columns.dilutionRate, transformer: new NumericTransformer()})
	@ModelProperty({type: PropertyType.number})
	dilutionRate: number;

	/**
	 * @description Getter/Setter property for column {herbicide_id}
	 */
	@ManyToOne( type => Herbicide, { eager: true})
	@JoinColumn({ name: HerbicideTankMixSchema.columns.herbicide, referencedColumnName: HerbicideSchema.pk})
	@ModelProperty({type: PropertyType.object})
	herbicide: Herbicide;

	/**
	 * @description Getter/Setter property for column {chemical_treatment_id}
	 */
	@ManyToOne( type => ChemicalTreatment, { eager: false})
	@JoinColumn({ name: HerbicideTankMixSchema.columns.chemicalTreatment, referencedColumnName: ChemicalTreatmentSchema.pk})
	@ModelProperty({type: PropertyType.object})
	chemicalTreatment: ChemicalTreatment;

}

// -------------------------------------
