import { ChainId } from "@pancakeswap/sdk"

export interface SerializedLaunchpadPublicData {
    chainId: number
    presaleType: string
    token: string
    buyToken: string
    presaleStartTimestamp: string
    presaleEndTimestamp: string
    softCap: string
    hardCap?: string
    minBuy?: string
    maxBuy: string
    total?: string
    rate?: string
    listingRate: string
    lockPeriod: string
    isAutoListing?: boolean
    vestingFirst: string
    vestingPeriod: string
    vestingEach: string
    mainFee: string
    tokenFee: string
    liquidity: string
    router: string
    locker: string
    feeAddress: string
    tokenBackAddress?: string
    whiteListEnableTime?: string
    totalDepositedBalance: string
    totalClaimedAmount: string
    investors: string
    refundable: boolean
    claimable: boolean
    initialized: boolean
    info: string
    logoUrl: string
    website: string
    twitter: string
    facebook: string
    github: string
    telegram: string
    instagram: string
    discord: string
    reddit: string
    banner: string
    whitelist: string
  }
  
  export interface SerializedLaunchpadUserData {
    allowance: string
    balance: string
    deposit: string
    claimed: string
    whitelisted: boolean
  }

  export interface SerializedLaunchpad extends SerializedLaunchpadPublicData {
    userData?: SerializedLaunchpadUserData
  }

  export interface SerializedLaunchpadState {
    address: string
    data: SerializedLaunchpad
    chainId: number
    userDataLoaded: boolean
    loadingKeys?: Record<string, boolean>
  }

  export const supportedChainId = [ChainId.ARBITRUM]