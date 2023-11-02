import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | Duckstail',
  defaultTitle: 'Duckstail',
  description:
    'Cheaper and faster than Uniswap? Discover Duckstail, the leading DEX on Ethereum with the best farms in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Cyberglow_cs',
    site: '@Cyberglow_cs',
  },
  openGraph: {
    title: 'Duckstail - A next evolution DeFi exchange on Ethereum',
    description:
      'The most popular AMM on Arbitrum! Earn DKO through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://duckstail.com/logo.png' }],
  },
}
