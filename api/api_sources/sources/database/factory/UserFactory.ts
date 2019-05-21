import { DataModelFactory } from '../../libs/model-factory';
import { User} from '../models/User';

export declare type UserFactory = DataModelFactory<User>;
export const userFactory = (): UserFactory => {
    return new DataModelFactory<User>(User);
};