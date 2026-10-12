export interface IShippingConfig {
  weightThresholdKg: number;
  chargePerWeightThreshold: number;
  freeShippingWeightThresholdKg: number;
}

export interface ISystemConfig {
  _id?: string;
  shipping: IShippingConfig;
  createdAt?: string;
  updatedAt?: string;
}

export interface IUpdateConfigPayload {
  shipping?: Partial<IShippingConfig>;
}
