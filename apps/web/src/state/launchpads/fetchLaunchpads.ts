import BigNumber from 'bignumber.js'
import launchpadFactoryAbi from 'config/abi/launchpadFactory.json'
import erc20ABI from 'config/abi/erc20.json'
import { multicallv2, multicallv3 } from 'utils/multicall'
import { getLaunchpadFactoryAddress } from 'utils/addressHelpers'
import { SerializedLaunchpadData } from './types'
import { ZERO_ADDRESS } from 'config/constants'

const calls = (chainId: number, size: number, cursor: number) => {
  const launchpadFactory = getLaunchpadFactoryAddress(chainId)
  return [
    {
      abi: launchpadFactoryAbi,
      address: launchpadFactory,
      name: "getLaunchpads",
      params: [size, cursor]
    }
  ]
}

export const fetchLaunchpadsData = async (chainId: number, size: number, cursor: number): Promise<any[]> => {
  const launchpadsMultiCallResult = await multicallv3({ calls: calls(chainId, size, cursor), chainId, allowFailure: true })
  return launchpadsMultiCallResult
}

const token_calls = (token: string) => {
  return [
    {
      address: token,
      name: "name",
    },
    {
      address: token,
      name: "symbol",
    },
    {
      address: token,
      name: "decimals",
    }
  ]
}

const launchpadsTransformer = async (chainId: number, launchpadsResult : any[]) : Promise<any[]> => {
  const [launchpads] = launchpadsResult

  const now = Date.now() / 1000

  let result = []

  for (let index = 0; index < launchpads[0].length; index++) {
    const lp = launchpads[0][index];

    let status = ""

    if (lp.refundable)
      status = "canceled"
    else if (lp.claimable)
      status = "success"
    else if (new BigNumber(lp.startTime._hex).toNumber() > now)
      status = "upcoming"
    else if (new BigNumber(lp.startTime._hex).toNumber() < now && new BigNumber(lp.endTime._hex).toNumber() > now)
      status = "live"
    else if (new BigNumber(lp.endTime._hex).toNumber() < now)
      status = "ended"
    else
      status = ""

    const [[name], [symbol], [decimals]] = await multicallv2({
      abi: erc20ABI,
      calls: token_calls(lp.token),
      chainId,
    })

    let name1 = "", symbol1 = "", decimals1 = "0"

    if (lp.buyToken !== ZERO_ADDRESS) {
      const [[_name1], [_symbol1], [_decimals1]] = await multicallv2({
        abi: erc20ABI,
        calls: token_calls(lp.buyToken),
        chainId,
      })
      name1 = _name1
      symbol1 = _symbol1
      decimals1 = _decimals1
    }

    result.push({
      chainId,
      presaleType: lp.presaleType,
      address: lp.addr,
      logoUrl: lp.logoUrl,
      token: lp.token,
      buyToken: lp.buyToken,
      tokenName: name,
      tokenSymbol: symbol,
      tokenDecimals: Number(decimals),
      buyTokenName: name1,
      buyTokenSymbol: symbol1,
      buyTokenDecimals: Number(decimals1),
      total: new BigNumber(lp.total._hex).toNumber(),
      rate: new BigNumber(lp.rate._hex).toNumber(),
      hardCap: new BigNumber(lp.hardCap._hex).toNumber(),
      softCap: new BigNumber(lp.softCap._hex).toNumber(),
      maxBuy: new BigNumber(lp.maxBuy._hex).toNumber(),
      amount: new BigNumber(lp.amount._hex).toNumber(),
      liquidity: new BigNumber(lp.liquidity._hex).toNumber(),
      lockTime: new BigNumber(lp.lockTime._hex).toNumber(),
      startTime: new BigNumber(lp.startTime._hex).toNumber(),
      endTime: new BigNumber(lp.endTime._hex).toNumber(),
      refundable: lp.refundable,
      claimable: lp.claimable,
      whitelist: lp.whitelist,
      whiteListEnableTime: new BigNumber(lp.whiteListEnableTime._hex).toNumber(),
      status,
    })
  }

  return result
}

const fetchLaunchpads = async (chainId: number, size: number, cursor: number): Promise<SerializedLaunchpadData[]> => {
  const [[[_lpLength]]] = await Promise.all([
    multicallv2({
      abi: launchpadFactoryAbi,
      calls: [
        {
          address: getLaunchpadFactoryAddress(chainId),
          name: "getContributionsLength"
        }
      ],
      chainId,
    })
  ])

  const lpLength = new BigNumber(_lpLength._hex)
  let size_ = size
  let cursor_ = cursor
  if (lpLength.lt(cursor))
    cursor_ = 0
  else if (lpLength.lt(size + cursor))
    size_ = lpLength.toNumber() - cursor

  const [launchpadsResult] = await Promise.all([
    fetchLaunchpadsData(chainId, size_, cursor_)
  ])
  
  const [result] = await Promise.all([launchpadsTransformer(chainId, launchpadsResult)])

  return result
}

export default fetchLaunchpads
