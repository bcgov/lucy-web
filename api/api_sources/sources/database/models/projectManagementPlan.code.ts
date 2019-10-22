// ** Model: ProjectManagementPlanCode from schema ProjectManagementPlanCodeSchema **

import { Column, Entity, PrimaryGeneratedColumn} from 'typeorm';
import { ProjectManagementPlanCodeSchema } from '../database-schema';
import { ModelProperty, PropertyType, ModelDescription } from '../../libs/core-model';
import { DateTransformer } from '../../libs/transformer';

import { Record } from './generic.data.models';

/** Interface **/
/**
 * @description ProjectManagementPlanCode create interface
 */
export interface ProjectManagementPlanCodeSpec {
	pmpNumber: string;
	description: string;
	pmpHolder: string;
	startDate: string;
	endDate: string;
}
// -- End: ProjectManagementPlanCodeSpec --


/** Interface **/
/**
 * @description ProjectManagementPlanCode update interface
 */
export interface ProjectManagementPlanCodeUpdateSpec {
	pmpNumber?: string;
	description?: string;
	pmpHolder?: string;
	startDate?: string;
	endDate?: string;
}
// -- End: ProjectManagementPlanCodeUpdateSpec --

/**
 * @description Data Model Class for ProjectManagementPlanCodeSchema
 */
@ModelDescription({
	description: 'Data Model Class for ProjectManagementPlanCodeSchema',
	schema: ProjectManagementPlanCodeSchema,
	apiResource: false
})
@Entity( { name: ProjectManagementPlanCodeSchema.dbTable} )
export class ProjectManagementPlanCode extends Record implements ProjectManagementPlanCodeSpec {

	/**
	 * Class Properties
	 */

	/**
	 * @description Getter/Setter property for column {project_management_plan_code_id}
	 */
	@PrimaryGeneratedColumn()
	@ModelProperty({type: PropertyType.number})
	project_management_plan_code_id: number;

	/**
	 * @description Getter/Setter property for column {pmp_number}
	 */
	@Column({ name: ProjectManagementPlanCodeSchema.columns.pmpNumber})
	@ModelProperty({type: PropertyType.string})
	pmpNumber: string;

	/**
	 * @description Getter/Setter property for column {description}
	 */
	@Column({ name: ProjectManagementPlanCodeSchema.columns.description})
	@ModelProperty({type: PropertyType.string})
	description: string;

	/**
	 * @description Getter/Setter property for column {pmp_holder}
	 */
	@Column({ name: ProjectManagementPlanCodeSchema.columns.pmpHolder})
	@ModelProperty({type: PropertyType.string})
	pmpHolder: string;

	/**
	 * @description Getter/Setter property for column {legal_start_date}
	 */
	@Column({name: ProjectManagementPlanCodeSchema.columns.startDate, transformer: new DateTransformer()})
	@ModelProperty({type: PropertyType.string})
	startDate: string;

	/**
	 * @description Getter/Setter property for column {legal_end_date}
	 */
	@Column({name: ProjectManagementPlanCodeSchema.columns.endDate, transformer: new DateTransformer()})
	@ModelProperty({type: PropertyType.string})
	endDate: string;

}

// -------------------------------------
