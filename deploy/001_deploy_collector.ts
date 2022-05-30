import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { CollectorDeployer } from '../typechain-types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const BENEFICIARY_ADDRESS = '0x839395e20bbB182fa440d08F850E6c7A8f6F0780'; // griff.eth :)

  const { deployments, getNamedAccounts, ethers } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const { address } = await deploy('CollectorDeployer', {
    from: deployer,
    log: true,
  });

  const collectorDeployer = (await ethers.getContractAt('CollectorDeployer', address)) as CollectorDeployer;

  await collectorDeployer.deploy(BENEFICIARY_ADDRESS);
};

export default func;
func.tags = ['Collector'];
