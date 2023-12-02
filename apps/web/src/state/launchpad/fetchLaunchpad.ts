import BigNumber from 'bignumber.js'
import launchpadAbi from 'config/abi/launchpadForETH.json'
import fairLaunchAbi from 'config/abi/fairLaunchForETH.json'
import { multicallv2, multicallv3 } from 'utils/multicall'
import { SerializedLaunchpad } from './types'

const LAUNCHPAD_VARIABLES = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'hardCap', 'minBuy', 'maxBuy', 'rate', 'listingRate', 'lockPeriod', 'isAutoListing', 'vestingFirst', 'vestingPeriod', 'vestingEach', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'tokenBackAddress', 'whiteListEnableTime', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'banner', 'whitelist']
const FAIRLAUNCH_VARIABLES = ['presaleType', 'token', 'buyToken', 'presaleStartTimestamp', 'presaleEndTimestamp', 'softCap', 'maxBuy', 'total', 'listingRate', 'lockPeriod', 'vestingFirst', 'vestingPeriod', 'vestingEach', 'mainFee', 'tokenFee', 'liquidity', 'router', 'locker', 'feeAddress', 'totalDepositedBalance', 'totalClaimedAmount', 'investors', 'refundable', 'claimable', 'initialized', 'info', 'logoUrl', 'website', 'twitter', 'facebook', 'github', 'telegram', 'instagram', 'discord', 'reddit', 'banner', 'whitelist']

const calls = (launchpad: string, presaleType: string) => {
  if (presaleType === "standard")
    return LAUNCHPAD_VARIABLES.map((val) => { return {
      abi: launchpadAbi,
      address: launchpad,
      name: val,
    }})
  return FAIRLAUNCH_VARIABLES.map((val) => { return {
    abi: fairLaunchAbi,
    address: launchpad,
    name: val,
  }})
}

export const fetchLaunchpadData = async (launchpad: string, presaleType: string, chainId: number): Promise<any[]> => {
  const launchpadMultiCallResult = await multicallv3({ calls: calls(launchpad, presaleType), chainId, allowFailure: true })
  return launchpadMultiCallResult
}

function launchpadTransformer (chainId: number, launchpadResult : any[]) {
  const [
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    hardCap,
    minBuy,
    maxBuy,
    rate,
    listingRate,
    lockPeriod,
    isAutoListing,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    tokenBackAddress,
    whiteListEnableTime,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    banner,
    whitelist
  ] = launchpadResult

  return {
    chainId,
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp: new BigNumber(presaleStartTimestamp[0]._hex).toJSON(),
    presaleEndTimestamp: new BigNumber(presaleEndTimestamp[0]._hex).toJSON(),
    softCap: new BigNumber(softCap[0]._hex).toJSON(),
    hardCap: new BigNumber(hardCap[0]._hex).toJSON(),
    minBuy: new BigNumber(minBuy[0]._hex).toJSON(),
    maxBuy: new BigNumber(maxBuy[0]._hex).toJSON(),
    rate: new BigNumber(rate[0]._hex).toJSON(),
    listingRate: new BigNumber(listingRate[0]._hex).toJSON(),
    lockPeriod: new BigNumber(lockPeriod[0]._hex).toJSON(),
    isAutoListing,
    vestingFirst: new BigNumber(vestingFirst[0]._hex).toJSON(),
    vestingPeriod: new BigNumber(vestingPeriod[0]._hex).toJSON(),
    vestingEach: new BigNumber(vestingEach[0]._hex).toJSON(),
    mainFee: new BigNumber(mainFee[0]._hex).toJSON(),
    tokenFee: new BigNumber(tokenFee[0]._hex).toJSON(),
    liquidity: new BigNumber(liquidity[0]._hex).toJSON(),
    router,
    locker,
    feeAddress,
    tokenBackAddress,
    whiteListEnableTime: new BigNumber(whiteListEnableTime[0]._hex).toJSON(),
    totalDepositedBalance: new BigNumber(totalDepositedBalance[0]._hex).toJSON(),
    totalClaimedAmount: new BigNumber(totalClaimedAmount[0]._hex).toJSON(),
    investors: new BigNumber(investors[0]._hex).toJSON(),
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    banner,
    whitelist
  }
}

function fairlaunchTransformer (chainId: number, launchpadResult : any[]) {
  const [
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp,
    presaleEndTimestamp,
    softCap,
    maxBuy,
    total,
    listingRate,
    lockPeriod,
    vestingFirst,
    vestingPeriod,
    vestingEach,
    mainFee,
    tokenFee,
    liquidity,
    router,
    locker,
    feeAddress,
    totalDepositedBalance,
    totalClaimedAmount,
    investors,
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    banner,
    whitelist
  ] = launchpadResult

  return {
    chainId,
    presaleType,
    token,
    buyToken,
    presaleStartTimestamp: new BigNumber(presaleStartTimestamp[0]._hex).toJSON(),
    presaleEndTimestamp: new BigNumber(presaleEndTimestamp[0]._hex).toJSON(),
    softCap: new BigNumber(softCap[0]._hex).toJSON(),
    maxBuy: new BigNumber(maxBuy[0]._hex).toJSON(),
    total: new BigNumber(total[0]._hex).toJSON(),
    listingRate: new BigNumber(listingRate[0]._hex).toJSON(),
    lockPeriod: new BigNumber(lockPeriod[0]._hex).toJSON(),
    vestingFirst: new BigNumber(vestingFirst[0]._hex).toJSON(),
    vestingPeriod: new BigNumber(vestingPeriod[0]._hex).toJSON(),
    vestingEach: new BigNumber(vestingEach[0]._hex).toJSON(),
    mainFee: new BigNumber(mainFee[0]._hex).toJSON(),
    tokenFee: new BigNumber(tokenFee[0]._hex).toJSON(),
    liquidity: new BigNumber(liquidity[0]._hex).toJSON(),
    router,
    locker,
    feeAddress,
    totalDepositedBalance: new BigNumber(totalDepositedBalance[0]._hex).toJSON(),
    totalClaimedAmount: new BigNumber(totalClaimedAmount[0]._hex).toJSON(),
    investors: new BigNumber(investors[0]._hex).toJSON(),
    refundable,
    claimable,
    initialized,
    info,
    logoUrl,
    website,
    twitter,
    facebook,
    github,
    telegram,
    instagram,
    discord,
    reddit,
    banner,
    whitelist
  }
}

const fetchLaunchpad = async (launchpad: string, chainId: number): Promise<SerializedLaunchpad> => {
  const [[presaleType]] = await Promise.all([
    multicallv2({
      abi: launchpadAbi,
      calls: [
        {
          address: launchpad,
          name: "presaleType"
        }
      ],
      chainId,
    })
  ])

  const [launchpadResult] = await Promise.all([
    fetchLaunchpadData(launchpad, presaleType, chainId)
  ])

  if (presaleType === "standard")
    return launchpadTransformer(chainId, launchpadResult)
  return fairlaunchTransformer(chainId, launchpadResult)
}

export default fetchLaunchpad
