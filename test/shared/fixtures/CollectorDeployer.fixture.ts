import { Fixture } from 'ethereum-waffle';
import { waffle } from 'hardhat';
import { CollectorDeployer, CollectorDeployer__factory } from '../../../typechain-types';

export type CollectorDeployerFixture = {
  collectorDeployer: CollectorDeployer;
  salt: string;
  address: string;
};

export const collectorDeployerFixture: Fixture<CollectorDeployerFixture> = async ([wallet]) => {
  const collectorDeployer = (await waffle.deployContract(wallet, {
    abi: CollectorDeployer__factory.abi,
    bytecode: CollectorDeployer__factory.bytecode,
  })) as CollectorDeployer;

  // keccak256('io.giveth.collector-contract')
  const salt = '0x75c6784acee2c96dcc25b3d5ed873a49c07b6a9d49183ab3befda047606a3b83';

  const address = await collectorDeployer.getAddress();

  return {
    collectorDeployer,
    salt,
    address,
  };
};
