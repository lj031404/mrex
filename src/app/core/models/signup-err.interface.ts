export interface SignUpError {
   firstname?: ErrorMessage[];
   lastname?: ErrorMessage[];
   age?: ErrorMessage[];
   phoneNumber?: ErrorMessage[];
   email?: ErrorMessage[];
   password?: ErrorMessage[];
   confirmPassword?: ErrorMessage[],
   language?: ErrorMessage[]
}

interface ErrorMessage {
	type: string;
	message: string;
}
