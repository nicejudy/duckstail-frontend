import { Dispatch, SetStateAction, useCallback, useEffect, useMemo, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from '@pancakeswap/localization'
import { Text, Box, Flex } from '@pancakeswap/uikit'
import { GTOKEN } from '@pancakeswap/tokens'
import { ApprovalState, useApproveCallback } from 'hooks/useApproveCallback'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { useAccount, useChainId } from 'wagmi'
import { getMultiSenderAddress } from 'utils/addressHelpers'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'
import DataTable from './DataTable'
import SendCommitButton from './SendCommitButton'
import { useAccountInfo } from '../hooks/useAccountInfo'

const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px 3fr repeat(4, 1fr);

  @media screen and (max-width: 900px) {
    grid-template-columns: 20px 2fr repeat(3, 1fr);
    & :nth-child(4) {
      display: none;
    }
  }

  @media screen and (max-width: 800px) {
    grid-template-columns: 20px 2fr repeat(2, 1fr);
    & :nth-child(6) {
      display: none;
    }
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 1fr 1fr;
    > *:first-child {
      display: none;
    }
    > *:nth-child(3) {
      display: none;
    }
  }
`

const DataRow: React.FC<React.PropsWithChildren<{ address: string; amount: number; index: number }>> = ({ address, amount, index }) => {
  return (
    <ResponsiveGrid>
      <Flex>
        <Text>{index + 1}</Text>
      </Flex>
      <Text fontWeight={400}>{address}</Text>
      <Text fontWeight={400}>{amount}</Text>
    </ResponsiveGrid>
  )
}

export function QuoteForm({
  setModalView,
  data,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  data: DataType[]
}) {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address: account } = useAccount()

  const amounts = data.map((row) => row.amount)
  const totalAmounts = amounts.reduce((amount0, amount1) => amount0 + amount1, 0)

  const {
    currencyBalance,
    parsedAmount,
    inputError
  } = useAccountInfo(totalAmounts.toString(), GTOKEN[chainId])

  const [approval, approveCallback] = useApproveCallback(parsedAmount, getMultiSenderAddress(chainId))

  const [approvalSubmitted, setApprovalSubmitted] = useState<boolean>(false)

  useEffect(() => {
    if (approval === ApprovalState.PENDING) {
      setApprovalSubmitted(true)
    }
  }, [approval, approvalSubmitted])

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Confirm Airdrop')} subTitle={t('')} backTo={() => setModalView(CryptoFormView.Input)} />
      <FormContainer>
        <Box>
          <DataTable data={data} />
          <Flex width="100%" justifyContent="space-between" px="20px" mt="20px">
            <Text>{t("Total Senders")}</Text>
            <Text>{data.length}</Text>
          </Flex>
          <Flex width="100%" justifyContent="space-between" px="20px" mt="20px">
            <Text>{t("Total Amounts")}</Text>
            <Text>{parsedAmount.toFixed(2)}</Text>
          </Flex>
        </Box>
        <SendCommitButton
          data={data}
          account={account}
          approval={approval}
          approveCallback={approveCallback}
          approvalSubmitted={approvalSubmitted}
          setApprovalSubmitted={setApprovalSubmitted}
          currency={GTOKEN[chainId]}
          swapInputError={inputError}
          parsedAmount={parsedAmount}
        />
      </FormContainer>
    </Box>
  )
}
