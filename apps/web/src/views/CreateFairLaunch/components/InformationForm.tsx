import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import { useTranslation } from '@pancakeswap/localization'
import { ChainId } from '@pancakeswap/sdk'
import { Text, Box, Message, Button, Input, Checkbox, Flex, MessageText } from '@pancakeswap/uikit'
import { useAccount, useChainId } from 'wagmi'
import ConnectWalletButton from 'components/ConnectWalletButton'
import ProgressSteps from 'views/Swap/components/ProgressSteps'
import { DeFi, LaunchpadFormView, TokenData } from '../types'
import { FormHeader } from './FormHeader'
import { FormContainer } from './FormContainer'

export function InformationForm({
  setModalView,
  tokenData,
  deFiData,
  setDefiData
}: {
  setModalView: Dispatch<SetStateAction<LaunchpadFormView>>
  tokenData: TokenData
  deFiData: DeFi
  setDefiData: Dispatch<SetStateAction<DeFi>>
}) {
  const { t } = useTranslation()
  // const chainId = useChainId()
  const { address: account } = useAccount()

  const [total, setTotal] = useState<string>(deFiData.total)
  const [whitelist, setWhitelist] = useState<boolean>(deFiData.whitelist)
  const [softCap, setSoftCap] = useState<string>(deFiData.softCap)
  const [maximumBuy, setMaximumBuy] = useState<string>(deFiData.maximumBuy)
  const [liquidity, setLiquidity] = useState<string>(deFiData.liquidity)
  const [startTime, setStartTime] = useState<string>(deFiData.startTime)
  const [endTime, setEndTime] = useState<string>(deFiData.endTime)
  const [lockTime, setLockTime] = useState<string>(deFiData.lockTime)
  const [isVesting, setIsVesting] = useState<boolean>(deFiData.isVesting)
  const [isMax, setIsMax] = useState<boolean>(false)
  const [totalAmount, setTotalAmount] = useState<number>(0)

  const [vestingFirst, setVestingFirst] = useState<string>(deFiData.vestingData.vestingFirst)
  const [vestingPeriod, setVestingPeriod] = useState<string>(deFiData.vestingData.vestingPeriod)
  const [vestingEach, setVestingEach] = useState<string>(deFiData.vestingData.vestingEach)

  const [totalError, setTotalError] = useState("");
  const [softCapError, setSoftCapError] = useState("");
  const [maximumBuyError, setMaximumBuyError] = useState("");
  const [liquidityError, setLiquidityError] = useState("");
  const [startTimeError, setStartTimeError] = useState("");
  const [endTimeError, setEndTimeError] = useState("");
  const [lockTimeError, setLockTimeError] = useState("");
  const [vestingFirstError, setVestingFirstError] = useState("");
  const [vestingPeriodError, setVestingPeriodError] = useState("");
  const [vestingEachError, setVestingEachError] = useState("");

  const handleNext = async () => {
    setDefiData({
      total,
      whitelist,
      softCap,
      isMax,
      maximumBuy,
      liquidity,
      startTime,
      endTime,
      lockTime,
      totalAmount: totalAmount.toString(),
      isVesting,
      vestingData: {
        vestingFirst,
        vestingPeriod,
        vestingEach
      }
    })
    setModalView(LaunchpadFormView.Socials)
  }

  const handlePrev = async () => {
    setDefiData({
      total,
      whitelist,
      softCap,
      isMax,
      maximumBuy,
      liquidity,
      startTime,
      endTime,
      lockTime,
      totalAmount: totalAmount.toString(),
      isVesting,
      vestingData: {
        vestingFirst,
        vestingPeriod,
        vestingEach
      }
    })
    setModalView(LaunchpadFormView.VerifyToken)
  }

  useEffect(() => {
    setTotalError("")
    setLiquidityError("")
    setLockTimeError("")
    setVestingFirstError("")
    setVestingPeriodError("")
    setVestingEachError("")

    if (Number(total) <= 0) setTotalError("Total selling amount must be positive number")
    if (total === "") setTotalError("Total selling amount cannot be blank")

    if (Number(liquidity) <= 50) setLiquidityError("Liquidity must be greater than 50%")
    if (liquidity === "") setLiquidityError("Liquidity cannot be blank")

    if (Number(lockTime) < 30) setLockTimeError("Liquidity lock time must be greater than or equal to 30")
    if (lockTime === "") setLockTimeError("Liquidity lock time cannot be blank")

    if (Number(vestingFirst) < 1) setVestingFirstError("First release for presale must be 1 or more")
    if (vestingFirst === "") setVestingFirstError("First release for presale cannot be blank")

    if (Number(vestingPeriod) < 1) setVestingPeriodError("Vesting period each cycle must be 1 or more")
    if (vestingPeriod === "") setVestingPeriodError("Vesting period each cycle cannot be blank")

    if (Number(vestingEach) < 1) setVestingEachError("Presale token release each cycle must be 1 or more")
    if (vestingEach === "") setVestingEachError("Presale token release each cycle cannot be blank")
  }, [total, liquidity, lockTime, vestingFirst, vestingPeriod, vestingEach])

  useEffect(() => {
    setSoftCapError("")
    if (Number(softCap) <= 0) setSoftCapError("Softcap must be positive number")
    if (softCap === "") setSoftCapError("Softcap cannot be blank")
  }, [softCap])

  useEffect(() => {
    setMaximumBuyError("")
    if (Number(maximumBuy) <= 0) setMaximumBuyError("Maximum buy must be positive number")
    if (maximumBuy === "") setMaximumBuyError("Maximum buy cannot be blank")
  }, [maximumBuy])

  useEffect(() => {
    setStartTimeError("")
    setEndTimeError("")
    const startTimeInTimestamp = Date.parse(`${startTime.replace("T", " ")} GMT`);
    const endTimeInTimestamp = Date.parse(`${endTime.replace("T", " ")} GMT`);
    if (Number.isNaN(startTimeInTimestamp)) {setStartTimeError("Start time cannot be blank"); return}
    if (Number.isNaN(endTimeInTimestamp)) {setEndTimeError("End time cannot be blank"); return}
    if (startTimeInTimestamp + 24 * 7 * 3600 * 1000 < endTimeInTimestamp) setStartTimeError("The duration between Start time and End time must be less than 7 days")
    if (startTimeInTimestamp >= endTimeInTimestamp) setStartTimeError("Start time needs to be before End time")
    if (startTimeInTimestamp <= Date.now()) setStartTimeError("Start time needs to be after now")

  }, [startTime, endTime])

  useEffect(() => {
    const _totalAmount1 = Number(total)
    const _feeCurrency = tokenData.mainFee === "50" ? Number(softCap) / 20 : Number(softCap) / 50
    const _totalAmount2 = (Number(liquidity) / 100 * (Number(softCap) - _feeCurrency) / Number(softCap) * _totalAmount1)
    const _feeToken = tokenData.mainFee === "50" ? 0 : _totalAmount1 / 50

    const _totalAmount = _totalAmount1 + _totalAmount2 + _feeToken
    setTotalAmount(_totalAmount)

  }, [total, liquidity, tokenData])

  const enabled = 
    total !== "" &&
    totalError === "" &&
    softCap !== "" &&
    softCapError === "" &&
    (
      isMax ? (
        maximumBuy !== "" &&
        maximumBuyError === ""
      ) : true
    ) &&
    startTime !== "" &&
    startTimeError === "" &&
    endTime !== "" &&
    endTimeError === "" &&
    liquidity !== "" &&
    liquidityError === "" && 
    lockTime !== "" &&
    lockTimeError === "" &&
    (
      isVesting ? (
        vestingFirst !== "" &&
        vestingFirstError === "" && 
        vestingPeriod !== "" &&
        vestingPeriodError === "" && 
        vestingEach !== "" &&
        vestingEachError === ""
      ) : true
    )

  return (
    <Box p="4px" position="inherit">
      <FormHeader title={t('Create Launchpad')} subTitle={t('')} />
      <FormContainer>
        <ProgressSteps steps={[true, false, false]} />
        <Box>
          <Text fontSize="16px" bold color="primary">{t("2. DeFi FairLaunch Info")}</Text>
          <Text fontSize="12px">{t("Enter the launchpad information that you want to raise , that should be enter all details about your presale")}</Text>
        </Box>
        <Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Total Selling Amount*")}</Text>
            <Input
              type="number"
              placeholder={t('100')}
              scale="md"
              value={total}
              onChange={(e) => setTotal(e.target.value)}
            />
            {totalError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {totalError}
            </Text>}
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Whitelist")}</Text>
            <Flex>
              <Flex alignItems="center" onClick={() => setWhitelist(false)}>
                <Checkbox
                  scale="sm"
                  checked={whitelist === false}
                  readOnly
                />
                <Text ml="10px">{t("Disable")}</Text>
              </Flex>
              <Flex alignItems="center" ml="25px" onClick={() => setWhitelist(true)}>
                <Checkbox
                  scale="sm"
                  checked={whitelist === true}
                  readOnly
                />
                <Text ml="10px">{t("Enable")}</Text>
              </Flex>
            </Flex>
            <Text color="text" fontSize="14px">{t("You can enable/disable whitelist anytime.")}</Text>
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Softcap (%symbol%)*", {symbol: tokenData.currency.symbol})}</Text>
            <Input
              type="number"
              placeholder={t('Ex: 10')}
              scale="md"
              value={softCap}
              onChange={(e) => setSoftCap(e.target.value)}
            />
            {softCapError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {softCapError}
            </Text>}
          </Box>
          <Box mb="20px">
            <Flex alignItems="center" mb="10px" onClick={() => setIsMax(!isMax)}>
              <Checkbox
                scale="sm"
                checked={isMax}
                readOnly
              />
              <Text ml="10px">{t("Setting max contribution?")}</Text>
            </Flex>
            {isMax && <>
              <Text fontSize="12px" color="primary">{t("Maximum buy (%symbol%)*", {symbol: tokenData.currency.symbol})}</Text>
              <Input
                type="number"
                placeholder={t('1%symbol%', {symbol: tokenData.currency.symbol})}
                scale="md"
                value={maximumBuy}
                onChange={(e) => setMaximumBuy(e.target.value)}
              />
              {maximumBuyError !== "" && <Text color="failure" fontSize="14px" px="4px">
                {maximumBuyError}
              </Text>}
            </>}
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Liquidity (%)*")}</Text>
            <Input
              type="number"
              placeholder={t('Ex: 52')}
              scale="md"
              value={liquidity}
              onChange={(e) => setLiquidity(e.target.value)}
            />
            {liquidityError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {liquidityError}
            </Text>}
            <Box mt="10px">
              <Text color="text" fontSize="14px">{t("Enter the percentage of raised funds that should be allocated to Liquidity on Duckstail (Min 51%, Max 100%)")}</Text>
              <Text color="text" fontSize="14px">{t("If I spend 1 %symbol% on how many tokens will I receive? Usually this amount is lower than presale rate to allow for a higher listing price on Duckstail", {symbol: tokenData.currency.symbol})}</Text>
            </Box>
          </Box>
          <Box mb="20px">
            <Flex flexDirection={["column", "column", "column", "row"]}>
              <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                <Text fontSize="12px" color="primary">{t("Start time (UTC)")}</Text>
                <Input
                  type="datetime-local"
                  placeholder={t("Select date")}
                  scale="md"
                  value={startTime}
                  onChange={(e) => setStartTime(e.target.value)}
                />
                {startTimeError !== "" && <Text color="failure" fontSize="14px" px="4px">
                  {startTimeError}
                </Text>}
              </Box>
              <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                <Text fontSize="12px" color="primary">{t("End time (UTC)")}</Text>
                <Input
                  type="datetime-local"
                  placeholder={t("Select date")}
                  scale="md"
                  value={endTime}
                  onChange={(e) => setEndTime(e.target.value)}
                />
                {endTimeError !== "" && <Text color="failure" fontSize="14px" px="4px">
                  {endTimeError}
                </Text>}
              </Box>
            </Flex>
          </Box>
          <Box mb="20px">
            <Text fontSize="12px" color="primary">{t("Liquidity lockup (days)*")}</Text>
            <Input
              type="number"
              placeholder={t('0')}
              scale="md"
              value={lockTime}
              onChange={(e) => setLockTime(e.target.value)}
            />
            {lockTimeError !== "" && <Text color="failure" fontSize="14px" px="4px">
              {lockTimeError}
            </Text>}
          </Box>
          <Box mb="20px">
            <Flex alignItems="center" mb="10px" onClick={() => setIsVesting(!isVesting)}>
              <Checkbox
                scale="sm"
                checked={isVesting}
                readOnly
              />
              <Text ml="10px">{t("Using Vesing Contributor?")}</Text>
            </Flex>
            {isVesting && <Message variant="warning" icon={false} p="8px 12px">
              <MessageText color="text">
                <span>{t('Vesting Contributor does not support rebase tokens.')}</span>
              </MessageText>
            </Message>}
          </Box>
          {isVesting && <>
            <Box mb="20px">
              <Text fontSize="12px" color="primary">{t("First release for presale (%)*")}</Text>
              <Input
                type="number"
                placeholder={t("Ex: 40%")}
                scale="md"
                value={vestingFirst}
                onChange={(e) => setVestingFirst(e.target.value)}
              />
              {vestingFirstError !== "" && <Text color="failure" fontSize="14px" px="4px">
                {vestingFirstError}
              </Text>}
            </Box>
            <Box mb="20px">
              <Flex flexDirection={["column", "column", "column", "row"]}>
                <Box width="100%" mb={["15px", "15px", "15px", "0"]}>
                  <Text fontSize="12px" color="primary">{t("Vesting period each cycle (days)*", {symbol: tokenData.currency.symbol})}</Text>
                  <Input
                    type="number"
                    placeholder={t('Ex: 365 days')}
                    scale="md"
                    value={vestingPeriod}
                    onChange={(e) => setVestingPeriod(e.target.value)}
                  />
                  {vestingPeriodError !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {vestingPeriodError}
                  </Text>}
                </Box>
                <Box ml={["0", "0", "0", "25px"]} mb={["15px", "15px", "15px", "0"]} width="100%">
                  <Text fontSize="12px" color="primary">{t("Presale token release each cycle (%)*", {symbol: tokenData.currency.symbol})}</Text>
                  <Input
                    type="number"
                    placeholder={t('Ex: 20%')}
                    scale="md"
                    value={vestingEach}
                    onChange={(e) => setVestingEach(e.target.value)}
                  />
                  {vestingEachError !== "" && <Text color="failure" fontSize="14px" px="4px">
                    {vestingEachError}
                  </Text>}
                </Box>
              </Flex>
            </Box>
          </>}
          <Flex mb="20px" justifyContent="center">
            <Text fontSize="16px" color="text">{t("Need %amount% %symbol% to create launchpad.", {amount: totalAmount.toLocaleString(), symbol: tokenData.tokenSymbol})}</Text>
          </Flex>
        </Box>
        {!account ? <ConnectWalletButton /> : <Flex width="100%">
          <Button
            width="100%"
            mr="15px"
            onClick={handlePrev}
          >{t("Prev")}</Button>
          <Button
            width="100%"
            onClick={handleNext}
            disabled={!enabled}
          >{t("Next")}</Button>
        </Flex>}
      </FormContainer>
    </Box>
  )
}
