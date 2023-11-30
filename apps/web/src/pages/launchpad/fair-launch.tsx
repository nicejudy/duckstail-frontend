import { ChainId } from '@pancakeswap/sdk'
import FairLaunch from 'views/FairLaunch'

const LaunchpadPage = () => {
  return <FairLaunch />
}

LaunchpadPage.chains = [ChainId.ARBITRUM, ChainId.ETHEREUM]

export default LaunchpadPage