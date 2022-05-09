import { expect } from 'chai';
import { Wallet } from 'ethers';
import { ethers } from 'hardhat';
import { Collector } from '../../typechain-types';
import {
  ActorFixture,
  collectorDeployerFixture,
  CollectorDeployerFixture,
  createFixtureLoader,
  provider,
} from '../shared';
import { LoadFixtureFunction } from '../types';

let loadFixture: LoadFixtureFunction;

describe('unit/CollectorDeployer', () => {
  const actors = new ActorFixture(provider.getWallets(), provider);
  let context: CollectorDeployerFixture;

  before('loader', async () => {
    loadFixture = createFixtureLoader(provider.getWallets(), provider);
  });

  beforeEach('create fixture loader', async () => {
    context = await loadFixture(collectorDeployerFixture);
  });

  describe('#deploy', () => {
    let subject: (sender: Wallet, _beneficiaryAddr: string) => Promise<any>;

    before(() => {
      subject = (sender: Wallet, _beneficiaryAddr: string) =>
        context.collectorDeployer.connect(sender).deploy(_beneficiaryAddr);
    });

    describe('works and', () => {
      it('emits the deployed event', async () => {
        await expect(subject(actors.owner(), actors.beneficiary().address))
          .to.emit(context.collectorDeployer, 'Deployed')
          .withArgs(context.address);
      });

      it('deploys the Collector contract', async () => {
        await subject(actors.deployer(), actors.beneficiary().address);
        const instance = (await ethers.getContractAt('Collector', context.address)) as Collector;
        expect(await instance.beneficiary()).to.be.eq(actors.beneficiary().address);
      });
    });
  });

  describe('#getAddress', () => {
    describe('works and', () => {
      it('returns the contract address when not deployed', async () => {
        expect(context.address).to.be.properAddress;
      });

      it('returns the same address when deployed', async () => {
        await context.collectorDeployer.deploy(actors.beneficiary().address);
        expect(await context.collectorDeployer.getAddress()).to.be.eq(context.address);
      });
    });
  });
});
