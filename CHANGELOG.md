# Changelog

### [0.7.2](https://www.github.com/aeternity/mdw-frontend/compare/v0.7.1...v0.7.2) (2022-11-29)


### Bug Fixes

* **docker:** universal docker image (with SSR) ([#183](https://www.github.com/aeternity/mdw-frontend/issues/183)) ([db23014](https://www.github.com/aeternity/mdw-frontend/commit/db230147e21011f54259b531046207ff554d99c5))

### [0.7.1](https://www.github.com/aeternity/mdw-frontend/compare/v0.7.0...v0.7.1) (2022-09-14)


### Bug Fixes

* show no error if no tokens ([82520f9](https://www.github.com/aeternity/mdw-frontend/commit/82520f946d016801cdb5dd702e3181f0d90e23e5))
* swap tx tokens display [#177](https://www.github.com/aeternity/mdw-frontend/issues/177) ([193d4dc](https://www.github.com/aeternity/mdw-frontend/commit/193d4dc684e1d20d9979f792f384e436a0af84c9))

## [0.7.0](https://www.github.com/aeternity/mdw-frontend/compare/v0.6.1...v0.7.0) (2022-04-18)


### Features

* ga contract support [#135](https://www.github.com/aeternity/mdw-frontend/issues/135) ([83e5e60](https://www.github.com/aeternity/mdw-frontend/commit/83e5e60f6282c8f12a48b05fb7e884c828622b2a))


### Bug Fixes

* **tx-details:** only show tx arguments on contract call [#172](https://www.github.com/aeternity/mdw-frontend/issues/172) ([817a08b](https://www.github.com/aeternity/mdw-frontend/commit/817a08b9717238eb8cdd41c6280309fbf5ffbf76))

### [0.6.1](https://www.github.com/aeternity/mdw-frontend/compare/v0.6.0...v0.6.1) (2022-02-28)


### Bug Fixes

* when tokens could not be loaded should display transactions ([6b7a851](https://www.github.com/aeternity/mdw-frontend/commit/6b7a8516de125a985b88069e24ee702681a3a9f5))

## [0.6.0](https://www.github.com/aeternity/mdw-frontend/compare/v0.5.0...v0.6.0) (2022-02-17)


### Features

* account filter transactions based on AEX-9 and DEX [#155](https://www.github.com/aeternity/mdw-frontend/issues/155) ([42a2d53](https://www.github.com/aeternity/mdw-frontend/commit/42a2d532cb228d0b2c263036b44b637e38441b04))


### Bug Fixes

* **account:** show token failed message on aex9 balances load error [#168](https://www.github.com/aeternity/mdw-frontend/issues/168) ([9ddab7d](https://www.github.com/aeternity/mdw-frontend/commit/9ddab7de910d47c632f09fca8a99ebb0d663688d))
* **account:** when aex9 balance cannot be loaded [#168](https://www.github.com/aeternity/mdw-frontend/issues/168) ([81c85c6](https://www.github.com/aeternity/mdw-frontend/commit/81c85c6ec6d5e39837977f14d4930dd10e541b8c))
* aex transaction when token decimals not defined ([aec56ae](https://www.github.com/aeternity/mdw-frontend/commit/aec56ae7f31151e6d7401f4fe2ce83284231527d))
* fetch block height from node API ([c07f847](https://www.github.com/aeternity/mdw-frontend/commit/c07f8473f9a584635e2437459f643ac7f1fcf5a4))
* transaction loading state ([993e4cd](https://www.github.com/aeternity/mdw-frontend/commit/993e4cd89d6f2c97a1ff0b1e28dc0e772c59738a))

## [0.5.0](https://www.github.com/aeternity/mdw-frontend/compare/v0.4.0...v0.5.0) (2022-02-07)


### Features

* **account:** change allowance display [#138](https://www.github.com/aeternity/mdw-frontend/issues/138) ([9cce742](https://www.github.com/aeternity/mdw-frontend/commit/9cce7420305fcfe0108aea8b592b1c90cb07beb0))
* added generic $ws client [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([ee6402b](https://www.github.com/aeternity/mdw-frontend/commit/ee6402b941d70294513b401bc8d61014bb952dbe))
* display all transfers [#159](https://www.github.com/aeternity/mdw-frontend/issues/159) ([35a4bbd](https://www.github.com/aeternity/mdw-frontend/commit/35a4bbd0782a7f517c7261bf410a5f1b1b680b49))
* display internal transfers ([6528af8](https://www.github.com/aeternity/mdw-frontend/commit/6528af8479013a1b0d299946a54b31d3163ccfc0))
* names added expires at human formatted date [#61](https://www.github.com/aeternity/mdw-frontend/issues/61) ([b02ac26](https://www.github.com/aeternity/mdw-frontend/commit/b02ac2615694b17a92c106c2a0d7219a6226bee0))
* names search by name [#61](https://www.github.com/aeternity/mdw-frontend/issues/61) ([9bfb906](https://www.github.com/aeternity/mdw-frontend/commit/9bfb90671b4696e05a700d8ee3ccafbb1cbc6d21))
* return value encoder [#147](https://www.github.com/aeternity/mdw-frontend/issues/147) ([74b0b11](https://www.github.com/aeternity/mdw-frontend/commit/74b0b11fcba550d02479a8a9284b07862137c1e6))
* show dex swap info [#149](https://www.github.com/aeternity/mdw-frontend/issues/149), add_liquidity, remove_liquidity info [#148](https://www.github.com/aeternity/mdw-frontend/issues/148) ([8fca84c](https://www.github.com/aeternity/mdw-frontend/commit/8fca84cd2268fcf8e5e3ce02155369f2cab616fd))
* show loading if transaction not synced for gas price & total cost [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([dd54f90](https://www.github.com/aeternity/mdw-frontend/commit/dd54f90ace401e05ad2076a78ff7d0fbfa3b61dc))
* switch between networks [#157](https://www.github.com/aeternity/mdw-frontend/issues/157) ([1ab718c](https://www.github.com/aeternity/mdw-frontend/commit/1ab718c1b0d0cef2cd7ca7df40a90d50ade79bfa))
* the ability to sort names ASC/Desc ([#61](https://www.github.com/aeternity/mdw-frontend/issues/61)) ([d76b8aa](https://www.github.com/aeternity/mdw-frontend/commit/d76b8aaa97cf0d000740d6c0e3564451bbb7fe46))
* **token:** date format ([#134](https://www.github.com/aeternity/mdw-frontend/issues/134)) ([8df4c67](https://www.github.com/aeternity/mdw-frontend/commit/8df4c6753a8c9e4195c30cc740b0b0734722e8f1))
* **token:** default sort balances([#134](https://www.github.com/aeternity/mdw-frontend/issues/134)) ([7d21fde](https://www.github.com/aeternity/mdw-frontend/commit/7d21fde9e119c0507399cd4aeda240df642a5e73))
* tokens page search query ([4be7fbd](https://www.github.com/aeternity/mdw-frontend/commit/4be7fbdd8fa494db176fe1a5403f38ae1c366062))
* **transactions:** display internal function calls ([b90f73f](https://www.github.com/aeternity/mdw-frontend/commit/b90f73ff4fb6610e22f0bcd384dbd8e560dbde1d))
* **transactions:** page loading speed ([#134](https://www.github.com/aeternity/mdw-frontend/issues/134)) ([0d0011b](https://www.github.com/aeternity/mdw-frontend/commit/0d0011b83cc466b62164db2c646c78778107636b))
* updated sort, filter, search names [#61](https://www.github.com/aeternity/mdw-frontend/issues/61) ([ce0b26d](https://www.github.com/aeternity/mdw-frontend/commit/ce0b26d559810fc2ab3aea58d2d5c0b3abc34026))
* updated transaction status lifecycle [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([22a8557](https://www.github.com/aeternity/mdw-frontend/commit/22a8557b18c13d909c092338d7a3e81b0551dc20))


### Bug Fixes

* change/create allowance affected account content [#138](https://www.github.com/aeternity/mdw-frontend/issues/138) ([8c7dba3](https://www.github.com/aeternity/mdw-frontend/commit/8c7dba3cab87cffcbb2b2b892dfcbb02b8f16607))
* contract tx error display [#112](https://www.github.com/aeternity/mdw-frontend/issues/112) ([680a1f7](https://www.github.com/aeternity/mdw-frontend/commit/680a1f77eac9e88abdb3045b4491fc9dd2a0102b))
* create contract style ([0b3c3de](https://www.github.com/aeternity/mdw-frontend/commit/0b3c3de72c07267bfe398895d522dde44c1c8e99))
* create/change allowance display [#138](https://www.github.com/aeternity/mdw-frontend/issues/138) ([fdddbd1](https://www.github.com/aeternity/mdw-frontend/commit/fdddbd1b22da6fd5057f7283911506ae2f2ce414))
* dex swap transaction show tokens info [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([cb0e9f8](https://www.github.com/aeternity/mdw-frontend/commit/cb0e9f8c7f959dd5360a4865754590eda436782c))
* fetch node import ([5eef237](https://www.github.com/aeternity/mdw-frontend/commit/5eef237f06717277d14526cf657057f835766543))
* hide sender, recipient when transaction is allowance [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([81fc32a](https://www.github.com/aeternity/mdw-frontend/commit/81fc32af6dac2b1c189fafe53dae984a2b8a9788))
* hide sender, recipient when transaction is swap [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([dcbe210](https://www.github.com/aeternity/mdw-frontend/commit/dcbe2105c737ef7eb6b7e982062a1c51829cfda6))
* load related transaction token info [#138](https://www.github.com/aeternity/mdw-frontend/issues/138) ([77a6ef5](https://www.github.com/aeternity/mdw-frontend/commit/77a6ef51b1713d76c54ba6d9e9e17a7046132a7a))
* merge conflict ([24c5f0b](https://www.github.com/aeternity/mdw-frontend/commit/24c5f0b5cb37c8b652a40518cc6690d0d9ec4bab))
* merge conflicts [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([99cbc23](https://www.github.com/aeternity/mdw-frontend/commit/99cbc2339f0a7c2ed93f08691ea426bb036e478b))
* missing args, methdos in transactions view ([#112](https://www.github.com/aeternity/mdw-frontend/issues/112)) ([7504ed5](https://www.github.com/aeternity/mdw-frontend/commit/7504ed5d1c274731c7edb96755d910ca7b825346))
* missing args, method ([#112](https://www.github.com/aeternity/mdw-frontend/issues/112)) ([c471cf4](https://www.github.com/aeternity/mdw-frontend/commit/c471cf44184bb210a20ae3b446de0e0af5624c3e))
* missing token info title ([96874f1](https://www.github.com/aeternity/mdw-frontend/commit/96874f142590e268b27fada333c8bc3a37ed3395))
* names sort by expiration height [#61](https://www.github.com/aeternity/mdw-frontend/issues/61) ([dde5db4](https://www.github.com/aeternity/mdw-frontend/commit/dde5db473ec8489c323813fdad14e68b85d23dc1))
* network switcher dropdown style [#157](https://www.github.com/aeternity/mdw-frontend/issues/157) ([9c83bc2](https://www.github.com/aeternity/mdw-frontend/commit/9c83bc2438591d5548d22db37e78fbc949d7e001))
* nuxt config ([8a0a4c3](https://www.github.com/aeternity/mdw-frontend/commit/8a0a4c31a3b99366ef5fe4fe8657a58a44de997b))
* remove ae prefix for add_liquidity ([fe143c7](https://www.github.com/aeternity/mdw-frontend/commit/fe143c792d1c527b93028b5224421b11df145ff8))
* show token info if transaction reverted [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([21ae96d](https://www.github.com/aeternity/mdw-frontend/commit/21ae96dc0bb120545e17b1db7393f3250ac5fd2d))
* store utils ([7f94f8c](https://www.github.com/aeternity/mdw-frontend/commit/7f94f8c5978f1990499e9e2072acf93eb6ec064b))
* swap_exact_ae_for_tokens, swap_exact_tokens_for_ae [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([c0f75fb](https://www.github.com/aeternity/mdw-frontend/commit/c0f75fb4ddac17b55c740ab7076effb72d4fa6d8))
* token amount [#138](https://www.github.com/aeternity/mdw-frontend/issues/138) ([983f043](https://www.github.com/aeternity/mdw-frontend/commit/983f043990509ca6be36ea0ad93c9be294e926ac))
* token info create|change_allowance [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([33126d3](https://www.github.com/aeternity/mdw-frontend/commit/33126d322ed541d6a70d681e2a7deaca5d4469e4))
* token info loader [#138](https://www.github.com/aeternity/mdw-frontend/issues/138) ([22d73ac](https://www.github.com/aeternity/mdw-frontend/commit/22d73acd0248e94bc2c6ef1a9fb24c9a5e02b54c))
* token link display [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([18336a6](https://www.github.com/aeternity/mdw-frontend/commit/18336a63ff2bede9b911ad60d78dab9b187e66a8))
* token titles, info ([3a91f52](https://www.github.com/aeternity/mdw-frontend/commit/3a91f525a69ed275ddf0e87ddbc0d6a586a77973))
* token view load more filter data [#158](https://www.github.com/aeternity/mdw-frontend/issues/158) ([ba1cef2](https://www.github.com/aeternity/mdw-frontend/commit/ba1cef24bc961f841f93b586262f4d64d02e3e48))
* transaction block confirmation [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([e111dc7](https://www.github.com/aeternity/mdw-frontend/commit/e111dc790881d29aed065bdc8ed4c2c93f1097c9))
* transaction status alignment [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([8ac9369](https://www.github.com/aeternity/mdw-frontend/commit/8ac936970ad8e6d9fd6f5d6361359bf493818a66))
* transaction status style [#100](https://www.github.com/aeternity/mdw-frontend/issues/100) ([2997bab](https://www.github.com/aeternity/mdw-frontend/commit/2997bab5ceefa7b7a1f87b2cd026caf084ca181d))
* transaction token info [#149](https://www.github.com/aeternity/mdw-frontend/issues/149) ([7c083b6](https://www.github.com/aeternity/mdw-frontend/commit/7c083b688414c6e3e6b05717f36e8f8ba3784e2f))
* transactions page load more on all ([38aa55f](https://www.github.com/aeternity/mdw-frontend/commit/38aa55fa0dba69b5a6030521d3f4e8d586792207))
* tx function [#112](https://www.github.com/aeternity/mdw-frontend/issues/112) ([dc884a1](https://www.github.com/aeternity/mdw-frontend/commit/dc884a1beaf80ab4e1a86087939bedaf65c9a41d))
* updated add liquidity values [#148](https://www.github.com/aeternity/mdw-frontend/issues/148) ([d70edd2](https://www.github.com/aeternity/mdw-frontend/commit/d70edd28a14f761b78da697bc7ebda746694d0d0))
* use next pagination across project ([71452c5](https://www.github.com/aeternity/mdw-frontend/commit/71452c50fb301cd2c196cd2a4d01a72d6d7fab45))


### Miscellaneous

* array instead of object on transactions page ([de5b998](https://www.github.com/aeternity/mdw-frontend/commit/de5b99877af7bdebb6f1e4b7ca5177d7dcb12527))

## [0.4.0](https://www.github.com/aeternity/mdw-frontend/compare/v0.3.0...v0.4.0) (2021-11-26)


### Features

* **accountPage:** show/hide 0 balances ([e0af085](https://www.github.com/aeternity/mdw-frontend/commit/e0af08505339ba5f8e729db9c275203662a4ed54))
* **account:** show tokens balances ([4ffa817](https://www.github.com/aeternity/mdw-frontend/commit/4ffa817e20473dde88d8f6f7690b3adfdcd49856))
* adjust AE prefixed amount ([2e0027d](https://www.github.com/aeternity/mdw-frontend/commit/2e0027dadae1036845685a9f8a5c83c593fb998f))
* **contractCallTx:** extended tx info ([3e8d18b](https://www.github.com/aeternity/mdw-frontend/commit/3e8d18bc34ba6ab58e5973ed9a569f5561c53795))
* **contractCallTx:** show status ([41ec0e5](https://www.github.com/aeternity/mdw-frontend/commit/41ec0e59ef723ac0cd9f9ebef60ad5227e495db7))
* **contractCreateTx:** show extended information ([a54c509](https://www.github.com/aeternity/mdw-frontend/commit/a54c5096ee21e71e0fd3050a856106dee521331d))
* handle filters through queries ([0c18fd8](https://www.github.com/aeternity/mdw-frontend/commit/0c18fd8e4e81546ea009741bbd37d6a4c221a628))
* **router:** redirect 'account/transactions/_id' to 'account/_id' ([61c8277](https://www.github.com/aeternity/mdw-frontend/commit/61c8277f1c57907a7a17ec25727510a0848b60e6))
* show api docs and version ([f05755c](https://www.github.com/aeternity/mdw-frontend/commit/f05755c892604e1723be3a6a73b10db7be14a6bd))
* **tokenPage:** display token transfers ([b950e46](https://www.github.com/aeternity/mdw-frontend/commit/b950e462496033410543526cb07d7037158d9360))
* **tokenPage:** display tokens balances per account ([758ac31](https://www.github.com/aeternity/mdw-frontend/commit/758ac3126a36170b8b3cc496d860184bc8b26df2))
* tokens dedicated page ([cd80810](https://www.github.com/aeternity/mdw-frontend/commit/cd80810de1b91a2e49a713d9d4bd2035f11da9dd))


### Bug Fixes

* **accountPage:** display if the account is not found ([859a52d](https://www.github.com/aeternity/mdw-frontend/commit/859a52d603711cf25d1b2df938b9d18678537e20))
* address transactions pagination bug ([6e8dcc2](https://www.github.com/aeternity/mdw-frontend/commit/6e8dcc288bfc65d56d33f5549b98c7b03286b2b8))
* hide irrelevant aex9 send and received filters on transactions page ([f40d57b](https://www.github.com/aeternity/mdw-frontend/commit/f40d57bff2e3aa010b2b2450b404981927598043))
* store properly tokens information in vuex ([4015070](https://www.github.com/aeternity/mdw-frontend/commit/4015070e86200ecd39490eca2f23b8eb600c3f48))
* transactions in store handling ([f1b1969](https://www.github.com/aeternity/mdw-frontend/commit/f1b1969a136c8f13e19f15f4208e0805cde1e0c5))
* unnecesary network requests ([5fac743](https://www.github.com/aeternity/mdw-frontend/commit/5fac743242dbc1c81730bd17bc6b546c4c9c264a))


### Miscellaneous

* add commitlint and release-please workflows ([2e5d3ea](https://www.github.com/aeternity/mdw-frontend/commit/2e5d3ea70b175b2c07b25cd5a36d0e1e47c43857))


### CI / CD

* **circleci:** remove circleci config ([07fd366](https://www.github.com/aeternity/mdw-frontend/commit/07fd3665414270f1b98da582fae1e13760b80fd8))
