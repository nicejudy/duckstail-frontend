import { useEffect, useCallback, useState, useMemo, useRef } from 'react'
import BigNumber from 'bignumber.js'
import { useAccount } from 'wagmi'
import {
  Text,
  Flex,
  Loading,
  SearchInput,
  FlexLayout,
  ToggleView,
} from '@pancakeswap/uikit'
import styled from 'styled-components'
import Page from 'components/Layout/Page'
import { useCapital, useDCPUSDTPrice, usePollBondsWithUserData } from 'state/capital/hooks'
import { useIntersectionObserver } from '@pancakeswap/hooks'
import { useTranslation } from '@pancakeswap/localization'
import { useUserBondsViewMode } from 'state/user/hooks'
import { ViewMode } from 'state/user/actions'
import { useRouter } from 'next/router'
import { useActiveChainId } from 'hooks/useActiveChainId'
import BondTable from './components/BondTable/BondTable'
import BondCard from './components/BondCard/BondCard'

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

const NUMBER_OF_FARMS_VISIBLE = 12

const Bonds: React.FC<React.PropsWithChildren> = () => {
  const { pathname, query: urlQuery } = useRouter()
  const { t } = useTranslation()
  const { chainId } = useActiveChainId()
  const { bonds, vault, userDataLoaded } = useCapital()

  const dcpPrice = useDCPUSDTPrice()

  const [_query, setQuery] = useState('')
  const normalizedUrlSearch = useMemo(() => (typeof urlQuery?.search === 'string' ? urlQuery.search : ''), [urlQuery])
  // const query = normalizedUrlSearch && !_query ? normalizedUrlSearch : _query

  const [viewMode, setViewMode] = useUserBondsViewMode()
  const { address: account } = useAccount()
  const { observerRef, isIntersecting } = useIntersectionObserver()
  // const chosenFarmsLength = useRef(0)

  usePollBondsWithUserData()

  // Users with no wallet connected should see 0 as Earned amount
  // Connected users should see loading indicator until first userData has loaded
  const userDataReady = !account || (!!account && userDataLoaded)

  const handleChangeQuery = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value)
  }

  // const [numberOfBondsVisible, setNumberOfBondsVisible] = useState(NUMBER_OF_FARMS_VISIBLE)

  // useEffect(() => {
  //   if (isIntersecting) {
  //     setNumberOfBondsVisible((farmsCurrentlyVisible) => {
  //       if (farmsCurrentlyVisible <= chosenFarmsLength.current) {
  //         return farmsCurrentlyVisible + NUMBER_OF_FARMS_VISIBLE
  //       }
  //       return farmsCurrentlyVisible
  //     })
  //   }
  // }, [isIntersecting])

  return (
      <Page>
        <ControlContainer>
          <ViewControls>
            <Flex>
              <ToggleView idPrefix="clickFarm" viewMode={viewMode} onToggle={setViewMode} />
            </Flex>
          </ViewControls>
          <FilterContainer>
            <LabelWrapper style={{ marginLeft: 16 }}>
              <SearchInput initialValue={normalizedUrlSearch} onChange={handleChangeQuery} placeholder="Search Bonds" />
            </LabelWrapper>
          </FilterContainer>
        </ControlContainer>
        {viewMode === ViewMode.TABLE ? (
          <BondTable bonds={bonds} userDataReady={userDataReady} />
        ) : (
          <FlexLayout>
            {bonds.map((bond) =>
              <BondCard
                key={bond.id}
                bond={bond}
                dcpPrice={dcpPrice}
                account={account}
                removed={false}
              />
            )}
          </FlexLayout>
        )}
        {account && !userDataLoaded && (
          <Flex justifyContent="center">
            <Loading />
          </Flex>
        )}
        {/* {poolLength && <div ref={observerRef} />} */}
      </Page>
  )
}

export default Bonds
