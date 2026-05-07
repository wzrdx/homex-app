ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/crypto/randomness.js 9:15-32
Module not found: Error: Can't resolve 'crypto' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet\crypto'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }' - install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "crypto": false }

ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/userPem.js 7:13-26
Module not found: Error: Can't resolve 'fs' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet'

ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/userPem.js 8:15-30
Module not found: Error: Can't resolve 'path' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }' - install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "path": false }

ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/userWallet.js 34:13-26
Module not found: Error: Can't resolve 'fs' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet'

ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/userWallet.js 35:28-43
Module not found: Error: Can't resolve 'path' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }' - install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "path": false }

ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/validatorPem.js 7:13-26
Module not found: Error: Can't resolve 'fs' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet'

ERROR in ./node_modules/@multiversx/sdk-core/out/wallet/validatorPem.js 8:15-30
Module not found: Error: Can't resolve 'path' in 'C:\Projects\homex-app\node_modules\@multiversx\sdk-core\out\wallet'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "path": require.resolve("path-browserify") }' - install 'path-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "path": false }

ERROR in ./node_modules/cipher-base/index.js 4:16-43
Module not found: Error: Can't resolve 'stream' in 'C:\Projects\homex-app\node_modules\cipher-base'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "stream": require.resolve("stream-browserify") }' - install 'stream-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "stream": false }

ERROR in ./node_modules/scryptsy/lib/scrypt.js 1:15-32
Module not found: Error: Can't resolve 'crypto' in 'C:\Projects\homex-app\node_modules\scryptsy\lib'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }' - install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "crypto": false }

ERROR in ./node_modules/scryptsy/lib/scryptSync.js 1:15-32
Module not found: Error: Can't resolve 'crypto' in 'C:\Projects\homex-app\node_modules\scryptsy\lib'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }' - install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "crypto": false }

ERROR in ./node_modules/scryptsy/lib/utils.js 1:15-32
Module not found: Error: Can't resolve 'crypto' in 'C:\Projects\homex-app\node_modules\scryptsy\lib'

BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
This is no longer the case. Verify if you need this module and configure a polyfill for it.

If you want to include a polyfill, you need to: - add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }' - install 'crypto-browserify'
If you don't want to include a polyfill, you can use an empty module like this:
resolve.fallback: { "crypto": false }

webpack compiled with 82 errors and 1 warning
ERROR in src/App.tsx:2:82
TS2307: Cannot find module '@multiversx/sdk-dapp/UI' or its corresponding type declarations.
1 | import { ChakraBaseProvider, Text, useToast } from '@chakra-ui/react';

> 2 | import { NotificationModal, SignTransactionsModals, TransactionsToastList } from '@multiversx/sdk-dapp/UI';

      |                                                                                  ^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';
    4 | import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';
    5 | import { cloneDeep, find, forEach, head, includes, isEmpty, map, remove, size } from 'lodash';

ERROR in src/App.tsx:3:72
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
1 | import { ChakraBaseProvider, Text, useToast } from '@chakra-ui/react';
2 | import { NotificationModal, SignTransactionsModals, TransactionsToastList } from '@multiversx/sdk-dapp/UI';

> 3 | import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';

      |                                                                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';
    5 | import { cloneDeep, find, forEach, head, includes, isEmpty, map, remove, size } from 'lodash';
    6 | import { useEffect } from 'react';

ERROR in src/App.tsx:4:44
TS2307: Cannot find module '@multiversx/sdk-dapp/types' or its corresponding type declarations.
2 | import { NotificationModal, SignTransactionsModals, TransactionsToastList } from '@multiversx/sdk-dapp/UI';
3 | import { useGetFailedTransactions, useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';

> 4 | import { SignedTransactionsBodyType } from '@multiversx/sdk-dapp/types';

      |                                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { cloneDeep, find, forEach, head, includes, isEmpty, map, remove, size } from 'lodash';
    6 | import { useEffect } from 'react';
    7 | import { Navigate, Route, Routes } from 'react-router-dom';

ERROR in src/App.tsx:229:50
TS2339: Property 'hash' does not exist on type '{}'.
227 |
228 | if (tx && !isEmpty(tx[1].transactions)) {

> 229 | hash = head(tx[1].transactions)?.hash;

        |                                                  ^^^^
    230 |             }
    231 |
    232 |             return { ...victimTx, hash };

ERROR in src/blockchain/auxiliary/api/canMintPage.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser, U8Value } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';

