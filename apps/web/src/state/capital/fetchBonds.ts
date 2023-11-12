import BigNumber from 'bignumber.js'
import { BIG_TEN, BIG_TWO, BIG_ZERO } from '@pancakeswap/utils/bigNumber'
import { BondConfigBaseProps, SerializedBond, SerializedBondCalcPublicData, SerializedBondPublicData } from '@pancakeswap/capital'
import { fetchPublicBondData, fetcBondCalcData } from './fetchPublicBondData'

function bondTransformer(marketPrice: BigNumber, bondResult: any[], treasuryBalances: string[]) {
  return (bond, index) => {
    const [
      terms,
      maxBondPrice,
      bondPrice,
      bondPriceInUSD,
    ] = bondResult[index]

    const bondPriceInUSDBN = new BigNumber(bondPriceInUSD)
    const discount = marketPrice.minus(bondPriceInUSDBN).div(bondPriceInUSDBN)

    return {
      ...bond,
      discount: discount.toJSON(),
      purchased: treasuryBalances[index],
      vestingTerms: terms.vestingTerm,
      marketPrice: marketPrice.toJSON(),
      maxBondPrice,
      bondPrice,
      bondPriceInUSD,
    }
  }
}

function bondCalcTransformer(bondResult: any[]) {
  return (bond, index) => {
    const [
      totalLpValue,
      totalLpSupply,
      markdown,
      valuation,
    ] = bondResult[index]

    const markdownBN = new BigNumber(markdown)
    const valuationBN = new BigNumber(valuation)

    const purchased = markdownBN.times(valuationBN).div(BIG_TEN.pow(9))

    return {
      ...bond,
      purchased: purchased.toJSON(),
      totalLpValue,
      totalLpSupply,
    }
  }
}

const bondCalculate = (bondsPublicData: SerializedBondPublicData[], lpBondsPublicData: SerializedBondCalcPublicData[]) : SerializedBond[] => {
  return bondsPublicData.map((bond) => {
    if (!bond.lpBond) {
      return {
        ...bond,
        totalLpValue: BIG_ZERO.toJSON(),
        totalLpSupply: BIG_ZERO.toJSON(),
      }
    }
    return {
      ...bond,
      purchased: lpBondsPublicData.find((lpBond) => bond.bondAddress === lpBond.bondAddress).purchased,
      totalLpValue: lpBondsPublicData.find((lpBond) => bond.bondAddress === lpBond.bondAddress).totalLpValue,
      totalLpSupply: lpBondsPublicData.find((lpBond) => bond.bondAddress === lpBond.bondAddress).totalLpSupply,
    }
  })
}

const fetchBonds = async (marketPrice: BigNumber, bondsToFetch: BondConfigBaseProps[], treasuryBalances: string[], chainId: number): Promise<SerializedBond[]> => {

  const [BondsResult] = await Promise.all([
    fetchPublicBondData(bondsToFetch, chainId)
  ])

  const bondsPublicData = bondsToFetch.map(bondTransformer(marketPrice, BondsResult, treasuryBalances));
  const lpBondsToFetch = bondsPublicData.map((bond) => bond.lpBond)

  const [BondsCalcResult] = await Promise.all([
    fetcBondCalcData(lpBondsToFetch, chainId)
  ])

  const lpBondsPublicData = lpBondsToFetch.map(bondCalcTransformer(BondsCalcResult));

  return bondCalculate(bondsPublicData, lpBondsPublicData)
}

export default fetchBonds
