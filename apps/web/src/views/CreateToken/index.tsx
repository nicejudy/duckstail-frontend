import { useState } from 'react'
import styled from 'styled-components'
import { Currency } from '@pancakeswap/sdk'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import useNativeCurrency from 'hooks/useNativeCurrency'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { TokenData, TokenFormView } from './types'
import Page from '../Page'
import { VerifyTokenForm } from './components/VerifyTokenForm'
// import { QuoteForm } from './components/QuoteForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const Launchpad: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<TokenFormView>(TokenFormView.Create)

  const [ tokenData, setTokenData ] = useState<TokenData>({
    name: "",
    symbol: "",
    decimals: "",
    totalSupply: "",
    type: "standard",
    liquidityGen: undefined,
    baby: undefined,
    buyBackBaby: undefined
  })

  const [address, setAddress] = useState<string>("")

  return (
    <Page>
      <StyledAppBody mb="24px">
        {
          modalView === TokenFormView.Create && 
          <VerifyTokenForm
            setModalView={setModalView}
            tokenData={tokenData}
            setTokenData={setTokenData}
            address={address}
            setAddress={setAddress}
          />
        }
      </StyledAppBody>
    </Page>
  )
}

export default Launchpad
