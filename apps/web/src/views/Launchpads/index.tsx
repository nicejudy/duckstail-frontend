import { useState, useMemo, useCallback} from 'react'
import { useAccount } from 'wagmi'
import {
  Text,
  Flex,
  Loading,
  SearchInput,
  FlexLayout,
  ToggleView,
  Select,
  Box,
  OptionProps,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { SerializedBond } from '@pancakeswap/capital'
import { useCapital, useDCPUSDTPrice, usePollBondsWithUserData } from 'state/capital/hooks'
import { useUserBondsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
// import BondCard from './components/BondCard/BondCard'
// import { filterBondsByQuery } from './filterBondsByQuery'
import { useTranslation } from '@pancakeswap/localization'
import { SerializedLaunchpadData } from 'state/launchpads/types'
import { useLaunchpads, usePollLaunchpads } from 'state/launchpads/hooks'
import { LaunchpadCard } from './components/LaunchpadCard'

const ControlContainer = styled.div`
  display: flex;
  width: 100%;
  align-items: center;
  position: relative;

  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 32px;

  ${({ theme }) => theme.mediaQueries.sm} {
    flex-direction: row;
    flex-wrap: wrap;
    padding: 16px 32px;
    margin-bottom: 0;
  }
`

const LabelWrapper = styled.div`
  > ${Text} {
    font-size: 12px;
  }
`

const FilterContainer = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 8px 0px;

  ${({ theme }) => theme.mediaQueries.sm} {
    width: auto;
    padding: 0;
  }
`

const ViewControls = styled.div`
  flex-wrap: wrap;
  justify-content: space-between;
  display: flex;
  align-items: center;
  width: 100%;

  > div {
    padding: 8px 0px;
  }

  ${({ theme }) => theme.mediaQueries.sm} {
    justify-content: flex-start;
    width: auto;

    > div {
      padding: 0;
    }
  }
`

const Launchpads: React.FC<React.PropsWithChildren> = () => {
  const { t } = useTranslation()
  const { query: urlQuery } = useRouter()
  const { data } = useLaunchpads()

  const dcpPrice = useDCPUSDTPrice()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [filterOption, setFilterOption] = useState('')
  const [typeOption, setTypeOption] = useState('')

  const [viewMode, setViewMode] = useUserBondsViewMode()
  const { address: account } = useAccount()

  usePollLaunchpads(10, 6)

  // const userDataReady = !account || (!!account && userDataLoaded)

  // const bondsList = useCallback(
  //   (bondsToQuery: SerializedBond[]): SerializedBond[] => {
  //     return filterBondsByQuery(bondsToQuery, query)
  //   },
  //   [query],
  // )

  // const activeBonds = bondsList(bonds)

  const chosenLaunchpads = useMemo(() => {
    const sortPools = (pools: SerializedLaunchpadData[]): SerializedLaunchpadData[] => {
      switch (filterOption) {
        case 'upcoming':
          return pools.filter((pool) => pool.status === "upcoming")
        case 'live':
          return pools.filter((pool) => pool.status === "live")
        case 'success':
          return pools.filter((pool) => pool.status === "success")
        case 'ended':
          return pools.filter((pool) => pool.status === "ended")
        case 'canceled':
          return pools.filter((pool) => pool.status === "canceled")
        case 'whitelist':
          return pools.filter((pool) => pool.whitelist !== "")
        default:
          return pools
      }
    }

    return sortPools(data)
  }, [data, filterOption])

  const chosenLaunchpadsByType = useMemo(() => {
    const sortPools = (pools: SerializedLaunchpadData[]): SerializedLaunchpadData[] => {
      switch (typeOption) {
        case 'standard':
          return pools.filter((pool) => pool.presaleType === "standard")
        case 'fair':
          return pools.filter((pool) => pool.presaleType === "fair")
        default:
          return pools
      }
    }

    return sortPools(chosenLaunchpads)
  }, [chosenLaunchpads, typeOption])

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  const handleFilterOptionChange = (option: OptionProps): void => {
    setFilterOption(option.value)
  }

  const handleSelectTypeChange = (option: OptionProps): void => {
    setTypeOption(option.value)
  }

  return (
    <Page>
      <ControlContainer>
        <ViewControls>
          <LabelWrapper>
            <Box mt="20px" width="100%">
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Launchpad" />
            </Box>
          </LabelWrapper>
        </ViewControls>
        <FilterContainer>
          <LabelWrapper style={{ marginRight: 16 }}>
            <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
              {t('Filter By')}
            </Text>
            <Select
              options={[
                {
                  label: t('No Filter'),
                  value: '',
                },
                {
                  label: t('Upcoming'),
                  value: 'upcoming',
                },
                {
                  label: t('Inprogress'),
                  value: 'inprogress',
                },
                {
                  label: t('Success'),
                  value: 'success',
                },
                {
                  label: t('Ended'),
                  value: 'ended',
                },
                {
                  label: t('Canceled'),
                  value: 'canceled',
                },
                {
                  label: t('Whitelist'),
                  value: 'whitelist',
                },
              ]}
              onOptionChange={handleFilterOptionChange}
            />
          </LabelWrapper>
          <LabelWrapper>
            <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
              {t('Pool Type')}
            </Text>
            <Select
              options={[
                {
                  label: t('No Filter'),
                  value: '',
                },
                {
                  label: t('Presale'),
                  value: 'standard',
                },
                {
                  label: t('Fair Launch'),
                  value: 'fair',
                },
              ]}
              onOptionChange={handleSelectTypeChange}
            />
          </LabelWrapper>
          {/* <LabelWrapper>
            <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
              {t('Pool Type')}
            </Text>
            <Select
              options={[
                {
                  label: t('No Filter'),
                  value: '',
                },
                {
                  label: t('Hard Cap'),
                  value: 'hardCap',
                },
                {
                  label: t('Soft Cap'),
                  value: 'softCap',
                },
                {
                  label: t('LP Percent'),
                  value: 'lpPercent',
                },
                {
                  label: t('Start Time'),
                  value: 'startTime',
                },
                {
                  label: t('End Time'),
                  value: 'endTime',
                },
              ]}
              // onOptionChange={handleSortOptionChange}
            />
          </LabelWrapper> */}
          {/* <LabelWrapper>
            <Text textTransform="uppercase" color="textSubtle" fontSize="12px" bold>
              {t('Chain')}
            </Text>
            <Select
              options={[
                {
                  label: t('No Filter'),
                  value: '',
                },
                {
                  label: t('Ethereum'),
                  value: 'ethereum',
                },
                {
                  label: t('Arbitrum'),
                  value: 'arbitrum',
                },
                {
                  label: t('BSC'),
                  value: 'bsc',
                },
                {
                  label: t('Polygon'),
                  value: 'polygon',
                },
              ]}
              // onOptionChange={handleSortOptionChange}
            />
          </LabelWrapper> */}
        </FilterContainer>
      </ControlContainer>
      <FlexLayout>
        {chosenLaunchpadsByType && chosenLaunchpadsByType.length > 0 && chosenLaunchpadsByType.map((launchpad) =>
          <LaunchpadCard
            key={launchpad.address}
            data={launchpad}
          />
        )}
      </FlexLayout>
      {/* {account && !userDataLoaded && (
        <Flex justifyContent="center">
          <Loading /> 
        </Flex>
      )} */}
    </Page>
  )
}

export default Launchpads