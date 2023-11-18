import { useTranslation } from '@pancakeswap/localization'
import BigNumber from 'bignumber.js'
import { Currency, CurrencyAmount } from '@pancakeswap/sdk'
import { useToast } from '@pancakeswap/uikit'
import { BIG_TEN } from '@pancakeswap/utils/bigNumber'
import { CommitButton } from 'components/CommitButton'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Column from 'components/Layout/Column'
import { AutoRow, RowBetween } from 'components/Layout/Row'
import CircleLoader from 'components/Loader/CircleLoader'
import { ApprovalState } from 'hooks/useApproveCallback'
import ProgressSteps from 'views/Swap/components/ProgressSteps'
import useCatchTxError from 'hooks/useCatchTxError'
import { ToastDescriptionWithTx } from 'components/Toast'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import useSendToken from '../hooks/useSendToken'

interface SendCommitButtonPropsType {
  data: DataType[]
  account: string
  approval: ApprovalState
  approveCallback: () => Promise<void>
  approvalSubmitted: boolean
  setApprovalSubmitted: (b: boolean) => void
  currency?: Currency
  swapInputError: string
  parsedAmount: CurrencyAmount<Currency>
}

export default function SendCommitButton({
  data,
  account,
  approval,
  approveCallback,
  approvalSubmitted,
  setApprovalSubmitted,
  currency,
  swapInputError,
  parsedAmount,
}: SendCommitButtonPropsType) {
  const { t } = useTranslation()

  const { toastSuccess } = useToast()
  const { fetchWithCatchTxError, fetchTxResponse, loading: pendingTx } = useCatchTxError()

  const { onSendToken } = useSendToken()

  const addresses = data.map((row) => row.address)
  const amounts = data.map((row) => new BigNumber(row.amount).times(BIG_TEN.pow(currency.decimals)).toJSON())
  const handleCommit = async () => {
    const receipt = await fetchWithCatchTxError(() => onSendToken(currency.wrapped.address, addresses, amounts))
    setApprovalSubmitted(false)

    if (receipt?.status) {
      toastSuccess(
        `${t('Confirmed')}!`,
        <ToastDescriptionWithTx txHash={receipt.transactionHash}>
          {t('Your %symbol% have been sent to the senders!', { symbol: 'PentaCoin' })}
        </ToastDescriptionWithTx>,
      )
    }
  }

  if (!account) {
    return <ConnectWalletButton width="100%" />
  }

  // show approve flow when: no error on inputs, not approved or pending, or approved in current session
  // never show if price impact is above threshold in non expert mode
  const showApproveFlow =
    !swapInputError &&
    (approval === ApprovalState.NOT_APPROVED ||
      approval === ApprovalState.PENDING ||
      (approvalSubmitted && approval === ApprovalState.APPROVED))

  const isValid = !swapInputError
  const approved = approval === ApprovalState.APPROVED

  if (showApproveFlow) {
    return (
      <>
        <RowBetween>
          <CommitButton
            variant={approval === ApprovalState.APPROVED ? 'success' : 'primary'}
            onClick={approveCallback}
            disabled={approval !== ApprovalState.NOT_APPROVED || approvalSubmitted}
            width="48%"
          >
            {approval === ApprovalState.PENDING ? (
              <AutoRow gap="6px" justify="center">
                {t('Enabling')} <CircleLoader stroke="white" />
              </AutoRow>
            ) : approvalSubmitted && approved ? (
              t('Enabled')
            ) : (
              t('Enable %asset%', { asset: currency?.symbol ?? '' })
            )}
          </CommitButton>
          <CommitButton
            variant='primary'
            onClick={handleCommit}
            width="48%"
            id="swap-button"
            disabled={!isValid || !approved || pendingTx}
          >
            {
              pendingTx ? 
                <AutoRow gap="6px" justify="center">
                  {t('Confirming')} <CircleLoader stroke="white" />
                </AutoRow> 
              : 
                t('Confirm')
            }
          </CommitButton>
        </RowBetween>
        <Column style={{ marginTop: '1rem' }}>
          <ProgressSteps steps={[approval === ApprovalState.APPROVED]} />
        </Column>
      </>
    )
  }

  return (
    <>
      <CommitButton
        variant='primary'
        onClick={handleCommit}
        id="swap-button"
        width="100%"
        disabled={!isValid || !approved || pendingTx}
      >
        {swapInputError ||
          (pendingTx ? 
            <AutoRow gap="6px" justify="center">
              {t('Confirming')} <CircleLoader stroke="white" />
            </AutoRow>
          : 
          t('Confirm'))}
      </CommitButton>
    </>
  )
}
