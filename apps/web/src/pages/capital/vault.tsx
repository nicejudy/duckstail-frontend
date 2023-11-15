import { CHAIN_IDS } from 'utils/wagmi'
import Vault from 'views/Capital/vault'

const VaultPage = () => {
  return (
    <Vault />
  )
}

VaultPage.chains = CHAIN_IDS

export default VaultPage
