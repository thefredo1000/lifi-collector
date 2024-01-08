export type Token = {
  address: string;
  chainId: number;
  symbol: string;
  decimals: number;
  name: string;
  coinKey: string;
  logoURI: string;
  priceUSD: string;
};

export type TokenBalance = {
  token: Token;
  amount: string;
  amountUsd: string;
};

export type FeeBalance = {
  chainId: number;
  tokenBalances: TokenBalance[];
};

export type IntegratorData = {
  integratorId: string;
  feeBalances: FeeBalance[];
};
