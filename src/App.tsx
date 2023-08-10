import {useEffect, useRef, useState} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

import { BrowserProvider, Contract } from 'ethers'
import { RelayProvider } from '@opengsn/provider'

const targetFunctionAbiEntry = {
    "inputs": [],
    "name": "captureTheFlag",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
}

const acceptEverythingPaymasterGoerli = '0x7e4123407707516bD7a3aFa4E3ebCeacfcbBb107'
const sampleErc2771RecipientAddress = '0xD1cfA489F7eABf322C5EE1B3779ca6Be9Ce08a8e'

async function connect() {
  const injected = (window as any).ethereum
  if (injected) {
    await injected.request({ method: "eth_requestAccounts" });
  } else {
    console.log("No MetaMask wallet to connect to");
  }
}

function App() {
  const [ready, setReady] = useState(false)

  const contract = useRef<Contract | null>(null)

  connect()
  useEffect(() => {
    // @ts-ignore
    const ethereum = window.ethereum;
    const ethersProvider = new BrowserProvider(ethereum)
      RelayProvider.newEthersV6Provider({
      provider: ethersProvider,
      config: {
        paymasterAddress: acceptEverythingPaymasterGoerli
      }
    }).then(
      ({gsnSigner}) => {
        console.log('RelayProvider init success')
        contract.current = new Contract(sampleErc2771RecipientAddress, [targetFunctionAbiEntry], gsnSigner)
        setReady(true)
      })
  }, [])

  return (
    <>
      <div>
        <a href="https://vitejs.dev" target="_blank">
          <img src={viteLogo} className="logo" alt="Vite logo" />
        </a>
        <a href="https://react.dev" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1>GSN + Vite + React</h1>
      <div className="card">
          {
              ready ? <button onClick={
                  () => {
                      contract.current?.captureTheFlag()
                  }
              }> captureTheFlag()
              </button> : <div> Initializing GSN Provider</div>
          }
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
      <p className="read-the-docs">
        Open Developer Tools for logs, connect MetaMask account and select Goerli network to make a GSN transaction.
      </p>
    </>
  )
}

export default App
