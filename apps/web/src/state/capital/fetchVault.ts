import BigNumber from 'bignumber.js'
import { getUnixTime } from 'date-fns'
import { BIG_TEN, BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { DCP, SDCP } from '@pancakeswap/tokens'
import erc20 from 'config/abi/erc20.json'
import multiCallAbi from 'config/abi/Multicall.json'
import stakingAbi from 'config/abi/dcpStaking.json'
import { multicallv3 } from 'utils/multicall'
import { getDcpStakingAddress, getMulticallAddress } from 'utils/addressHelpers'
import { SerializedVault } from '@pancakeswap/capital'

const multicallAddress = getMulticallAddress()

const fetchVaultCalls = (chainId: number) => {
  return [
    {
      abi: erc20,
      address: DCP[chainId].address,
      name: 'totalSupply',
    },
    {
      abi: erc20,
      address: SDCP[chainId].address,
      name: 'circulatingSupply',
    },
    {
      abi: multiCallAbi,
      address: multicallAddress,
      name: 'getBlockNumber',
    },
    {
      abi: stakingAbi,
      address: getDcpStakingAddress(chainId),
      name: 'epoch',
    },
    {
      abi: stakingAbi,
      address: getDcpStakingAddress(chainId),
      name: 'index',
    }
  ]
}

export const fetchVaultData = async (chainId: number): Promise<any[]> => {
  const bondMultiCallResult = await multicallv3({ calls: fetchVaultCalls(chainId), chainId })
  return bondMultiCallResult
}

function vaultTransformer (marketPrice: BigNumber, vaultResult : any[], treasuryBalance: BigNumber) {
  const [
    totalSupply,
    circSupply,
    blockNumber,
    epoch,
    index
  ] = vaultResult

  const marketCap = new BigNumber(totalSupply).times(marketPrice).div(BIG_TEN.pow(9))
  const stakingTVL = new BigNumber(circSupply).times(marketPrice).div(BIG_TEN.pow(9))
  const stakingReward = epoch.distribute;
  const stakingRebase = new BigNumber(stakingReward).div(new BigNumber(circSupply));
  const fiveDayRate = stakingRebase.plus(1).pow(5 * 3).minus(1)
  const stakingAPY = stakingRebase.plus(1).pow(365 * 3).minus(1)


  return {
    currentIndex: index,
    totalSupply,
    marketCap: marketCap.toJSON(),
    circSupply,
    fiveDayRate: fiveDayRate.toJSON(),
    treasuryBalance: treasuryBalance.toJSON(),
    stakingAPY: stakingAPY.toJSON(),
    stakingTVL: stakingTVL.toJSON(),
    stakingRebase: stakingRebase.toJSON(),
    marketPrice: marketPrice.toJSON(),
    currentBlock: blockNumber,
    currentBlockTime: getUnixTime(new Date()),
    nextRebase: epoch.endTime,
  }
}

const fetchVault = async (marketPrice: BigNumber, treasuryBalance: BigNumber, chainId: number): Promise<SerializedVault> => {
  const [vaultResult] = await Promise.all([
    fetchVaultData(chainId)
  ])

  return vaultTransformer(marketPrice, vaultResult, treasuryBalance)
}

export default fetchVault
