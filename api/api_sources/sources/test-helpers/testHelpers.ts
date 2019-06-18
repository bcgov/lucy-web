/**
 * Test Helpers method
 */
import { UserDataController, RoleCodeController, RolesCodeValue, User } from '../database/models';
export type VerifyData = (data: any) => void;

export const verifySuccessBody = async (body: any, otherFieldVerify?: VerifyData) => {
    expect(body.data).toBeDefined();
    expect(body.message).toBeDefined();
    if (otherFieldVerify) {
        await otherFieldVerify(body.data);
    }
};

export const verifyErrorBody = async (body: any, otherFieldVerify?: VerifyData) => {
    expect(body.errors).toBeDefined();
    expect(body.message).toBeDefined();
    if (otherFieldVerify) {
        await otherFieldVerify(body.errors);
    }
};

export const createAdmin = async (): Promise<User> => {
    const admin = await UserDataController.shared.create();
    admin.email = 'amir@freshworks.io';
    admin.preferredUsername = 'ashayega@idir';
    admin.firstName = 'Amir';
    admin.lastName = 'Shyega';
    admin.roles = [await RoleCodeController.shared.getCode(RolesCodeValue.admin)];
    UserDataController.shared.saveInDB(admin);
    return admin;
};

// -----------------------------
