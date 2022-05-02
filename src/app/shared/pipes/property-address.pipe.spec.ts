import { PropertyAddressPipe } from './property-address.pipe';

describe('PropertyAddress1Pipe', () => {
  it('create an instance', () => {
	const pipe = new PropertyAddressPipe();
	expect(pipe).toBeTruthy();
  });
});
