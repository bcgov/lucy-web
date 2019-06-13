/**
 * Test Helpers method
 */
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

// -----------------------------
