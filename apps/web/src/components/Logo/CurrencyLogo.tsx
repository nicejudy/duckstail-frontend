import { ChainId, Currency } from '@pancakeswap/sdk'
import { BinanceIcon, TokenLogo } from '@pancakeswap/uikit'
import { useMemo } from 'react'
import { WrappedTokenInfo } from '@pancakeswap/token-lists'
import styled from 'styled-components'
import { useHttpLocations } from '@pancakeswap/hooks'
import { BAD_SRCS } from './constants'
import getTokenLogoURL from '../../utils/getTokenLogoURL'

const StyledLogo = styled(TokenLogo)<{ size: string }>`
  width: ${({ size }) => size};
  height: ${({ size }) => size};
  border-radius: 50%;
`

export default function CurrencyLogo({
  currency,
  size = '24px',
  style,
}: {
  currency?: Currency
  size?: string
  style?: React.CSSProperties
}) {
  const uriLocations = useHttpLocations(currency instanceof WrappedTokenInfo ? currency.logoURI : undefined)

  const srcs: string[] = useMemo(() => {
    if (currency?.isNative) return []

    if (currency?.isToken) {
      const tokenLogoURL = getTokenLogoURL(currency)

      if (currency instanceof WrappedTokenInfo) {
        if (!tokenLogoURL) return [...uriLocations]
        return [...uriLocations, tokenLogoURL]
      }
      if (!tokenLogoURL) return []
      return [tokenLogoURL]
    }
    return []
  }, [currency, uriLocations])

  if (currency?.isNative) {
    if (currency.chainId === ChainId.BSC) {
      return <BinanceIcon width={size} style={style} />
    }
    return (
      <StyledLogo
        badSrcs={BAD_SRCS}
        size={size}
        srcs={[`/images/chains/${currency.chainId}.png`]}
        width={size}
        style={style}
      />
    )
  }

  // if (currency?.symbol === "WBTC") {
  //   return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/1/tokens/0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  // }

  // knb on matic
  if (currency && currency.wrapped.address === "0x864285774ca1249B0FB6E48F823E02C5D252DA8E" && currency.chainId === 137) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/knb.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // xkr on polygon
  if (currency && currency.wrapped.address === "0xAFFb6e5EDf035e42474a7541d96C3FBD5d372655" && currency.chainId === 137) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/xkr.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // xkr on kronobit
  if (currency && currency.wrapped.address === "0xA40583E4D0F1b4E23A5d5Bce0c52029761600E60" && currency.chainId === 13600) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/xkr.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // wknb on kronobit
  if (currency && currency.wrapped.address === "0x76e1790DdCc4427c3E71bEE219863a5F4F998cb7" && currency.chainId === 13600) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/knb.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // usdt on kronobit
  if (currency && currency.wrapped.address === "0x4609Ebb1D32d7FD7d3792f2c67CD9E4195b8ca65" && currency.chainId === 13600) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/13600/tokens/0x4609Ebb1D32d7FD7d3792f2c67CD9E4195b8ca65.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // matic on kronobit
  if (currency && currency.wrapped.address === "0xc2b546a4931135Ead999d3d0766B3F03Ba126941" && currency.chainId === 13600) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/13600/tokens/0xc2b546a4931135Ead999d3d0766B3F03Ba126941.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // wsmr on shimmer evm
  if (currency && currency.wrapped.address === "0x16bb40487386d83E042968FDDF2e72475eddF837" && currency.chainId === 148) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/148/tokens/0x16bb40487386d83E042968FDDF2e72475eddF837.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // smr on shimmer evm
  if (currency && currency.wrapped.address === "0x1074010000000000000000000000000000000000" && currency.chainId === 148) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/148/tokens/0x1074010000000000000000000000000000000000.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  // smr on shimmer evm
  if (currency && currency.wrapped.address === "0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6" && currency.chainId === 148) {
    return <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={[`/images/148/tokens/0xC33FEdB84EE8aD97141eF6647D305c9FFBdC7cd6.png`]} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  }

  return (
    <StyledLogo badSrcs={BAD_SRCS} size={size} srcs={srcs} alt={`${currency?.symbol ?? 'token'} logo`} style={style} />
  )
}
