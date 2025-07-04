type UniswapTokenAddress = string;
type IntegralTokenAddress = string;

type UniswapPoolAddress = string;
type IntegralPoolAddress = string;

export const uniswapPlaceholderTokens: Record<IntegralTokenAddress, UniswapTokenAddress> = {
    "0x4200000000000000000000000000000000000006": "0x4200000000000000000000000000000000000006", // ETH
    "0xabac6f23fdf1313fc2e9c9244f666157ccd32990": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913", // USDC
};

export const uniswapPlaceholderPools: Record<IntegralPoolAddress, UniswapPoolAddress> = {
    "0x6ac1effa0f55a64d3bfb77a47ff1da88c0f504d8": "0xd0b53D9277642d899DF5C87A3966A349A798F224", // ETH - USDC base
    "0x048822b49dffc1fedd4f1ddcd5525912bb2fac5f": "0xd0b53D9277642d899DF5C87A3966A349A798F224", // ETH - USDC all-inclusive
};
