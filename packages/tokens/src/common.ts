import { ChainId, ERC20Token } from '@pancakeswap/sdk'

export const GTOKEN_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0x05dBe925606d1B0B3fC939FD6273036a89CD71F1',
  18,
  'DKO',
  'Duckstail Token',
  'https://pancakeswap.finance/',
)

export const USDC_BSC = new ERC20Token(
  ChainId.BSC,
  '0x8AC76a51cc950d9822D68b83fE1Ad97B32Cd580d',
  18,
  'USDC',
  'Binance-Peg USD Coin',
  'https://www.centre.io/usdc',
)

export const USDC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48',
  6,
  'USDC',
  'USD Coin',
)

export const USDC_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xaf88d065e77c8cC2239327C5EDb3A432268e5831',
  6,
  'USDC',
  'USD Coin',
)

export const USDT_BSC = new ERC20Token(
  ChainId.BSC,
  '0x55d398326f99059fF775485246999027B3197955',
  18,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0xdAC17F958D2ee523a2206206994597C13D831ec7',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const USDT_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9',
  6,
  'USDT',
  'Tether USD',
  'https://tether.to/',
)

export const BUSD_BSC = new ERC20Token(
  ChainId.BSC,
  '0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const BUSD_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x4Fabb145d64652a948d72533023f6E7A623C7C53',
  18,
  'BUSD',
  'Binance USD',
  'https://www.paxos.com/busd/',
)

export const DAI_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x6B175474E89094C44Da98b954EedeAC495271d0F',
  18,
  'DAI',
  'Dai Stablecoin',
  'https://makerdao.com/',
)

export const DAI_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0xDA10009cBd5D07dd0CeCc66161FC93D7c9000da1',
  18,
  'DAI',
  'Dai Stablecoin',
  'https://makerdao.com/',
)

export const WBTC_ETH = new ERC20Token(
  ChainId.ETHEREUM,
  '0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const WBTC_ARB = new ERC20Token(
  ChainId.ARBITRUM,
  '0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f',
  8,
  'WBTC',
  'Wrapped BTC',
)

export const GTOKEN = {
  [ChainId.ARBITRUM]: GTOKEN_ARB,
}

export const USDC = {
  [ChainId.BSC]: USDC_BSC,
  [ChainId.ETHEREUM]: USDC_ETH,
  [ChainId.ARBITRUM]: USDC_ARB,
}

export const USDT = {
  [ChainId.ETHEREUM]: USDT_ETH,
  [ChainId.ARBITRUM]: USDT_ARB,
}

export const BUSD = {
  [ChainId.ETHEREUM]: BUSD_ETH,
  [ChainId.BSC]: BUSD_BSC,
}
