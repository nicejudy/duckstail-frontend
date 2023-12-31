import { useCallback } from 'react'
// import useActiveWeb3React from 'hooks/useActiveWeb3React'
import { stakeFarm } from 'utils/calls'
import { useMasterchef } from 'hooks/useContract'
import { useGasPrice } from 'state/user/hooks'
// import { useOraclePrice } from 'views/Farms/hooks/useFetchOraclePrice'

const useStakeFarms = (pid: number) => {
  // const { account, chainId } = useActiveWeb3React()
  const gasPrice = useGasPrice()
  // const oraclePrice = useOraclePrice(chainId)
  const masterChefContract = useMasterchef()
  // const nonBscVaultContract = useNonBscVault()

  const handleStake = useCallback(
    async (amount: string) => {
      return stakeFarm(masterChefContract, pid, amount, gasPrice)
    },
    [masterChefContract, pid, gasPrice],
  )

  // const handleStakeNonBsc = useCallback(
  //   async (amount: string) => {
  //     return nonBscStakeFarm(nonBscVaultContract, vaultPid, amount, gasPrice, account, oraclePrice, chainId)
  //   },
  //   [nonBscVaultContract, vaultPid, gasPrice, account, oraclePrice, chainId],
  // )

  // return { onStake: vaultPid ? handleStakeNonBsc : handleStake }
  return { onStake: handleStake }
}

export default useStakeFarms
