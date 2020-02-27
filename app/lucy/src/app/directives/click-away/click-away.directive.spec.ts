import { ClickAwayDirective } from './click-away.directive';
import { MockElementRef } from 'src/app/utils/testUtils';

describe('ClickAwayDirective', () => {
  let ref: MockElementRef;
  beforeEach(async () => {
    ref = new MockElementRef();
  });

  it('should create an instance', () => {
    const directive = new ClickAwayDirective(ref);
    expect(directive).toBeTruthy();
  });
});