ERROR in src/blockchain/auxiliary/api/canMintPage.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser, U8Value } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';
    5 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/auxiliary/api/getArtRarities.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { config } from '../../config';

ERROR in src/blockchain/auxiliary/api/getPagesMinted.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';

ERROR in src/blockchain/auxiliary/api/getPagesMinted.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';
    5 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/auxiliary/api/getStakeableNonces.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { config } from '../../config';

ERROR in src/blockchain/auxiliary/api/getStakingStats.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { config } from '../../config';
    4 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/auxiliary/api/isPageMinted.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser, U8Value } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';

ERROR in src/blockchain/auxiliary/api/isPageMinted.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser, U8Value } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';
    5 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/auxiliary/hooks/useGetStakingInfo.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { map, size } from 'lodash';

ERROR in src/blockchain/auxiliary/hooks/useGetStakingInfo.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { map, size } from 'lodash';
    5 | import { useState } from 'react';

ERROR in src/blockchain/auxiliary/smartContract.ts:1:32
TS2724: '"@multiversx/sdk-core"' has no exported member named 'SmartContract'. Did you mean 'ISmartContract'?

> 1 | import { AbiRegistry, Address, SmartContract } from '@multiversx/sdk-core';

      |                                ^^^^^^^^^^^^^
    2 | import { config } from '../config';
    3 | import json from './auxiliary-sc.abi.json';
    4 |

ERROR in src/blockchain/game/api/achievements/getLogSummary.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../../config';

ERROR in src/blockchain/game/api/achievements/getLogSummary.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../../config';
    5 | import { smartContract } from '../../smartContract';

ERROR in src/blockchain/game/api/achievements/getPageCelestials.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../../config';

ERROR in src/blockchain/game/api/achievements/getPageCelestials.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../../config';
    5 | import { smartContract } from '../../smartContract';

ERROR in src/blockchain/game/api/getArtDropTimestamp.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { config } from '../../config';
    4 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/api/getElderRewards.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getElderRewards.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';
    5 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/api/getPlayerXp.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getPlayerXp.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';
    5 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/api/getRaffleHashes.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getRaffleParticipants.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getRaffleParticipantsCount.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { config } from '../../config';
    4 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/api/getRaffleSubmittedTickets.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getRaffleSubmittedTickets.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { config } from '../../config';
    5 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/api/getRarityClasses.ts:1:34
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, List, ResultsParser, U16Type, U16Value } from '@multiversx/sdk-core/out';

      |                                  ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getXpLeaderboard.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser, U32Value } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/api/getXpLeaderboardSize.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { config } from '../../config';
    4 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/api/isGamePaused.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { config } from '../../config';
    4 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/generics/getNumber.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { config } from '../../config';
    4 | import { smartContract } from '../smartContract';

ERROR in src/blockchain/game/hooks/useGetStakedNFTsCount.ts:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { useState } from 'react';
    4 | import { config } from '../../config';

ERROR in src/blockchain/game/hooks/useGetStakingInfo.ts:1:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                                                   ^^^^^^^^^^^^^
    2 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { map, size } from 'lodash';

ERROR in src/blockchain/game/hooks/useGetStakingInfo.ts:2:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 2 | import { getAddress } from '@multiversx/sdk-dapp/utils';

      |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    4 | import { map, size } from 'lodash';
    5 | import { useState } from 'react';

