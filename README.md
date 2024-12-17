# Lendify - Decentralized Lending Platform

Lendify is a decentralized lending platform built on the **Stacks blockchain**, enabling users to **borrow**, **lend**, and **participate in governance**.

## Features

- Decentralized lending and borrowing  
- Collateral management  
- Governance system for platform decisions  
- Lendify token (LFY) for platform interactions  
- Liquidation mechanism for defaulted loans  

## Smart Contracts

Lendify utilizes Clarity smart contracts:

1. **`collateral-manager.clar`** - Manages collateral for loans  
2. **`governance.clar`** - Handles governance proposals and voting  
3. **`lendify-token.clar`** - Implements the Lendify (LFY) token  
4. **`liquidation.clar`** - Manages liquidation for defaulted loans  
5. **`loan-core.clar`** - Core loan management functionality  

Refer to [CLARITY_FUNCTIONS.md](./CLARITY_FUNCTIONS.md) for detailed Clarity functions.

## Frontend

Built with **Next.js**, **React**, and **Tailwind CSS**, Lendify provides an intuitive interface for platform interactions.

### Key Components

- **Dashboard** - User balances and platform statistics  
- **Loans** - Create and manage loans  
- **Governance** - Propose and vote on governance decisions  

## Getting Started

1. Clone the repository  
2. Install dependencies: `npm install`  
3. Run the development server: `npm run dev`  
4. Open [http://localhost:3000](http://localhost:3000)  

## Contributing

Contributions are welcome! Submit a Pull Request for review.

## License

This project is licensed under the **MIT License**.
