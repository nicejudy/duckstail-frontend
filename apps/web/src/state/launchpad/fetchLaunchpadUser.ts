import BigNumber from 'bignumber.js'
import erc20ABI from 'config/abi/erc20.json'
import launchpadAbi from 'config/abi/launchpadForETH.json'
import { multicallv2, multicallv3 } from 'utils/multicall'
import { SerializedLaunchpadUserData } from './types'

const fetchLaunchpadUser = async (
  account: string,
  launchpad: string,
  token: string,
  chainId: number,
): Promise<any[]> => {
  const calls = [
    {
      abi: erc20ABI,
      address: token,
      name: 'allowance',
      params: [account, launchpad],
    },
    {
      abi: erc20ABI,
      address: token,
      name: 'balance',
      params: [account],
    },
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'deposits',
      params: [account],
    },
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'claimed',
      params: [account],
    },
    {
      abi: launchpadAbi,
      address: launchpad,
      name: 'whiteList',
      params: [account],
    },
  ]

  const userDataMultiCallResult = await multicallv3({ calls, chainId, allowFailure: true })
  return userDataMultiCallResult
}

function launchpadTransformer (launchpadUserDataResult : any[]) {
  const [
    allowance,
    balance,
    deposit,
    claimed,
    whitelisted
  ] = launchpadUserDataResult

  return {
    allowance: new BigNumber(allowance[0]._hex).toJSON(),
    balance: new BigNumber(balance[0]._hex).toJSON(),
    deposit: new BigNumber(deposit[0]._hex).toJSON(),
    claimed: new BigNumber(claimed[0]._hex).toJSON(),
    whitelisted
  }
}

const fetchLaunchpadUserData = async (launchpad: string, account: string, chainId: number): Promise<SerializedLaunchpadUserData> => {
  const [[token]] = await Promise.all([
    multicallv2({
      abi: launchpadAbi,
      calls: [
        {
          address: launchpad,
          name: "buyToken"
        }
      ],
      chainId,
    })
  ])

  const [launchpadUserDataResult] = await Promise.all([
    fetchLaunchpadUser(launchpad, account, token, chainId)
  ])

  return launchpadTransformer(launchpadUserDataResult)
}

export default fetchLaunchpadUserData