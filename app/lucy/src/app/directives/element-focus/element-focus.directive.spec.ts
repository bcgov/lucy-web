import { ElementFocusDirective } from './element-focus.directive';
import { MockElementRef } from 'src/app/utils/testUtils';

describe('ElementFocusDirective', () => {
  let ref: MockElementRef;
  beforeEach(async () => {
    ref = new MockElementRef();
  });

  it('should create an instance', () => {
    const directive = new ElementFocusDirective(ref);
    expect(directive).toBeTruthy();
  });
});
