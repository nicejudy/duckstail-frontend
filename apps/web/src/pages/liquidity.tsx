import { ChainId } from '@pancakeswap/sdk'
import { CHAIN_IDS } from 'utils/wagmi'
import Liquidity from 'views/Pool'

const LiquidityPage = () => <Liquidity />

LiquidityPage.chains = [ChainId.ARBITRUM]

export default LiquidityPage
