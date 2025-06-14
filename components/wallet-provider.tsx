"use client"

import { useMemo } from "react"
import { ConnectionProvider, WalletProvider as SolanaWalletProvider } from "@solana/wallet-adapter-react"
import { WalletAdapterNetwork } from "@solana/wallet-adapter-base"
import { WalletModalProvider } from "@solana/wallet-adapter-react-ui"
import { clusterApiUrl } from "@solana/web3.js"
import {
  PhantomWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
  LedgerWalletAdapter,
} from "@solana/wallet-adapter-wallets"
import type { ReactNode } from "react"

// Import default styles for Solana wallet adapter
import "@solana/wallet-adapter-react-ui/styles.css"

// Custom styles for wallet components to integrate with dark theme
const walletStyles = `
  /* Solana Wallet Adapter Modal Styles */
  .wallet-adapter-modal-wrapper {
    background: rgba(0, 0, 0, 0.8) !important;
    backdrop-filter: blur(4px);
  }

  .wallet-adapter-modal {
    background: rgb(24, 24, 27) !important;
    border: 1px solid rgb(63, 63, 70) !important;
    border-radius: 12px !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important;
  }

  .wallet-adapter-modal-title {
    color: rgb(244, 244, 245) !important;
    font-weight: 600 !important;
  }

  .wallet-adapter-modal-list {
    background: transparent !important;
  }

  .wallet-adapter-modal-list-more {
    background: rgb(39, 39, 42) !important;
    border: 1px solid rgb(63, 63, 70) !important;
    border-radius: 8px !important;
    color: rgb(244, 244, 245) !important;
  }

  .wallet-adapter-modal-list-more:hover {
    background: rgb(63, 63, 70) !important;
    border-color: rgb(96, 165, 250) !important;
  }

  .wallet-adapter-modal-list li {
    background: rgb(39, 39, 42) !important;
    border: 1px solid rgb(63, 63, 70) !important;
    border-radius: 8px !important;
    margin-bottom: 8px !important;
  }

  .wallet-adapter-modal-list li:hover {
    background: rgb(63, 63, 70) !important;
    border-color: rgb(96, 165, 250) !important;
  }

  .wallet-adapter-modal-list li button {
    color: rgb(244, 244, 245) !important;
    font-weight: 500 !important;
  }

  .wallet-adapter-modal-button-close {
    color: rgb(156, 163, 175) !important;
    background: transparent !important;
  }

  .wallet-adapter-modal-button-close:hover {
    color: rgb(244, 244, 245) !important;
    background: rgb(63, 63, 70) !important;
  }

  .wallet-adapter-button {
    background-color: transparent;
    border: none;
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    font-family: 'Inter', sans-serif;
    font-size: 14px;
    font-weight: 600;
    height: 48px;
    line-height: 48px;
    padding: 0 24px;
    border-radius: 4px;
  }

  .wallet-adapter-button:not([disabled]):hover {
    background-color: rgb(63, 63, 70);
  }

  .wallet-adapter-dropdown {
    position: relative;
    display: inline-block;
  }

  /* Custom wallet button styles */
  .wallet-mobile-button .wallet-adapter-button-start-icon,
  .wallet-desktop-button .wallet-adapter-button-start-icon {
    display: none;
  }

  .wallet-mobile-button::before,
  .wallet-desktop-button::before {
    content: "";
    display: inline-block;
    width: 1.25rem;
    height: 1.25rem;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='M21 12V7H5a2 2 0 0 1 0-4h14v4'/%3E%3Cpath d='M3 5v14a2 2 0 0 0 2 2h16v-5'/%3E%3Cpath d='M18 12a2 2 0 0 0 0 4h4v-4Z'/%3E%3C/svg%3E");
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
    margin-right: 0.5rem;
  }

  .wallet-desktop-button::before {
    width: 1rem;
    height: 1rem;
    margin-right: 0;
  }

  .wallet-mobile-button .wallet-adapter-button-label {
    display: none;
  }

  .wallet-desktop-button .wallet-adapter-button-label {
    display: none;
  }
`

interface WalletProviderProps {
  children: ReactNode
}

export function WalletProvider({ children }: WalletProviderProps) {
  // The network can be set to 'devnet', 'testnet', or 'mainnet-beta'
  const network = WalletAdapterNetwork.Devnet

  // You can also provide a custom RPC endpoint
  const endpoint = useMemo(() => clusterApiUrl(network), [network])

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new SolflareWalletAdapter(),
      new TorusWalletAdapter(),
      new LedgerWalletAdapter(),
    ],
    []
  )

  return (
    <>
      <style jsx global>
        {walletStyles}
      </style>
      <ConnectionProvider endpoint={endpoint}>
        <SolanaWalletProvider wallets={wallets} autoConnect>
          <WalletModalProvider>
            {children}
          </WalletModalProvider>
        </SolanaWalletProvider>
      </ConnectionProvider>
    </>
  )
}