ERROR in src/blockchain/game/smartContract.ts:1:32
TS2724: '"@multiversx/sdk-core"' has no exported member named 'SmartContract'. Did you mean 'ISmartContract'?

> 1 | import { AbiRegistry, Address, SmartContract } from '@multiversx/sdk-core';

      |                                ^^^^^^^^^^^^^
    2 | import { config } from '../config';
    3 | import json from './game-sc.abi.json';
    4 |

ERROR in src/components/Achievements/Interactor.tsx:4:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
2 | import { Button, Center, Flex, Image, Spinner, Stack, Text, useToast } from '@chakra-ui/react';
3 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';

> 4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    7 | import _ from 'lodash';

ERROR in src/components/Achievements/Interactor.tsx:5:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
3 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    7 | import _ from 'lodash';
    8 | import { useEffect, useState } from 'react';

ERROR in src/components/Achievements/Interactor.tsx:6:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

      |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 | import _ from 'lodash';
    8 | import { useEffect, useState } from 'react';
    9 | import { useMutation } from 'react-query';

ERROR in src/components/Achievements/Interactor.tsx:135:58
TS2339: Property 'semiFungible' does not exist on type 'typeof TokenTransfer'.
133 | const tx = smartContract.methods
134 | .mintPage([index])

> 135 | .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(config.ticketsTokenId, 1, 3))

        |                                                          ^^^^^^^^^^^^
    136 |                 .withSender(user)
    137 |                 .withChainID(config.chainId)
    138 |                 .withGasLimit(gasLimit)

ERROR in src/components/Achievements/PageMint.tsx:9:46
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
7 | import { isPageMinted } from '../../blockchain/auxiliary/api/isPageMinted';
8 | import { getAOMLogo } from '../../services/assets';

> 9 | import { useGetSuccessfulTransactions } from '@multiversx/sdk-dapp/hooks';

       |                                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    10 | import { useTransactionsContext, TransactionsContextType, TransactionType, Transaction } from '../../services/transactions';
    11 |
    12 | export const PageMint = ({ index, page, goBack }) => {

ERROR in src/components/Maze/Stake.tsx:21:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
19 | } from '@chakra-ui/react';
20 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';

> 21 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    22 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    23 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    24 | import _ from 'lodash';

ERROR in src/components/Maze/Stake.tsx:22:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
20 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
21 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 22 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

       |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    23 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    24 | import _ from 'lodash';
    25 | import { useEffect, useState } from 'react';

ERROR in src/components/Maze/Stake.tsx:23:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
21 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
22 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 23 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

       |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    24 | import _ from 'lodash';
    25 | import { useEffect, useState } from 'react';
    26 | import { BsGem } from 'react-icons/bs';

ERROR in src/components/Maze/Stake.tsx:73:52
TS2339: Property 'semiFungible' does not exist on type 'typeof TokenTransfer'.
71 | try {
72 | const transfers: TokenTransfer[] = \_(tokenBalances)

> 73 | .map((value, key) => TokenTransfer.semiFungible(config.aomCollectionId, Number.parseInt(key), value))

       |                                                    ^^^^^^^^^^^^
    74 |                 .value();
    75 |
    76 |             const tx = smartContract.methods

ERROR in src/components/Maze/Unstake.tsx:21:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
19 | } from '@chakra-ui/react';
20 | import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';

> 21 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    22 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    23 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    24 | import _ from 'lodash';

ERROR in src/components/Maze/Unstake.tsx:22:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
20 | import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';
21 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 22 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

       |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    23 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    24 | import _ from 'lodash';
    25 | import { useEffect, useState } from 'react';

ERROR in src/components/Maze/Unstake.tsx:23:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
21 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
22 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 23 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

       |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    24 | import _ from 'lodash';
    25 | import { useEffect, useState } from 'react';
    26 | import { BsGem } from 'react-icons/bs';

