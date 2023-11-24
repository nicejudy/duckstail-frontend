import { ChainId } from '@pancakeswap/sdk'
import CreateToken from 'views/CreateToken'

const CreateTokenPage = ({ userIp }) => {
  return <CreateToken />
}

CreateTokenPage.chains = [ChainId.ARBITRUM, ChainId.ETHEREUM]

export default CreateTokenPage


// import { NotFound } from '@pancakeswap/uikit'

// const NotFoundPage = () => <NotFound />

// NotFoundPage.chains = []

// export default NotFoundPage