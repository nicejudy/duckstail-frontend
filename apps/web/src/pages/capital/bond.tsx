import { CHAIN_IDS } from 'utils/wagmi'
import Bonds from 'views/Capital/bond'

const BondPage = () => {
  return (
    <Bonds />
  )
}

BondPage.chains = CHAIN_IDS

export default BondPage
