import { Address } from "viem";

export const ALM_POOLS: Address[] = ["0x47e8ca40666102ac217286e51660a4e6e6d7f9a3", "0x60680db4244a0ed3589ccd48d878d1abfcc88d54"].map(
    (address) => address.toLowerCase() as Address
);
