import { ethers } from "ethers"
import { Contract } from '@ethersproject/contracts'
import BigNumber from 'bignumber.js'
import { DEFAULT_TOKEN_DECIMAL, DEFAULT_GAS_LIMIT } from 'config'

export const createLaunchpad = async (launchpad, values, addresses, strings, options, gasPrice, gasLimit?: number) => {
  return launchpad.createNewLaunchpad(values, addresses, strings, options, {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}

export const createFairLaunchpad = async (launchpad, values, addresses, strings, options, gasPrice, gasLimit?: number) => {
  return launchpad.createNewFairLauch(values, addresses, strings, options, {
    // gasLimit: gasLimit || DEFAULT_GAS_LIMIT,
    // gasPrice,
  })
}
