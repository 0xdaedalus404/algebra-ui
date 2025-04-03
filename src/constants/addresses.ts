import { ADDRESS_ZERO, ChainId } from "@cryptoalgebra/custom-pools-sdk";
import { Address } from "viem";

export const POOL_INIT_CODE_HASH: Record<number, Address> = {
    [ChainId.Base]: "0xa18736c3ee97fe3c96c9428c0cc2a9116facec18e84f95f9da30543f8238a782",
    [ChainId.BaseSepolia]: "0xa18736c3ee97fe3c96c9428c0cc2a9116facec18e84f95f9da30543f8238a782",
};

export const ALGEBRA_FACTORY: Record<number, Address> = {
    [ChainId.Base]: "0x51a744E9FEdb15842c3080d0937C99A365C6c358",
    [ChainId.BaseSepolia]: "0x5E4F01767A1068C5570c29fDF9bf743b0Aa637d7",
};

export const ALGEBRA_POOL_DEPLOYER: Record<number, Address> = {
    [ChainId.Base]: "0x02e6f07f6E908245C9f1d83d92b84d0a4815691c",
    [ChainId.BaseSepolia]: "0x32e3F485696b2C6dBBc5C83A5Cb803Af72e1ecF3",
};

export const ALGEBRA_LIMIT_ORDER_PLUGIN: Record<number, Address> = {
    [ChainId.Base]: "0x211BD8917d433B7cC1F4497AbA906554Ab6ee479",
    [ChainId.BaseSepolia]: ADDRESS_ZERO,
};

export const ALGEBRA_POSITION_MANAGER: Record<number, Address> = {
    [ChainId.Base]: "0x8aD26dc9f724c9A7319E0E25b907d15626D9a056",
    [ChainId.BaseSepolia]: "0x9ea4459c8DefBF561495d95414b9CF1E2242a3E2",
};

export const ALGEBRA_QUOTER: Record<number, Address> = {
    [ChainId.Base]: "0x84d29244efF4d098B865A938D0e0abdD5CaDF27a",
    [ChainId.BaseSepolia]: "0xc58874216AFe47779ADED27B8AAd77E8Bd6eBEBb",
};

export const ALGEBRA_QUOTER_V2: Record<number, Address> = {
    [ChainId.Base]: "0xe0e840C629402AB33433D00937Fe065634b1B1Af",
    [ChainId.BaseSepolia]: "0x4e73E421480a7E0C24fB3c11019254edE194f736",
};

export const ALGEBRA_ROUTER: Record<number, Address> = {
    [ChainId.Base]: "0x5Cd40c7E21A15E7FC2503Fffd77cF70c60628F6C",
    [ChainId.BaseSepolia]: "0x4b2A38344b9aAc2F4e82130f35F1630C80ED94Bb",
};

export const ALGEBRA_ETERNAL_FARMING: Record<number, Address> = {
    [ChainId.Base]: "0x652071AF348a44D38be519fA17eE9183A6e38F99",
    [ChainId.BaseSepolia]: "0xf3b57fE4d5D0927C3A5e549CB6aF1866687e2D62",
};

export const FARMING_CENTER: Record<number, Address> = {
    [ChainId.Base]: "0x3aA96eDb755C44F3E50C5408a36abb52f28326Ba",
    [ChainId.BaseSepolia]: "0x211BD8917d433B7cC1F4497AbA906554Ab6ee479",
};

export const CUSTOM_POOL_DEPLOYER_LIMIT_ORDER: Record<number, Address> = {
    [ChainId.Base]: "0xf3b57fe4d5d0927c3a5e549cb6af1866687e2d62",
};

export const CUSTOM_POOL_BASE: Record<number, Address> = {
    [ChainId.Base]: ADDRESS_ZERO,
    [ChainId.BaseSepolia]: ADDRESS_ZERO,
};

// ALM
export const CUSTOM_POOL_DEPLOYER_ALM: Record<number, Address> = {
    [ChainId.Base]: "0x4b5306375bb264481c097a5f693877ed41a5ecf1",
};
export const VAULT_DEPOSIT_GUARD: Record<number, Address> = {
    [ChainId.Base]: "0xd97c576eCd678cBAd57d112d93a1Ce76C880233E",
    [ChainId.BaseSepolia]: "0x6768D9cEC5e1C4f416685dBfCFa4F92E660dc129",
};
