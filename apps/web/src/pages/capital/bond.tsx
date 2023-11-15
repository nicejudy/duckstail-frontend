import { CHAIN_IDS } from 'utils/wagmi'
import { BondsPageLayout } from 'views/Capital/bond'
import Bonds from 'views/Capital/bond/Bonds'

const BondPage = () => {
  return (
    <Bonds />
  )
}

BondPage.chains = CHAIN_IDS

export default BondPage
