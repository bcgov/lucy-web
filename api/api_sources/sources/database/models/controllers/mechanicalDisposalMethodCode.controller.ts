
import { RecordController } from '../generic.data.models';
import { MechanicalDisposalMethodCode } from '../mechanicalDisposalMethod.code';
import { MechanicalDisposalMethodCodeSchema } from '../../database-schema';

/**
 * @description Record Controller Class for MechanicalDisposalMethodCodeSchema and MechanicalDisposalMethodCode
 */
export class MechanicalDisposalMethodCodeController extends RecordController<MechanicalDisposalMethodCode> {
	/**
	* @description Getter for shared instance
	*/
	public static get shared(): MechanicalDisposalMethodCodeController {
		return this.sharedInstance<MechanicalDisposalMethodCode>(MechanicalDisposalMethodCode, MechanicalDisposalMethodCodeSchema) as MechanicalDisposalMethodCodeController;
    }
    /**
	 * @description Overriding all method to sort alphabetically by mechanical_disposal_code
     * (matches the preferred ordering for code descriptions)
	 * @param object query
	 * ** Sorting Code
	 * ** (a, b) => ((a.mechanical_disposal_method_code_id > b.mechanical_disposal_method_code_id) ? 1 :
	 * (b.mechanical_disposal_method_code_id > a.mechanical_disposal_method_code_id) ? -1 : 0 )
	 */
	async all(query?: object) {
		const d = await super.all(query);
        d.sort( (a, b) => ((a.mechanical_disposal_method_code_id > b.mechanical_disposal_method_code_id) ? 1 :
            (b.mechanical_disposal_method_code_id > a.mechanical_disposal_method_code_id) ? -1 : 0 ));
		return d;
	}
}
