import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'

export const multiSendToken = async (multisenderContract, token, addresses, amounts, gasPrice, gasLimit?: number) => {
  return multisenderContract.multisendToken(token, false, addresses, amounts, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}
