import {
  MenuItemsType,
  DropdownMenuItemType,
  SwapIcon,
  SwapFillIcon,
  EarnFillIcon,
  EarnIcon,
  TrophyIcon,
  TrophyFillIcon,
  NftIcon,
  NftFillIcon,
  MoreIcon,
  DropdownMenuItems,
  FarmIcon,
  InfoIcon,
  IfoIcon,
  ResourcesIcon,
  TradeIcon,
  TradeFilledIcon,
  HomeIcon,
  CapitalIcon,
  MultisenderIcon,
  LaunchPadIcon,
} from '@pancakeswap/uikit'
import { ContextApi } from '@pancakeswap/localization'
import { nftsBaseUrl } from 'views/Nft/market/constants'
import { getPerpetualUrl } from 'utils/getPerpetualUrl'
import { SUPPORT_ONLY_BSC } from 'config/constants/supportChains'

export type ConfigMenuDropDownItemsType = DropdownMenuItems & { hideSubNav?: boolean }
export type ConfigMenuItemsType = Omit<MenuItemsType, 'items'> & { hideSubNav?: boolean; image?: string } & {
  items?: ConfigMenuDropDownItemsType[]
}

const addMenuItemSupported = (item, chainId) => {
  if (!chainId || !item.supportChainIds) {
    return item
  }
  if (item.supportChainIds?.includes(chainId)) {
    return item
  }
  return {
    ...item,
    disabled: true,
  }
}