ERROR in src/components/MultipleQuests.tsx:19:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
17 | } from '@chakra-ui/react';
18 | import { Address, List, TokenTransfer, U8Type, U8Value } from '@multiversx/sdk-core/out';

> 19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    20 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    21 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    22 | import _, { findIndex } from 'lodash';

ERROR in src/components/MultipleQuests.tsx:20:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
18 | import { Address, List, TokenTransfer, U8Type, U8Value } from '@multiversx/sdk-core/out';
19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 20 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

       |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    21 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    22 | import _, { findIndex } from 'lodash';
    23 | import { useCallback, useEffect, useState } from 'react';

ERROR in src/components/MultipleQuests.tsx:21:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
20 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 21 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

       |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    22 | import _, { findIndex } from 'lodash';
    23 | import { useCallback, useEffect, useState } from 'react';
    24 | import { MdOutlineErrorOutline } from 'react-icons/md';

ERROR in src/components/MultipleQuests.tsx:70:46
TS2339: Property 'fungibleFromAmount' does not exist on type 'typeof TokenTransfer'.
68 | const transfers = \_(Object.keys(requirements))
69 | .filter((resource) => requirements[resource] > 0)

> 70 | .map((resource) => TokenTransfer.fungibleFromAmount(RESOURCE_ELEMENTS[resource].tokenId, requirements[resource], 6))

       |                                              ^^^^^^^^^^^^^^^^^^
    71 |             .value();
    72 |
    73 |         const args = new List(

ERROR in src/components/Quests.tsx:17:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
15 | } from '@chakra-ui/react';
16 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';

> 17 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    18 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    19 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    20 | import { isAfter, isBefore } from 'date-fns';

ERROR in src/components/Quests.tsx:18:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
16 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
17 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 18 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

       |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    19 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    20 | import { isAfter, isBefore } from 'date-fns';
    21 | import _, { find, findIndex, map } from 'lodash';

ERROR in src/components/Quests.tsx:19:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
17 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
18 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 19 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

       |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    20 | import { isAfter, isBefore } from 'date-fns';
    21 | import _, { find, findIndex, map } from 'lodash';
    22 | import { useEffect, useState } from 'react';

