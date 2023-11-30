import { Dispatch, SetStateAction, useCallback, useState } from 'react'
import { isAddress } from '@ethersproject/address'
import { useTranslation } from '@pancakeswap/localization'
import { Currency, ChainId } from '@pancakeswap/sdk'
import { Text, Box, TextArea, Button, Input, useModal, ChevronDownIcon, Flex } from '@pancakeswap/uikit'
import styled from 'styled-components'
import { CryptoFormView, DataType } from 'views/Airdrop/types'
import { useAccount, useChainId } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import Row from 'components/Layout/Row'
import { CommonBasesType } from 'components/SearchModal/types'
import { CurrencyLogo } from 'components/Logo'
import CurrencySearchModal from 'components/SearchModal/CurrencySearchModal'
// import useNativeCurrency from 'hooks/useNativeCurrency'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

const StyledTextArea = styled(TextArea)`
  max-width: 100%;
  min-width: 100%;
`

const StyledButton = styled(Button)`
  background-color: ${({ theme }) => theme.colors.input};
  color: ${({ theme }) => theme.colors.text};
  box-shadow: none;
  border-radius: 8px;
  margin-bottom: 20px;
`

const StyledFlex = styled(Flex)`
  width: 100%;
  flex-direction: column;
  align-items: center;
  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
  }
`

export function InputForm({
  setModalView,
  setData,
  tag,
  setTag,
  currency,
  setCurrency,
}: {
  setModalView: Dispatch<SetStateAction<CryptoFormView>>
  setData: Dispatch<SetStateAction<DataType[]>>
  tag: string
  setTag: Dispatch<SetStateAction<string>>
  currency: Currency | null
  setCurrency: Dispatch<SetStateAction<Currency | null>>
}) {
  const { t } = useTranslation()
  const chainId = useChainId()
  const { address: account } = useAccount()

  const [allocation, setAllocation] = useState("");

  const [allocationText, setAllocationText] = useState("Recipients allocation is required");

  const [allocationError, setAllocationError] = useState("Input Allocation");

  // const [files, setFiles] = useState("");

  const handleAllocation = (e: any) => {
    const alloc = e.target.value;
    if (alloc !== "") {
      setAllocationText("");
    } else {
      setAllocationText("Recipients allocation is required")
    }
    setAllocation(alloc);
    parseCSV(alloc);
  }

  const handleFileInput = (e: any) => {
    const file = e.target.files[0];
    if (file) {
        const reader = new FileReader();

        reader.onload = (event: any) => {
            const content = event.target?.result as string;
            setAllocation(content);
            parseCSV(content);
        };

        reader.readAsText(file);
    }
  }

  function parseCSV(csvContent: string) {
    const rows = csvContent.split('\n');
    const _senders: string[] = [];
    const _amounts = [];
    const _dict = []
    try {
      for (let i = 0; i < rows.length; i++) {
        const elements = rows[i].replaceAll(",", " ").split(" ").filter(x => x !== "");
        if (elements.length === 0) {
          setAllocationError(`Invalid value at line ${i+1}`);
          return;
        }
        if (!isAddress(elements[0])) {
          setAllocationError(`Invalid address at line ${i+1}`);
          return;
        }
        if (!elements[1]) {
          setAllocationError(`Invalid amount at line ${i+1}`);
          return;
        }
        if (elements.length > 2) {
          setAllocationError(`Invalid value at line ${i+1}`);
          return;
        }
        if (_senders.includes(elements[0])) {
          setAllocationError(`Duplicate address(${elements[0]}) at line ${i+1}`);
          return;
        }
        _senders.push(elements[0]);
        _amounts.push(Number(elements[1]));
        _dict.push({
          address: elements[0],
          amount: Number(elements[1])
        })
      }
      setData(_dict)
      setAllocationError("")
    } catch (e) {
      console.log(e)
    }
  }

  const handleConfirm = async () => {
    setModalView(CryptoFormView.Quote)
  }

  const placeholder = `Insert allocation: separate with breaks link. By format: address, amount or address amount
Ex:
0x0000000000000000000000000000000000001000 13.45
0x0000000000000000000000000000000000002000 1.049
0x0000000000000000000000000000000000003000 1
  `;

  const handleCurrencySelect = useCallback(
    (_currency: Currency) => {
      setCurrency(_currency)
    },
    [setCurrency],
  )

  const [onPresentCurrencyModal] = useModal(
    <CurrencySearchModal
      onCurrencySelect={handleCurrencySelect}
      showCommonBases
      selectedCurrency={currency ?? undefined}
      commonBasesType={CommonBasesType.LIQUIDITY}
    />,
    true,
    true,
    'selectCurrencyModal',
  )

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Add Allocation')} subTitle={t('Enter your token to be send with allocations')} />
      <FormContainer>
        <Box>
          <StyledButton
            endIcon={<ChevronDownIcon />}
            onClick={() => {
              onPresentCurrencyModal()
            }}
          >
            {currency ? (
              <Row>
                <CurrencyLogo currency={currency} />
                <Text ml="8px">{currency.symbol}</Text>
              </Row>
            ) : (
              <Text ml="8px">{t('Select a Token')}</Text>
            )}
          </StyledButton>
          <StyledTextArea
            rows={12}
            placeholder={placeholder}
            value={allocation}
            onChange={handleAllocation}
          />
          {allocationText !== "" && <Text color="warning" fontSize="14px" px="4px">
            {allocationText}
          </Text>}
        </Box>
        <Box>
          <Input
            type="file"
            id="csvFileInput"
            style={{
              display: "none"
            }}
            value=""
            onInput={handleFileInput}
          />
          <Button
            onClick={() => document.getElementById('csvFileInput')?.click()}
          >
            {t("Or choose from CSV file")}
          </Button>
        </Box>
        <StyledFlex>
          <Text pr="20px">Tag:</Text>
          <Input
            type="text"
            value={tag}
            onChange={(e) => setTag(e.target.value)}
          />
        </StyledFlex>
        {allocationError !== "" && <Text color="failure" fontSize="14px" px="4px">
          {allocationError}
        </Text>}
        {chainId !== ChainId.ARBITRUM || !account ? <ConnectWalletButton /> : <Button
          onClick={handleConfirm}
          disabled={allocationError !== "" || allocationText !== ""}
        >{t("Next")}</Button>}
      </FormContainer>
    </Box>
  )
}
