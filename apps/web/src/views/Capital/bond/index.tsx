import Bonds from './Bonds'

export const BondsPageLayout: React.FC<React.PropsWithChildren<unknown>> = ({ children }) => {
  return (
    <>
      <Bonds>{children}</Bonds>
    </>
  )
}
