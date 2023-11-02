import { arbitrumTokens } from '@pancakeswap/tokens'
import { SerializedFarmConfig } from '@pancakeswap/farms'

const farms: SerializedFarmConfig[] = [
  {
    pid: 0,
    lpSymbol: 'DKO',
    lpAddress: '0x05dBe925606d1B0B3fC939FD6273036a89CD71F1',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.gtoken,
    isTokenOnly: true,
  },
  {
    pid: 1,
    lpSymbol: 'DKO-ETH LP',
    lpAddress: '0xEB2A043d9B46DeCe67E7401DaD5958878Dc56853',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 2,
    lpSymbol: 'DKO-USDC LP',
    lpAddress: '0xEA982F3F545117DD17c3b0d5bfbEf2d7aC3369FE',
    quoteToken: arbitrumTokens.usdc,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 3,
    lpSymbol: 'DKO-USDT LP',
    lpAddress: '0xA86416f707832BD8EDA9f168d14f6fE76745648a',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 4,
    lpSymbol: 'DKO-DAI LP',
    lpAddress: '0x7A3007B3537463A153609615072d455CfB6f6F2b',
    quoteToken: arbitrumTokens.dai,
    token: arbitrumTokens.gtoken,
  },
  {
    pid: 5,
    lpSymbol: 'ETH-USDT LP',
    lpAddress: '0x74Da711B7b0CF0D295CBF7d495130bA815d706BB',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdt,
  },
  {
    pid: 6,
    lpSymbol: 'ETH-USDC LP',
    lpAddress: '0x9b13aE144b2D4864E95D71426bfDA2b319481042',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 7,
    lpSymbol: 'USDT-USDC LP',
    lpAddress: '0x32778125a9Cb7D2d1ba8F4fe0249d104e2D33bd2',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 8,
    lpSymbol: 'USDC-DAI LP',
    lpAddress: '0x0FED6b5d3361a7B7CA742366719D81176af8af97',
    quoteToken: arbitrumTokens.dai,
    token: arbitrumTokens.usdc,
  },
  {
    pid: 9,
    lpSymbol: 'WBTC-USDT LP',
    lpAddress: '0xEe2E2CD00D9b78A68975642a13Cd220Bf16D2987',
    quoteToken: arbitrumTokens.wbtc,
    token: arbitrumTokens.usdt,
  },
  {
    pid: 10,
    lpSymbol: 'WBTC-DAI LP',
    lpAddress: '0x93cCA9CaEdb85666ccB43FC39C4975FBaCB8Be69',
    quoteToken: arbitrumTokens.wbtc,
    token: arbitrumTokens.dai,
  },
  {
    pid: 11,
    lpSymbol: 'ETH-ARB LP',
    lpAddress: '0x113eDF1071162804c436333414B3b12A24e23C07',
    quoteToken: arbitrumTokens.weth,
    token: arbitrumTokens.arb,
  },
  {
    pid: 12,
    lpSymbol: 'USDC-ARB LP',
    lpAddress: '0x9Ac95d9367858B23510403ad847BD29f624801cd',
    quoteToken: arbitrumTokens.usdc,
    token: arbitrumTokens.arb,
  },
  {
    pid: 13,
    lpSymbol: 'USDT-ARB LP',
    lpAddress: '0xfCB777E1C6c6F7A28b2b349dc7c063Cf68bb3ABD',
    quoteToken: arbitrumTokens.usdt,
    token: arbitrumTokens.arb,
  },
].map((p) => ({ ...p, token: p.token.serialize, quoteToken: p.quoteToken.serialize }))

export default farms
