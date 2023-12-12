import { ChainId } from '@pancakeswap/sdk'
import Airdrop from 'views/Airdrop'

const AirdropPage = ({ userIp }) => {
  return <Airdrop />
}

AirdropPage.chains = [ChainId.ARBITRUM, ChainId.POLYGON, ChainId.BSC]

export default AirdropPage


// import { NotFound } from '@pancakeswap/uikit'

// const NotFoundPage = () => <NotFound />

// NotFoundPage.chains = []

// export default NotFoundPage