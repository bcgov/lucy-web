import { Utility, UtilityService } from './utility';

describe('Utility', () => {
  it('should create an instance', () => {
    expect(new Utility()).toBeTruthy();
  });

  it('should create an share instance', () => {
    expect(UtilityService).toBeTruthy();
  });
});
