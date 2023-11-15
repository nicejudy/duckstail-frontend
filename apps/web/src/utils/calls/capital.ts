import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'

export const harvestBond = async (bondContract, account, stake, gasPrice, gasLimit?: number) => {
  return bondContract.redeem(account, stake, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const mintBond = async (bondContract, account, value, maxPremium, gasPrice, gasLimit?: number) => {
  return bondContract.deposit(value, maxPremium, account, {
    gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}
