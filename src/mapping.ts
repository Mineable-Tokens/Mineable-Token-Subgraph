import { BigInt } from "@graphprotocol/graph-ts"
import {
  _0xBitcoinToken,
  Mint,
  OwnershipTransferred,
  Transfer,
  Approval
} from "../generated/_0xBitcoinToken/_0xBitcoinToken"
import { MintCheckpoint } from "../generated/schema"

export function handleMint(event: Mint): void {

  let _0xBitcoincontract = _0xBitcoinToken.bind(event.address)

  let epochCount = _0xBitcoincontract.epochCount()

  // Entities can be loaded from the store using a string ID; this ID
  // needs to be unique across all entities of the same type
  let entity = MintCheckpoint.load( epochCount.toString() )

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (entity == null) {
    entity = new MintCheckpoint( epochCount.toString() )

    // Entity fields can be set using simple assignments
    entity.hashrate = BigInt.fromI32(0)
  }

  entity.blockNumber = event.block.number


  entity.difficulty =   _0xBitcoincontract.getMiningDifficulty()
  entity.epochCount =   epochCount
  entity.challengeNumber =   _0xBitcoincontract.getChallengeNumber()
  entity.maxSupplyForEra =   _0xBitcoincontract.maxSupplyForEra()
  entity.miningTarget =   _0xBitcoincontract.miningTarget()
  entity.tokensMinted = _0xBitcoincontract.tokensMinted()
  entity.minterAddress = event.params.from




  if(epochCount > BigInt.fromI32(10) ){
    let pastEpochCount = epochCount - BigInt.fromI32(10)
    let pastCheckpoint = MintCheckpoint.load( pastEpochCount.toString() )
  //  let pastCheckpointEthBlock = pastCheckpoint.blockNumber

    let blockNumberDifference = event.block.number - pastCheckpoint.blockNumber

    let eth_block_solve_seconds_est = BigInt.fromI32(15)
    let block_solve_time_seconds = blockNumberDifference * eth_block_solve_seconds_est / BigInt.fromI32(10)
    let difficultyFactor = entity.difficulty * BigInt.fromI32(4194304)
    let hashrate = difficultyFactor / block_solve_time_seconds

    entity.hashrate = hashrate
  }



  let latestDifficultyPeriodStarted = _0xBitcoincontract.latestDifficultyPeriodStarted()






  entity.save()





  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.name(...)
  // - contract.approve(...)
  // - contract.lastRewardEthBlockNumber(...)
  // - contract.getMiningDifficulty(...)
  // - contract.mint(...)
  // - contract.totalSupply(...)
  // - contract.transferFrom(...)
  // - contract.rewardEra(...)
  // - contract.decimals(...)
  // - contract.getMiningTarget(...)
  // - contract._totalSupply(...)
  // - contract.getMiningReward(...)
  // - contract.getChallengeNumber(...)
  // - contract.maxSupplyForEra(...)
  // - contract.tokensMinted(...)
  // - contract.lastRewardTo(...)
  // - contract.balanceOf(...)
  // - contract.checkMintSolution(...)
  // - contract.epochCount(...)
  // - contract._MAXIMUM_TARGET(...)
  // - contract.miningTarget(...)
  // - contract.challengeNumber(...)
  // - contract.owner(...)
  // - contract.symbol(...)
  // - contract.getMintDigest(...)
  // - contract.transfer(...)
  // - contract._BLOCKS_PER_READJUSTMENT(...)
  // - contract.lastRewardAmount(...)
  // - contract.approveAndCall(...)
  // - contract.latestDifficultyPeriodStarted(...)
  // - contract.newOwner(...)
  // - contract.transferAnyERC20Token(...)
  // - contract._MINIMUM_TARGET(...)
  // - contract.allowance(...)
}

export function handleOwnershipTransferred(event: OwnershipTransferred): void {}

export function handleTransfer(event: Transfer): void {}

export function handleApproval(event: Approval): void {}
