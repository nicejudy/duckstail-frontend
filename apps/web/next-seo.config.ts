import { DefaultSeoProps } from 'next-seo'

export const SEO: DefaultSeoProps = {
  titleTemplate: '%s | CyberGlow',
  defaultTitle: 'CyberGlow',
  description:
    'Cheaper and faster than Uniswap? Discover CyberGlow, the leading DEX on ShimmerEVM with the best farms in DeFi.',
  twitter: {
    cardType: 'summary_large_image',
    handle: '@Cyberglow_cs',
    site: '@Cyberglow_cs',
  },
  openGraph: {
    title: 'CyberGlow - A next evolution DeFi exchange on ShimmerEVM',
    description:
      'The most popular AMM on ShimmerEVM! Earn CGT through yield farming, then stake it in Pools to earn more tokens!',
    images: [{ url: 'https://cyberglow.es/logo.png' }],
  },
}