ERROR in src/components/Quests.tsx:96:39
TS2339: Property 'fungibleFromAmount' does not exist on type 'typeof TokenTransfer'.
94 | .withMultiESDTNFTTransfer(
95 | requiredResources.map((resource) =>

> 96 | TokenTransfer.fungibleFromAmount(

       |                                       ^^^^^^^^^^^^^^^^^^
    97 |                             RESOURCE_ELEMENTS[resource].tokenId,
    98 |                             currentQuest.requirements[resource],
    99 |                             6

ERROR in src/components/Shop.tsx:3:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
1 | import { Alert, AlertIcon, Flex, Spinner } from '@chakra-ui/react';
2 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';

> 3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    6 | import { useEffect, useState } from 'react';

ERROR in src/components/Shop.tsx:4:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
2 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    6 | import { useEffect, useState } from 'react';
    7 | import { config } from '../blockchain/config';

ERROR in src/components/Shop.tsx:5:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

      |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { useEffect, useState } from 'react';
    7 | import { config } from '../blockchain/config';
    8 | import { getArtDropTimestamp } from '../blockchain/game/api/getArtDropTimestamp';

ERROR in src/components/Shop.tsx:47:58
TS2339: Property 'semiFungible' does not exist on type 'typeof TokenTransfer'.
45 | const tx = smartContract.methods
46 | .mint([amount])

> 47 | .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(config.ticketsTokenId, 1, amount \* PRICE))

       |                                                          ^^^^^^^^^^^^
    48 |                 .withSender(user)
    49 |                 .withChainID(config.chainId)
    50 |                 .withGasLimit(9000000 + 250000 * amount)

ERROR in src/components/Staking/Stake.tsx:4:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
2 | import { Alert, AlertIcon, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
3 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';

> 4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    7 | import _ from 'lodash';

ERROR in src/components/Staking/Stake.tsx:5:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
3 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    7 | import _ from 'lodash';
    8 | import { useEffect, useState } from 'react';

ERROR in src/components/Staking/Stake.tsx:6:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

      |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 | import _ from 'lodash';
    8 | import { useEffect, useState } from 'react';
    9 | import { config } from '../../blockchain/config';

ERROR in src/components/Staking/Stake.tsx:71:47
TS2339: Property 'nonFungible' does not exist on type 'typeof TokenTransfer'.
69 | try {
70 | const transfers: TokenTransfer[] = \_(selectedTokens)

> 71 | .map((token) => TokenTransfer.nonFungible(token.tokenId, token.nonce))

       |                                               ^^^^^^^^^^^
    72 |                 .value();
    73 |
    74 |             const tx = smartContract.methods

ERROR in src/components/Staking/Unbond.tsx:4:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
2 | import { Alert, AlertIcon, Box, Button, Flex, Spinner, Text } from '@chakra-ui/react';
3 | import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type, U64Value } from '@multiversx/sdk-core/out';

> 4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    7 | import { getUnixTime } from 'date-fns';

ERROR in src/components/Staking/Unbond.tsx:5:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
3 | import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type, U64Value } from '@multiversx/sdk-core/out';
4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    7 | import { getUnixTime } from 'date-fns';
    8 | import _ from 'lodash';

ERROR in src/components/Staking/Unbond.tsx:6:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
4 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
5 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 6 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

      |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 | import { getUnixTime } from 'date-fns';
    8 | import _ from 'lodash';
    9 | import { useEffect, useState } from 'react';

ERROR in src/components/Staking/Unstake.tsx:19:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
17 | } from '@chakra-ui/react';
18 | import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';

> 19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    20 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    21 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    22 | import { formatDistance } from 'date-fns';

ERROR in src/components/Staking/Unstake.tsx:20:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
18 | import { Address, OptionType, OptionValue, TokenIdentifierValue, U16Value, U64Type } from '@multiversx/sdk-core/out';
19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 20 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

       |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    21 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    22 | import { formatDistance } from 'date-fns';
    23 | import _ from 'lodash';

ERROR in src/components/Staking/Unstake.tsx:21:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
20 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 21 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

       |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    22 | import { formatDistance } from 'date-fns';
    23 | import _ from 'lodash';
    24 | import { useEffect, useState } from 'react';

ERROR in src/components/Unlock.tsx:8:8
TS2307: Cannot find module '@multiversx/sdk-dapp/UI' or its corresponding type declarations.
6 | WalletConnectLoginButton,
7 | WebWalletLoginButton,

> 8 | } from '@multiversx/sdk-dapp/UI';

       |        ^^^^^^^^^^^^^^^^^^^^^^^^^
     9 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
    10 | import { logout } from '@multiversx/sdk-dapp/utils';
    11 | import { useEffect, useState } from 'react';

ERROR in src/components/Unlock.tsx:9:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
7 | WebWalletLoginButton,
8 | } from '@multiversx/sdk-dapp/UI';

> 9 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    10 | import { logout } from '@multiversx/sdk-dapp/utils';
    11 | import { useEffect, useState } from 'react';
    12 | import { MdExtension, MdWeb } from 'react-icons/md';

ERROR in src/components/Unlock.tsx:10:24
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
8 | } from '@multiversx/sdk-dapp/UI';
9 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 10 | import { logout } from '@multiversx/sdk-dapp/utils';

       |                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    11 | import { useEffect, useState } from 'react';
    12 | import { MdExtension, MdWeb } from 'react-icons/md';
    13 | import { useNavigate } from 'react-router-dom';

ERROR in src/components/XP/Profile.tsx:2:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
1 | import { Box, Button, Flex, Spinner, Stack, Text } from '@chakra-ui/react';

