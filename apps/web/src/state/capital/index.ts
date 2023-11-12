import { getFarmConfig } from '@pancakeswap/farms/constants'
import { createFarmFetcher, SerializedFarm, SerializedFarmsState } from '@pancakeswap/farms'
import { getBondConfig, SerializedBond, SerializedBondUserData, SerializedCapitalState, SerializedVault, supportedChainId } from '@pancakeswap/capital'
import { ChainId } from '@pancakeswap/sdk'
import { createAsyncThunk, createSlice, isAnyOf } from '@reduxjs/toolkit'
import type {
  UnknownAsyncThunkFulfilledAction,
  UnknownAsyncThunkPendingAction,
  UnknownAsyncThunkRejectedAction,
} from '@reduxjs/toolkit/dist/matchers'
import BigNumber from 'bignumber.js'
import erc20 from 'config/abi/erc20.json'
import stringify from 'fast-json-stable-stringify'
import keyBy from 'lodash/keyBy'
import type { AppState } from 'state'
import { getDcpTreasuryAddress, getMasterChefAddress } from 'utils/addressHelpers'
import { getBalanceAmount } from '@pancakeswap/utils/formatBalance'
import { DCP, USDT } from '@pancakeswap/tokens'
import multicall, { multicallv2 } from 'utils/multicall'
import { chains } from 'utils/wagmi'
import { usePriceByPairs } from 'hooks/useBUSDPrice'
import { resetUserState } from '../global/actions'
import fetchBonds from './fetchBonds'
import fetchVault from './fetchVault'
import {
  fetchBondUserAllowances,
  fetchBondUserEarnings,
  fetchBondUserInfos,
  fetchBondUserTokenBalances,
} from './fetchBondUser'
// import { useDCPUSDTPrice } from './hooks'

const fetchCapitalPublicData = async ({ ids, chainId }): Promise<[SerializedBond[], SerializedVault]> => {
  const bondsConfig = await getBondConfig(chainId)
  const bondsCanFetch = bondsConfig.filter(
    (bondConfig) => ids.includes(bondConfig.id),
  )

  const [[treasuryBalances]] = await Promise.all([
    multicallv2({
      abi: erc20,
      calls: bondsCanFetch.map((bond) => { return {
          address: bond.token.address,
          name: "balanceOf",
          params: [getDcpTreasuryAddress(chainId)],
        }}),
      chainId,
    })
  ])

  const [[reserves]] = await Promise.all([
    multicallv2({
      abi: erc20,
      calls: [
        {
          address: "0x168A4C3f7Bc744b05381D8F18588698179849556",
          name: "getReserves"
        }
      ],
      chainId,
    })
  ])

  const marketPrice = new BigNumber(reserves[1]).div(new BigNumber(reserves[0]))

  const bonds = await fetchBonds(marketPrice, bondsCanFetch, treasuryBalances, chainId)

  const totalTreasuryBalanceBN = treasuryBalances.reduce((tokenBalance0, tokenBalance1) => new BigNumber(tokenBalance0).plus(new BigNumber(tokenBalance1)), 0);
  const vault = await fetchVault(marketPrice, totalTreasuryBalanceBN, chainId)
  return [bonds, vault]
}

const initialState: SerializedCapitalState = {
  bonds: [],
  vault: null,
  chainId: null,
  userDataLoaded: false,
  loadingKeys: {},
}

// Async thunks
export const fetchInitialCapitalData = createAsyncThunk<
  { bonds: SerializedBond[]; chainId: number },
  { chainId: number },
  {
    state: AppState
  }
>('capital/fetchInitialCapitalData', async ({ chainId }) => {
  const bondDataList = await getBondConfig(chainId)
  return {
    bonds: bondDataList.map((bond) => ({
      ...bond,
      userData: {
        allowance: '0',
        balance: '0',
        interestDue: '0',
        bondMaturationBlock: '0',
        pendingPayout: '0',
      },
    })),
    chainId,
  }
})

export const fetchCapitalPublicDataAsync = createAsyncThunk<
  [SerializedBond[], SerializedVault],
  { ids: number[]; chainId: number; },
  {
    state: AppState
  }
