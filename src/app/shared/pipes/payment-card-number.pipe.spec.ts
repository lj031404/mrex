import { PaymentCardNumberPipe } from './payment-card-number.pipe';

describe('PaymentCardNumberPipe', () => {
  it('create an instance', () => {
	const pipe = new PaymentCardNumberPipe();
	expect(pipe).toBeTruthy();
  });
});