> 2 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { useEffect, useState } from 'react';
    4 | import { getShortAddress, getUsername } from '../../services/helpers';
    5 | import { getLevel } from '../../services/xp';

ERROR in src/components/XP/Profile.tsx:7:24
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
5 | import { getLevel } from '../../services/xp';
6 | import { IoWalletOutline } from 'react-icons/io5';

> 7 | import { logout } from '@multiversx/sdk-dapp/utils';

       |                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
     8 | import { useAuthenticationContext, AuthenticationContextType } from '../../services/authentication';
     9 | import { useNavigate } from 'react-router-dom';
    10 |

ERROR in src/index.tsx:2:34
TS2307: Cannot find module '@multiversx/sdk-dapp/types' or its corresponding type declarations.
1 | import { ColorModeScript } from '@chakra-ui/react';

> 2 | import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { DappProvider } from '@multiversx/sdk-dapp/wrappers';
    4 | import ReactDOM from 'react-dom/client';
    5 | import ReactGA from 'react-ga4';

ERROR in src/index.tsx:3:30
TS2307: Cannot find module '@multiversx/sdk-dapp/wrappers' or its corresponding type declarations.
1 | import { ColorModeScript } from '@chakra-ui/react';
2 | import { EnvironmentsEnum } from '@multiversx/sdk-dapp/types';

> 3 | import { DappProvider } from '@multiversx/sdk-dapp/wrappers';

      |                              ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import ReactDOM from 'react-dom/client';
    5 | import ReactGA from 'react-ga4';
    6 | import { QueryClient, QueryClientProvider } from 'react-query';

ERROR in src/services/achievements.tsx:1:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.

> 1 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    2 | import _ from 'lodash';
    3 | import { createContext, useContext, useState } from 'react';
    4 | import { config } from '../blockchain/config';

ERROR in src/services/quests.tsx:31:51
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.
29 | import { Quest } from '../types';
30 |

> 31 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

       |                                                   ^^^^^^^^^^^^^
    32 | import { getAddress } from '@multiversx/sdk-dapp/utils';
    33 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    34 | import { BigNumber } from 'bignumber.js';

ERROR in src/services/quests.tsx:32:28
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
30 |
31 | import { Address, AddressValue, ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

> 32 | import { getAddress } from '@multiversx/sdk-dapp/utils';

       |                            ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    33 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    34 | import { BigNumber } from 'bignumber.js';
    35 | import { isBefore } from 'date-fns';

ERROR in src/services/resources.tsx:19:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
17 |
18 | import { useDisclosure } from '@chakra-ui/react';

> 19 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    20 | import axios from 'axios';
    21 | import { config } from '../blockchain/config';
    22 |

ERROR in src/services/rewards.tsx:1:28
TS2305: Module '"@multiversx/sdk-core/out"' has no exported member 'ResultsParser'.

> 1 | import { ContractFunction, ResultsParser } from '@multiversx/sdk-core/out';

      |                            ^^^^^^^^^^^^^
    2 | import { ProxyNetworkProvider } from '@multiversx/sdk-core/out/networkProviders';
    3 | import { map } from 'lodash';
    4 | import { createContext, useContext, useState } from 'react';

ERROR in src/services/store.tsx:1:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.

> 1 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    2 | import _ from 'lodash';
    3 | import { createContext, useContext, useState } from 'react';
    4 | import { getArtRarities } from '../blockchain/auxiliary/api/getArtRarities';

ERROR in src/shared/PrizesList.tsx:20:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
18 | useDisclosure,
19 | } from '@chakra-ui/react';

> 20 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

       |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    21 | import { format } from 'date-fns';
    22 | import _ from 'lodash';
    23 | import { useEffect, useState } from 'react';

ERROR in src/shared/ProtectedRoute.tsx:5:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
3 | import { useAuthenticationContext, AuthenticationContextType } from '../services/authentication';
4 | import { routeNames } from '../services/routes';

