import { useState } from 'react'
import styled from 'styled-components'
import { Card, Text } from '@pancakeswap/uikit'
import { useTranslation } from '@pancakeswap/localization'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import Page from '../Page'
import { InputForm } from './components/InputForm'
import { QuoteForm } from './components/QuoteForm'

export const StyledAppBody = styled(Card)`
  border-radius: 8px;
  max-width: 1080px;
  width: 100%;
  z-index: 1;
`
const Airdrop: React.FC<React.PropsWithChildren> = () => {
  const [modalView, setModalView] = useState<CryptoFormView>(CryptoFormView.Input)

  const [ data, setData ] = useState<DataType[]>([])

  const { t } = useTranslation()

  return (
    <Page>
      <Text mb="20px" color="secondary" bold fontSize="28px">
        {t('PentaCoin Airdrop')}
      </Text>
      <StyledAppBody mb="24px">
        {modalView === CryptoFormView.Input ? (
          <InputForm setModalView={setModalView} setData={setData} />
        ) : (
          <QuoteForm setModalView={setModalView} data={data} />
        )}
      </StyledAppBody>
    </Page>
  )
}

export default Airdrop
