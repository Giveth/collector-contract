import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';

const func: DeployFunction = async (hre: HardhatRuntimeEnvironment) => {
  const { deployments, getNamedAccounts } = hre;
  const { deploy } = deployments;

  const { deployer } = await getNamedAccounts();

  const OWNER_ADDRESS = '0x839395e20bbB182fa440d08F850E6c7A8f6F0780';
  const BENEFICIARY_ADDRESS = '0x3EFa0Ab6F541B075cFCc2388b2E060196aC26181';

  await deploy('Collector', {
    from: deployer,
    log: true,
    args: [OWNER_ADDRESS, BENEFICIARY_ADDRESS],
    gasPrice: '35000000000',
  });
};

export default func;
func.tags = ['Collector'];