> 5 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { logout } from '@multiversx/sdk-dapp/utils';
    7 |
    8 | export const ProtectedRoute = ({ children }: { children: ReactNode }) => {

ERROR in src/shared/ProtectedRoute.tsx:6:24
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
4 | import { routeNames } from '../services/routes';
5 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 6 | import { logout } from '@multiversx/sdk-dapp/utils';

      |                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    7 |
    8 | export const ProtectedRoute = ({ children }: { children: ReactNode }) => {
    9 |     const { isAuthenticated, setAuthentication } = useAuthenticationContext() as AuthenticationContextType;

ERROR in src/shared/RaffleCard.tsx:3:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
1 | import { Box, Flex, Image, Text } from '@chakra-ui/react';
2 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';

> 3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    6 | import { format, isAfter } from 'date-fns';

ERROR in src/shared/RaffleCard.tsx:4:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
2 | import { Address, TokenTransfer } from '@multiversx/sdk-core/out';
3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    6 | import { format, isAfter } from 'date-fns';
    7 | import _ from 'lodash';

ERROR in src/shared/RaffleCard.tsx:5:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

      |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { format, isAfter } from 'date-fns';
    7 | import _ from 'lodash';
    8 | import { useEffect, useState } from 'react';

ERROR in src/shared/RaffleCard.tsx:65:58
TS2339: Property 'semiFungible' does not exist on type 'typeof TokenTransfer'.
63 | const tx = smartContract.methods
64 | .joinRaffle([id])

> 65 | .withSingleESDTNFTTransfer(TokenTransfer.semiFungible(config.ticketsTokenId, 1, amount))

       |                                                          ^^^^^^^^^^^^
    66 |                 .withSender(user)
    67 |                 .withChainID(config.chainId)
    68 |                 .withGasLimit(11000000 + tickets * 125000)

ERROR in src/shared/RewardCard.tsx:3:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
1 | import { Box, Flex, Image, Text } from '@chakra-ui/react';
2 | import { Address } from '@multiversx/sdk-core/out';

> 3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';
    5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    6 | import { useEffect, useState } from 'react';

ERROR in src/shared/RewardCard.tsx:4:34
TS2307: Cannot find module '@multiversx/sdk-dapp/services' or its corresponding type declarations.
2 | import { Address } from '@multiversx/sdk-core/out';
3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

> 4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

      |                                  ^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';
    6 | import { useEffect, useState } from 'react';
    7 | import { config } from '../blockchain/config';

ERROR in src/shared/RewardCard.tsx:5:32
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
4 | import { sendTransactions } from '@multiversx/sdk-dapp/services';

> 5 | import { refreshAccount } from '@multiversx/sdk-dapp/utils';

      |                                ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    6 | import { useEffect, useState } from 'react';
    7 | import { config } from '../blockchain/config';
    8 | import { smartContract } from '../blockchain/game/smartContract';

ERROR in src/shared/Wallet.tsx:2:24
TS2307: Cannot find module '@multiversx/sdk-dapp/utils' or its corresponding type declarations.
1 | import { Box, Text, Button, Stack } from '@chakra-ui/react';

> 2 | import { logout } from '@multiversx/sdk-dapp/utils';

      |                        ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';
    4 | import { getShortAddress } from '../services/helpers';
    5 | import { useNavigate } from 'react-router-dom';

ERROR in src/shared/Wallet.tsx:3:35
TS2307: Cannot find module '@multiversx/sdk-dapp/hooks' or its corresponding type declarations.
1 | import { Box, Text, Button, Stack } from '@chakra-ui/react';
2 | import { logout } from '@multiversx/sdk-dapp/utils';

> 3 | import { useGetAccountInfo } from '@multiversx/sdk-dapp/hooks';

      |                                   ^^^^^^^^^^^^^^^^^^^^^^^^^^^^
    4 | import { getShortAddress } from '../services/helpers';
    5 | import { useNavigate } from 'react-router-dom';
    6 | import { IoWalletOutline } from 'react-icons/io5';
