export interface AddressPayload {
  fullName: string;
  postalCode: string;
  city: string;
  streetAddress: string;
  building?: string;
  phone: string;
}

export interface Address extends AddressPayload {
  _id: string;
}
