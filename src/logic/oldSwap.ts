// let chainId = rootGetters['accountModule/chainId']
//       let account = rootGetters['accountModule/account']
//       let provider = rootGetters['accountModule/provider']
//       let signer = rootGetters['accountModule/signer']

//       if (chainId && account) {
//         const { trade, fromAVAX, toAVAX } = payload;
//         const yakRouterAddress = DeployedAddresses[chainId].helpers.yakRouter;
//         const yakRouterContract = new ethers.Contract(yakRouterAddress, YakRouterABI, signer);
//         const fee = 0;
//         try {
//           if (fromAVAX) {
//             let tx = await yakRouterContract.swapNoSplitFromAVAX({
//                 amountIn: trade.amounts[0],
//                 amountOut: trade.amounts[trade.amounts.length - 1],
//                 path: trade.path,
//                 adapters: trade.adapters
//               },
//               account, fee, { value: trade.amounts[0] });
//             showSnackbarSuccess("Swap Pending", "Transaction sent");
//             let txReceipt = await tx.wait(1);
//             if (txReceipt.status) {
//               showSnackbarSuccess("Swap Success", "Transaction confirmed");
//             }
//             else {
//               showSnackbarDanger("Swap Failed", "Transaction failed");
//             }
//             return txReceipt.status;
//           }
//           else {
//             // handle approval
//             const fromTokenAddress = trade.path[0];
//             const permitSupported = TokenList[chainId].filter(token => token.address.toLowerCase() == fromTokenAddress.toLowerCase())[0].permitSupported;
//             const tokenContract = new ethers.Contract(fromTokenAddress, PairABI, signer);
//             const approvedBalance = await tokenContract.allowance(account, yakRouterAddress);
//             try {
//               if (!permitSupported) throw new Error("Permit not supported");
//               if (approvedBalance.gte(trade.amounts[0])) throw new Error("Permit not needed");

//               let deadline = parseInt(Date.now() / 1000) + 1200; // now plus 20 mins
//               let params = await dispatch('getPermitParams', {
//                 tokenContract,
//                 account,
//                 chainId,
//                 spender: yakRouterAddress,
//                 amount: trade.amounts[0],
//                 deadline
//               });

//               const signature = await provider.send("eth_signTypedData_v4", params);

//               if (toAVAX) {
//                 let tx = await yakRouterContract.swapNoSplitToAvaxWithPermit({
//                     amountIn: trade.amounts[0],
//                     amountOut: trade.amounts[trade.amounts.length - 1],
//                     path: trade.path,
//                     adapters: trade.adapters
//                   },
//                   account,
//                   fee,
//                   deadline.toString(),
//                   parseInt(signature.substring(2).substring(128, 130), 16),
//                   ethers.utils.arrayify("0x" + signature.substring(2).substring(0,64)),
//                   ethers.utils.arrayify("0x" + signature.substring(2).substring(64, 128)),
//                 );
//                 showSnackbarSuccess("Swap Pending", "Transaction sent");
//                 let txReceipt = await tx.wait(1);
//                 if (txReceipt.status) {
//                   showSnackbarSuccess("Swap Success", "Transaction confirmed");
//                 }
//                 else {
//                   showSnackbarDanger("Swap Failed", "Transaction failed");
//                 }
//                 return txReceipt.status;

//               }
//               else {
//                 let tx = await yakRouterContract.swapNoSplitWithPermit({
//                     amountIn: trade.amounts[0],
//                     amountOut: trade.amounts[trade.amounts.length - 1],
//                     path: trade.path,
//                     adapters: trade.adapters
//                   },
//                   account,
//                   fee,
//                   deadline.toString(),
//                   parseInt(signature.substring(2).substring(128, 130), 16),
//                   ethers.utils.arrayify("0x" + signature.substring(2).substring(0,64)),
//                   ethers.utils.arrayify("0x" + signature.substring(2).substring(64, 128)),
//                 );
//                 showSnackbarSuccess("Swap Pending", "Transaction sent");
//                 let txReceipt = await tx.wait(1);
//                 if (txReceipt.status) {
//                   showSnackbarSuccess("Swap Success", "Transaction confirmed");
//                 }
//                 else {
//                   showSnackbarDanger("Swap Failed", "Transaction failed");
//                 }
//                 return txReceipt.status;

//               }
//             }
//             catch {
//               // Use on-chain approval method
//               try {
//                 if (approvedBalance.lt(trade.amounts[0])) {
//                   let tx = await tokenContract.approve(yakRouterAddress, ethers.constants.MaxUint256);
//                   let txReceipt = await tx.wait(1);
//                   // console.log("debug::txReceipt", txReceipt)
//                 }

//                 if (toAVAX) {
//                   let tx = await yakRouterContract.swapNoSplitToAVAX({
//                       amountIn: trade.amounts[0],
//                       amountOut: trade.amounts[trade.amounts.length - 1],
//                       path: trade.path,
//                       adapters: trade.adapters
//                     },
//                     account,
//                     fee
//                   );
//                   showSnackbarSuccess("Swap Pending", "Transaction sent");
//                   let txReceipt = await tx.wait(1);
//                   if (txReceipt.status) {
//                     showSnackbarSuccess("Swap Success", "Transaction confirmed");
//                   }
//                   else {
//                     showSnackbarDanger("Swap Failed", "Transaction failed");
//                   }
//                   return txReceipt.status;
//                 }
//                 else {
//                   let tx = await yakRouterContract.swapNoSplit({
//                       amountIn: trade.amounts[0],
//                       amountOut: trade.amounts[trade.amounts.length - 1],
//                       path: trade.path,
//                       adapters: trade.adapters
//                     },
//                     account,
//                     fee
//                   );
//                   showSnackbarSuccess("Swap Pending", "Transaction sent");
//                   let txReceipt = await tx.wait(1);
//                   if (txReceipt.status) {
//                     showSnackbarSuccess("Swap Success", "Transaction confirmed");
//                   }
//                   else {
//                     showSnackbarDanger("Swap Failed", "Transaction failed");
//                   }
//                   return txReceipt.status;
//                 }
//               }
//               catch (err) {
//                 console.log("swap::err", err);
//                 return false;
//               }
//             }
//           }
//         }
//         catch (err) {
//           console.log("swap::err", err);
//           return false;
//         }
//       }
