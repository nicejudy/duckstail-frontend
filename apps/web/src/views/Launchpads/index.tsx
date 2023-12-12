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

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
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
                  label: t('Filled'),
                  value: 'filled',
                },
                {
                  label: t('Ended'),
                  value: 'ended',
                },
                {
                  label: t('Cancelled'),
                  value: 'cancelled',
                },
                {
                  label: t('Whitelist'),
                  value: 'whitelist',
                },
              ]}
              // onOptionChange={handleSortOptionChange}
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
                  value: 'presale',
                },
                {
                  label: t('Fair Launch'),
                  value: 'fairLaunch',
                },
              ]}
              // onOptionChange={handleSortOptionChange}
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
        {data && data.length > 0 && data.map((launchpad) =>
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