const config: (
  t: ContextApi['t'],
  isDark: boolean,
  languageCode?: string,
  chainId?: number,
) => ConfigMenuItemsType[] = (t, isDark, languageCode, chainId) =>
  [
    {
      label: 'Home',
      href: '/',
      icon: HomeIcon,
      showItemsOnMobile: true,
      items: []
    },
    {
      label: t('Trade'),
      icon: SwapIcon,
      fillIcon: SwapFillIcon,
      href: '/swap',
      showItemsOnMobile: true,
      items: [
        {
          label: t('Swap'),
          href: '/swap',
        },
        {
          label: t('Liquidity'),
          href: '/liquidity',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    // {
    //   label: t('Game'),
    //   icon: TrophyIcon,
    //   fillIcon: TrophyFillIcon,
    //   href: '/flip',
    //   showItemsOnMobile: true,
    //   items: [
    //     {
    //       label: t('Flip'),
    //       href: '/flip',
    //     },
    //     {
    //       label: t('Dice'),
    //       href: '/dice',
    //     },
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
    // {
    //   label: 'Presale',
    //   href: '/presale',
    //   icon: IfoIcon,
    //   hideSubNav: true,
    //   showItemsOnMobile: false,
    //   items: []
    // },
    // {
    //   label: t('Liquidity'),
    //   icon: SwapIcon,
    //   fillIcon: SwapFillIcon,
    //   href: '/liquidity',
    //   showItemsOnMobile: false,
    //   items: [].map((item) => addMenuItemSupported(item, chainId)),
    // },
    // {
    //   label: t('Farm'),
    //   href: '/farms',
    //   icon: FarmIcon,
    //   fillIcon: FarmIcon,
    //   image: '/images/knb.png',
    //   showItemsOnMobile: false,
    //   items: [
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
    // {
    //   label: t('Earn'),
    //   href: '/pools',
    //   icon: EarnIcon,
    //   fillIcon: EarnFillIcon,
    //   image: '/images/knb.png',
    //   showItemsOnMobile: false,
    //   items: [
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
    // {
    //   label: t('Margin'),
    //   href: '/long',
    //   icon: SwapIcon,
    //   fillIcon: SwapFillIcon,
    //   items: [
    //     {
    //       label: t('Long'),
    //       href: '/long',
    //     },
    //     {
    //       label: t('Short'),
    //       href: '/short',
    //     },
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
    {
      label: t('Earn'),
      href: '/farms',
      icon: EarnIcon,
      fillIcon: EarnFillIcon,
      image: '/images/logo.png',
      items: [
        {
          label: t('Farms'),
          href: '/farms',
        },
        {
          label: t('Pools'),
          href: '/pools',
          supportChainIds: SUPPORT_ONLY_BSC,
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Capital'),
      icon: CapitalIcon,
      fillIcon: CapitalIcon,
      href: '/capital',
      showItemsOnMobile: true,
      items: [
        {
          label: t('Info'),
          href: '/capital',
        },
        {
          label: t('Bond'),
          href: '/capital/bond',
        },
        {
          label: t('Vault'),
          href: '/capital/vault',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Bridge'),
      href: '/bridge',
      icon: TradeIcon,
      fillIcon: TradeFilledIcon,
      image: '/images/dko.png',
      showItemsOnMobile: false,
      items: [
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('MultiSender'),
      href: '/multisender',
      icon: MultisenderIcon,
      fillIcon: MultisenderIcon,
      image: '/images/dko.png',
      showItemsOnMobile: false,
      items: [
        {
          label: t('Send'),
          href: '/multisender',
        },
        {
          label: t('History'),
          href: '/multisender/history',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    {
      label: t('Launchpad'),
      href: '/launchpad',
      icon: LaunchPadIcon,
      fillIcon: LaunchPadIcon,
      image: '/images/dko.png',
      showItemsOnMobile: false,
      hideSubNav: true,
      items: [
        {
          label: t('Create launchpad'),
          href: '/launchpad',
        },
        {
          label: t('Create fair launch'),
          href: '/launchpad/fair-launch',
        },
        {
          label: t('Create a token'),
          href: '/launchpad/create-token',
        },
        {
          label: t('Launchpad list'),
          href: '/launchpad/launchpad-list',
        },
      ].map((item) => addMenuItemSupported(item, chainId)),
    },
    // {
    //   label: t('Win'),
    //   href: '/prediction',
    //   icon: TrophyIcon,
    //   fillIcon: TrophyFillIcon,
    //   supportChainIds: SUPPORT_ONLY_BSC,
    //   items: [
    //     {
    //       label: t('Trading Competition'),
    //       href: '/competition',
    //       image: '/images/decorations/tc.png',
    //       hideSubNav: true,
    //     },
    //     {
    //       label: t('Prediction (BETA)'),
    //       href: '/prediction',
    //       image: '/images/decorations/prediction.png',
    //     },
    //     {
    //       label: t('Lottery'),
    //       href: '/lottery',
    //       image: '/images/decorations/lottery.png',
    //     },
    //     {
    //       label: t('Pottery (BETA)'),
    //       href: '/pottery',
    //       image: '/images/decorations/lottery.png',
    //     },
    //   ],
    // },
    // {
    //   label: 'Info',
    //   href: '/info',
    //   icon: InfoIcon,
    //   hideSubNav: true,
    //   showItemsOnMobile: false,
    //   items: [
    //     // {
    //     //   label: t('Info'),
    //     //   href: '/info',
    //     // },
    //     // {
    //     //   label: t('IFO'),
    //     //   href: '/ifo',
    //     //   supportChainIds: SUPPORT_ONLY_BSC,
    //     //   image: '/images/ifos/ifo-bunny.png',
    //     // },
    //     // {
    //     //   label: t('Voting'),
    //     //   href: '/voting',
    //     //   supportChainIds: SUPPORT_ONLY_BSC,
    //     //   image: '/images/voting/voting-bunny.png',
    //     // },
    //     // {
    //     //   type: DropdownMenuItemType.DIVIDER,
    //     // },
    //     // {
    //     //   label: t('Leaderboard'),
    //     //   href: '/teams',
    //     //   supportChainIds: SUPPORT_ONLY_BSC,
    //     //   image: '/images/decorations/leaderboard.png',
    //     // },
    //     // {
    //     //   type: DropdownMenuItemType.DIVIDER,
    //     // },
    //     // {
    //     //   label: t('Blog'),
    //     //   href: 'https://medium.com/pancakeswap',
    //     //   type: DropdownMenuItemType.EXTERNAL_LINK,
    //     // },
    //     // {
    //     //   label: t('Docs'),
    //     //   href: 'https://docs.pancakeswap.finance',
    //     //   type: DropdownMenuItemType.EXTERNAL_LINK,
    //     // },
    //   ].map((item) => addMenuItemSupported(item, chainId)),
    // },
    // {
    //   label: t('NFT'),
    //   href: `${nftsBaseUrl}`,
    //   icon: NftIcon,
    //   fillIcon: NftFillIcon,
    //   supportChainIds: SUPPORT_ONLY_BSC,
    //   image: '/images/decorations/nft.png',
    //   showItemsOnMobile: false,
    //   items: [
    //     // {
    //     //   label: t('Overview'),
    //     //   href: `${nftsBaseUrl}`,
    //     // },
    //     // {
    //     //   label: t('Collections'),
    //     //   href: `${nftsBaseUrl}/collections`,
    //     // },
    //     // {
    //     //   label: t('Activity'),
    //     //   href: `${nftsBaseUrl}/activity`,
    //     // },
    //   ],
    // },
    // {
    //   label: 'Docs',
    //   href: '/docs',
    //   icon: ResourcesIcon,
    //   hideSubNav: true,
    //   showItemsOnMobile: false,
    //   items: []
    // },
  ].map((item) => addMenuItemSupported(item, chainId))

export default config
