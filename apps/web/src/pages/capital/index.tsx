import { CHAIN_IDS } from 'utils/wagmi'
import Capital from 'views/Capital'

const CapitalPage = () => {
  return (
      <Capital />
  )
}

CapitalPage.chains = CHAIN_IDS

export default CapitalPage
