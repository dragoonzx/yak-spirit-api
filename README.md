<img src="./src/assets/images/yak-spirit/yak-favicon.png" width="150" align="right" alt="" />

# 🐃 `Yield Yak Aggregator API`

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Yak Spirit](https://img.shields.io/badge/made%20by-Yak%20Spirit-success)](https://twitter.com/yak_spirit)

# Usage

Check swagger for endpoints, parameters and more info

In order to execute swap transaction you need to check if user allowed to spend input tokens amount. If not, use approve endpoint and send approve tx

Example of getting best path from token to token:

`/swap/quote?amount=10&fromTokenAddress=0x0000000000000000000000000000000000000000&toTokenAddress=0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7`

Quick overview:

## Swap

### Get best path from token to token

`GET /swap/quote?amount=&fromTokenAddress=&toTokenAddress=`

### Get swap transaction for best path

`GET /swap?fromAddress=&amount=&fromTokenAddress=&toTokenAddress=`

## Info

### Get tokens list

`GET /info/tokens`

### Get providers list

`GET /info/providers`

## Approve

### Get Yak Router address

`GET /approve/spender`

### Get transaction for ERC20 token spend approve

`GET /approve/transaction?fromAddress=&tokenAddress=&amount=`

### Get allowed amount to spend

`GET /approve/allowance?fromAddress=&tokenAddress=`

# Development

1. Run `yarn` in the root folder
2. Run `yarn develop`
3. Run `yarn test` to run tests

And you should be good to go! Feel free to fork and submit pull requests

# Contributing

Interested in contributing to the Yak Spirit or Yield Yak Aggregator API? Thanks so much for your interest! We are always looking for improvements to the project and contributions from open-source developers are greatly appreciated.

If you have a contribution in mind, please open issue or PR with your ideas.

<p align="center">
  <img src="./src/assets/gif/loading-unscreen.gif" alt="" width="50">
</p>
