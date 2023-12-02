import { ChainId } from '@pancakeswap/sdk'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import stringify from 'fast-json-stable-stringify'
import type { AppState } from 'state'
import { chains } from 'utils/wagmi'
import { resetUserState } from '../global/actions'
import fetchLaunchpad from './fetchLaunchpad'
import { SerializedLaunchpad, SerializedLaunchpadState, SerializedLaunchpadUserData, supportedChainId } from './types'
import fetchLaunchpadUserData from './fetchLaunchpadUser'

const initialState: SerializedLaunchpadState = {
  address: "",
  data: null,
  chainId: null,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialLaunchpadData = createAsyncThunk<
  { launchpad: SerializedLaunchpad, chainId: number },
  { address: string, chainId: number },
  {
    state: AppState
  }
>('launchpad/fetchInitialLaunchpadData', async ({ address, chainId }) => {
  return {
    address,
    launchpad: {
      chainId: ChainId.ARBITRUM,
      presaleType: "standard",
      token: "",
      buyToken: "",
      presaleStartTimestamp: "",
      presaleEndTimestamp: "",
      softCap: "",
      hardCap: "",
      minBuy: "",
      maxBuy: "",
      total: "",
      rate: "",
      listingRate: "",
      lockPeriod: "",
      isAutoListing: false,
      vestingFirst: "",
      vestingPeriod: "",
      vestingEach: "",
      mainFee: "",
      tokenFee: "",
      liquidity: "",
      router: "",
      locker: "",
      feeAddress: "",
      tokenBackAddress: "",
      whiteListEnableTime: "",
      totalDepositedBalance: "",
      totalClaimedAmount: "",
      investors: "",
      refundable: false,
      claimable: false,
      initialized: false,
      info: "",
      logoUrl: "",
      website: "",
      twitter: "",
      facebook: "",
      github: "",
      telegram: "",
      instagram: "",
      discord: "",
      reddit: "",
      banner: "",
      whitelist: "",
      userData: {
        allowance: "0",
        balance: "0",
        deposit: "0",
        claimed: "0",
        whitelisted: false,
      }
    },
    chainId,
  }
})

export const fetchLaunchpadPublicDataAsync = createAsyncThunk<
  SerializedLaunchpad,
  { address: string; chainId: number; },
  {
    state: AppState
  }
>(
  'launchpad/fetchLaunchpadPublicDataAsync',
  async ({ address, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.launchpad.chainId !== chainId) {
      await dispatch(fetchInitialLaunchpadData({ address, chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !supportedChainId.includes(chainId)) throw new Error('chain not supported')
    try {
      return await fetchLaunchpad(address, chainId)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { launchpad } = getState()
      if (launchpad.loadingKeys[stringify({ type: fetchLaunchpadPublicDataAsync.typePrefix, arg })]) {
        console.debug('launchpad action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

export interface BondUserResponseData {
  id: number
  allowance: string
  balance: string
  interestDue: string
  bondMaturationBlock: string
  pendingPayout: string
}

export const fetchLaunchpadUserDataAsync = createAsyncThunk<
  SerializedLaunchpadUserData,
  { account: string; address: string; chainId: number },
  {
    state: AppState
  }
>(
  'launchpad/fetchLaunchpadUserDataAsync',
  async ({ account, address, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.launchpad.chainId !== chainId) {
      await dispatch(fetchInitialLaunchpadData({ address, chainId }))
    }

    try {
      return fetchLaunchpadUserData(address, account, chainId)
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { launchpad } = getState()
      if (launchpad.loadingKeys[stringify({ type: fetchLaunchpadUserDataAsync.typePrefix, arg })]) {
        console.debug('launchpad user is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

type UnknownAsyncThunkFulfilledOrPendingAction =
  | UnknownAsyncThunkFulfilledAction
  | UnknownAsyncThunkPendingAction
  | UnknownAsyncThunkRejectedAction

const serializeLoadingKey = (
  action: UnknownAsyncThunkFulfilledOrPendingAction,
  suffix: UnknownAsyncThunkFulfilledOrPendingAction['meta']['requestStatus'],
) => {
  const type = action.type.split(`/${suffix}`)[0]
  return stringify({
    arg: action.meta.arg,
    type,
  })
}

export const launchpadSlice = createSlice({
  name: 'Launchpad',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.data = {
        ...state.data,
        userData: {
          allowance: "0",
          balance: "0",
          deposit: "0",
          claimed: "0",
          whitelisted: false
        }
      }
      state.userDataLoaded = false
    })
    // Init launchpad data
    builder.addCase(fetchInitialLaunchpadData.fulfilled, (state, action) => {
      const { launchpad, chainId } = action.payload
      state.data = launchpad
      state.chainId = chainId
    })

    // Update launchpad with live data
    builder.addCase(fetchLaunchpadPublicDataAsync.fulfilled, (state, action) => {
      const data= action.payload
      state.data = {...state.data, ...data}
    })

    // Update capital with user data
    builder.addCase(fetchLaunchpadUserDataAsync.fulfilled, (state, action) => {
      const data = action.payload
      state.data = {...state.data, userData: data}
      state.userDataLoaded = true
    })

    builder.addMatcher(isAnyOf(fetchLaunchpadPublicDataAsync.pending, fetchLaunchpadPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchLaunchpadUserDataAsync.fulfilled, fetchLaunchpadUserDataAsync.fulfilled),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(fetchLaunchpadPublicDataAsync.rejected, fetchLaunchpadPublicDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default launchpadSlice.reducer