>(
  'capital/fetchCapitalPublicDataAsync',
  async ({ ids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.capital.chainId !== chainId) {
      await dispatch(fetchInitialCapitalData({ chainId }))
    }
    const chain = chains.find((c) => c.id === chainId)
    if (!chain || !supportedChainId.includes(chainId)) throw new Error('chain not supported')
    try {
      return fetchCapitalPublicData({ ids, chainId })
    } catch (error) {
      console.error(error)
      throw error
    }
  },
  {
    condition: (arg, { getState }) => {
      const { capital } = getState()
      if (capital.loadingKeys[stringify({ type: fetchCapitalPublicDataAsync.typePrefix, arg })]) {
        console.debug('bonds action is fetching, skipping here')
        return false
      }
      return true
    },
  },
)

async function getBondsUserValue(bonds, account, chainId) {
  const [userBondAllowances, userBondTokenBalances, userBondInfos, userBondEarnings] = await Promise.all([
    fetchBondUserAllowances(account, bonds, chainId),
    fetchBondUserTokenBalances(account, bonds, chainId),
    fetchBondUserInfos(account, bonds, chainId),
    fetchBondUserEarnings(account, bonds, chainId),
  ])

  const bondsUserValue = userBondAllowances.map((_, index) => {

    const bondMaturationBlock = new BigNumber(userBondInfos[index].vesting).plus(new BigNumber(userBondInfos[index].lastTime))

    return {
      allowance: userBondAllowances[index],
      balance: userBondTokenBalances[index],
      interestDue: userBondInfos[index].payout,
      bondMaturationBlock: bondMaturationBlock.toJSON(),
      pendingPayout: userBondEarnings[index],
    }
  })

  return bondsUserValue
}

export const fetchCapitalUserDataAsync = createAsyncThunk<
  SerializedBondUserData[],
  { account: string; ids: number[]; chainId: number },
  {
    state: AppState
  }
>(
  'capital/fetchCapitalUserDataAsync',
  async ({ account, ids, chainId }, { dispatch, getState }) => {
    const state = getState()
    if (state.capital.chainId !== chainId) {
      await dispatch(fetchInitialCapitalData({ chainId }))
    }

    const bondsConfig = await getBondConfig(chainId)
    const bondsCanFetch = bondsConfig.filter(
      (bondConfig) => ids.includes(bondConfig.id)
    )

    return getBondsUserValue(bondsCanFetch, account, chainId)
  },
  {
    condition: (arg, { getState }) => {
      const { capital } = getState()
      if (capital.loadingKeys[stringify({ type: fetchCapitalUserDataAsync.typePrefix, arg })]) {
        console.debug('capital user is fetching, skipping here')
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

export const capitalSlice = createSlice({
  name: 'Capital',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(resetUserState, (state) => {
      state.bonds = state.bonds.map((bond) => {
        return {
          ...bond,
          userData: {
            allowance: '0',
            balance: '0',
            interestDue: '0',
            bondMaturationBlock: '0',
            pendingPayout: '0',
          },
        }
      })
      state.userDataLoaded = false
    })
    // Init capital data
    builder.addCase(fetchInitialCapitalData.fulfilled, (state, action) => {
      const { bonds, chainId } = action.payload
      state.bonds = bonds
      state.chainId = chainId
    })

    // Update capital with live data
    builder.addCase(fetchCapitalPublicDataAsync.fulfilled, (state, action) => {
      const [bondPayload, vaultPayload] = action.payload
      const bondPayloadIdMap = keyBy(bondPayload, 'id')

      state.bonds = state.bonds.map((bond) => {
        const liveBondData = bondPayloadIdMap[bond.id]
        return { ...bond, ...liveBondData }
      })
      state.vault = vaultPayload
    })

    // Update capital with user data
    builder.addCase(fetchCapitalUserDataAsync.fulfilled, (state, action) => {
      const userDataMap = keyBy(action.payload, 'id')
      state.bonds = state.bonds.map((bond) => {
        const userDataEl = userDataMap[bond.id]
        if (userDataEl) {
          return { ...bond, userData: userDataEl }
        }
        return bond
      })
      state.userDataLoaded = true
    })

    builder.addMatcher(isAnyOf(fetchCapitalPublicDataAsync.pending, fetchCapitalPublicDataAsync.pending), (state, action) => {
      state.loadingKeys[serializeLoadingKey(action, 'pending')] = true
    })
    builder.addMatcher(
      isAnyOf(fetchCapitalUserDataAsync.fulfilled, fetchCapitalUserDataAsync.fulfilled),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'fulfilled')] = false
      },
    )
    builder.addMatcher(
      isAnyOf(fetchCapitalPublicDataAsync.rejected, fetchCapitalPublicDataAsync.rejected),
      (state, action) => {
        state.loadingKeys[serializeLoadingKey(action, 'rejected')] = false
      },
    )
  },
})

export default capitalSlice.reducer
