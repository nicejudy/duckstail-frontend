import { useTranslation } from "@pancakeswap/localization";
import { ArrowBackIcon, ArrowForwardIcon, Flex, Text } from "@pancakeswap/uikit";
import { Fragment, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { DataType } from "../types";


const ResponsiveGrid = styled.div`
  display: grid;
  grid-gap: 1em;
  align-items: center;

  padding: 0 24px;

  grid-template-columns: 20px 3fr repeat(1, 1fr);

  & :nth-child(3) {
    display: none;
  }

  @media screen and (max-width: 670px) {
    grid-template-columns: 20px 3fr repeat(1, 1fr);
    & :nth-child(2) {
      display: none;
    }
    & :nth-child(3) {
      display: block;
    }
  }
`

export const TableWrapper = styled(Flex)`
  width: 100%;
  padding-top: 16px;
  flex-direction: column;
  gap: 16px;
  background-color: ${({ theme }) => theme.card.background};
  border-radius: ${({ theme }) => theme.radii[0]};
  border: 1px solid ${({ theme }) => theme.colors.cardBorder};
  ${({ theme }) => theme.mediaQueries.md} {
    border-radius: ${({ theme }) => theme.radii.card};
  }
`

export const PageButtons = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 0.2em;
  margin-bottom: 1.2em;
`

export const Arrow = styled.div`
  color: ${({ theme }) => theme.colors.primary};
  padding: 0 20px;
  :hover {
    cursor: pointer;
  }
`

const DataRow: React.FC<React.PropsWithChildren<{ data: {address: string, amount: number}; index: number }>> = ({ data, index }) => {
  const accountEllipsis = data.address ? `${data.address.substring(0, 6)}...${data.address.substring(data.address.length - 4)}` : null;
  return (
    <ResponsiveGrid>
      <Flex>
        <Text>{index + 1}</Text>
      </Flex>
      <Text fontWeight={400}>{data.address}</Text>
      <Text fontWeight={400}>{accountEllipsis}</Text>
      <Text fontWeight={400}>{data.amount.toFixed(2)}</Text>
    </ResponsiveGrid>
  )
}

const MAX_ITEMS = 10

const DataTable: React.FC<
  React.PropsWithChildren<{
    data: DataType[]
    maxItems?: number
  }>
> = ({ data, maxItems = MAX_ITEMS }) => {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [maxPage, setMaxPage] = useState(1)

  useEffect(() => {
    let extraPages = 1
    if (data) {
      if (data.length % maxItems === 0) {
        extraPages = 0
      }
      setMaxPage(Math.floor(data.length / maxItems) + extraPages)
    }
  }, [maxItems, data])

  const sortedData = useMemo(() => {
    return data
      ? data.slice(maxItems * (page - 1), page * maxItems)
      : []
  }, [data, maxItems, page])

  return (
    <TableWrapper>
      <ResponsiveGrid>
        <Text color="secondary" fontSize="12px" bold>
          #
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Sender")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Sender")}
        </Text>
        <Text color="secondary" fontSize="12px" bold>
          {t("Amount")}
        </Text>
      </ResponsiveGrid>

      {sortedData.map((row, i) => {
        if (row) {
          return (
            <Fragment key={row.address}>
              <DataRow data={row} index={(page - 1) * MAX_ITEMS + i} />
            </Fragment>
          )
        }
        return null
      })}
      <PageButtons>
        <Arrow
          onClick={() => {
            setPage(page === 1 ? page : page - 1)
          }}
        >
          <ArrowBackIcon color={page === 1 ? 'textDisabled' : 'primary'} />
        </Arrow>
        <Text>{t('Page %page% of %maxPage%', { page, maxPage })}</Text>
        <Arrow
          onClick={() => {
            setPage(page === maxPage ? page : page + 1)
          }}
        >
          <ArrowForwardIcon color={page === maxPage ? 'textDisabled' : 'primary'} />
        </Arrow>
      </PageButtons>
    </TableWrapper>
  )
}

export default DataTable