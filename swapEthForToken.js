const { ethers } = require('ethers')

const { abi: V3SwapRouterABI } = require('@uniswap/v3-periphery/artifacts/contracts/SwapRouter.sol/SwapRouter.json')
const ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564'
const WETH_ADDRESS = '0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6'
const UNI_ADDRESS = '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984'
const SPCOIN_ADDRESS = '0x3Cb3d2655dB27d0ef62f0B77E0e13c06630317Ef'
const TOKEN_ADDRESS = SPCOIN_ADDRESS

//const WALLET_ADDRESS_1="0x4F75f07232a56c2b98FC9878F496bFc32e317Ace"
//const WALLET_SECRET_1="54ee4096e52729c34ef6b9387b0c387885a3c0f48fbf89cd1bfecbf55c2e7139"
const WALLET_ADDRESS="0x16d4d83DDcaaa62B4AA0cC62c6A9A2BD518E8b8a"
const WALLET_SECRET="389ffe80089f33ec3505698e411eafc1d89bd51405f000ad3a2b94cdca69936b"
const INFURA_URL_TESTNET="https://goerli.infura.io/v3/08b06e80980b4c1c9d9d450f4f71607d"

const provider = new ethers.providers.JsonRpcProvider(INFURA_URL_TESTNET)
const signer = new ethers.Wallet(WALLET_SECRET, provider)

const router = new ethers.Contract(
    ROUTER_ADDRESS,
    V3SwapRouterABI,
    provider
  )

  const amountIn = ethers.utils.parseEther('0.001' )

  async function main () {

    const deadline = Math.floor(Date.now()/1000 + (60 * 10))

    const params = {
        tokenIn: WETH_ADDRESS, //WETH
        tokenOut: TOKEN_ADDRESS, //spCoin
        fee: 3000,
        recipient: WALLET_ADDRESS, // Etherium Wallet Address
        deadline: deadline,
        amountIn: amountIn,
        amountOutMinimum: 0,
        sqrtPriceLimitX96: 0,
      }
    
      const data = router.interface.encodeFunctionData('exactInputSingle', [params])

      const txnArgs = {
        to: ROUTER_ADDRESS,
        from: WALLET_ADDRESS,
        data: data,
        value: amountIn,
        gasLimit: '1000000',
      }

      console.log("Sending")

      const tx = await signer.sendTransaction(txnArgs)

      const receipt = await tx.wait().then(receipt => {
        console.log("SUCCESS =>")
        console.log (receipt)
       }).catch( receipt => {
        console.log("ERROR =>")
        console.log (receipt)
       })
       console.log('Complete')
  }

  main()
