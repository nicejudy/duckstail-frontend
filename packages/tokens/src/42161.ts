import { ChainId, WETH9, ERC20Token } from '@pancakeswap/sdk'
import { USDC, USDT, DAI_ARB, WBTC_ARB, GTOKEN } from './common'

export const arbitrumTokens = { 
  weth: WETH9[ChainId.ARBITRUM],
  usdt: USDT[ChainId.ARBITRUM],
  usdc: USDC[ChainId.ARBITRUM],
  dai: DAI_ARB,
  wbtc: WBTC_ARB,
  gtoken: GTOKEN[ChainId.ARBITRUM],
  arb: new ERC20Token(
    ChainId.ARBITRUM,
    '0x912CE59144191C1204E64559FE8253a0e49E6548',
    18,
    'ARB',
    'Arbitrum',
  ),
  dcp: new ERC20Token(
    ChainId.ARBITRUM,
    '0xdd5D2Ba8b84AA4E145efC3D055fD0e75bcB9E28c',
    9,
    'DCP',
    'Duckstail Capital',
  ),
  sdcp: new ERC20Token(
    ChainId.ARBITRUM,
    '0xbb93Cae0127d5D8e9501D997b96f780B6B5ce4e1',
    9,
    'SDCP',
    'Staked DCP',
  ),
}
