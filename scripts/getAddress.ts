import { deployments, getNamedAccounts, network } from 'hardhat';
const { read } = deployments;

async function main() {
  const { deployer } = await getNamedAccounts();
  console.log(`deployer: ${deployer}`);
  console.log(`network: ${network.name}`);
  const res = await read('CollectorDeployer', { from: deployer }, 'getAddress');
  console.log(res);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
