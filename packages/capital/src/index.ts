import { ChainId } from '@pancakeswap/sdk'
import { BondConfigBaseProps } from './types'

let logged = false

export const supportedChainId = [ChainId.ARBITRUM]

export const getBondConfig = async (chainId: ChainId) => {
  try {
    return (await import(`/${chainId}.ts`)).default.filter(
      (b: BondConfigBaseProps) => b.id !== null,
    ) as BondConfigBaseProps[]
  } catch (error) {
    if (!logged) {
      console.error('Cannot get bond config', error, chainId)
      logged = true
    }
    return []
  }
}

export * from './types'
