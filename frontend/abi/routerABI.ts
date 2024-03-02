export const routerABI = [
    {
        "inputs": [
          {
            "internalType": "address",
            "name": "factoryAddress",
            "type": "address"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct inEuint16",
            "name": "amountADesired",
            "type": "tuple"
          },
          {
            "components": [
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct inEuint16",
            "name": "amountBDesired",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "addLiquidity",
        "outputs": [
          {
            "internalType": "euint16",
            "name": "amountA",
            "type": "uint256"
          },
          {
            "internalType": "euint16",
            "name": "amountB",
            "type": "uint256"
          },
          {
            "internalType": "euint16",
            "name": "liquidity",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "tokenA",
            "type": "address"
          },
          {
            "internalType": "address",
            "name": "tokenB",
            "type": "address"
          },
          {
            "components": [
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct inEuint16",
            "name": "_liquidity",
            "type": "tuple"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "removeLiquidity",
        "outputs": [
          {
            "internalType": "euint16",
            "name": "amountA",
            "type": "uint256"
          },
          {
            "internalType": "euint16",
            "name": "amountB",
            "type": "uint256"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct inEuint16",
            "name": "_amountIn",
            "type": "tuple"
          },
          {
            "internalType": "address[]",
            "name": "path",
            "type": "address[]"
          },
          {
            "internalType": "address",
            "name": "to",
            "type": "address"
          }
        ],
        "name": "swapExactTokensForTokens",
        "outputs": [
          {
            "internalType": "euint16[]",
            "name": "amounts",
            "type": "uint256[]"
          }
        ],
        "stateMutability": "nonpayable",
        "type": "function"
      }
];