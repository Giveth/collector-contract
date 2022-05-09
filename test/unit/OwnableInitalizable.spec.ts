import { Wallet } from '@ethersproject/wallet';
import { ethers } from 'hardhat';
import { TestOwnableInitializable } from '../../typechain-types';
import { ActorFixture, provider, expect } from '../shared';

const { AddressZero } = ethers.constants;

describe('unit/OwnableInitalizable', () => {
  const actors = new ActorFixture(provider.getWallets(), provider);
  let context: TestOwnableInitializable;

  beforeEach(async () => {
    const factory = await ethers.getContractFactory('TestOwnableInitializable');
    context = (await factory.deploy()) as TestOwnableInitializable;
  });

  describe('#initalize', () => {
    let subject: (_ownerAddr: string) => Promise<any>;
    let testOwner: string;

    beforeEach(() => {
      subject = (_ownerAddr: string) => context.initalize(_ownerAddr);
      testOwner = actors.anyone().address;
    });

    describe('works and', () => {
      it('sets the owner', async () => {
        await subject(testOwner);
        expect(await context.owner()).to.be.eq(testOwner);
      });

      it('sets the initalized flag', async () => {
        await subject(testOwner);
        expect(await context.initalized()).to.be.true;
      });
    });

    describe('fails when', () => {
      it('already initialized', async () => {
        await subject(testOwner);
        await expect(subject(testOwner)).to.be.revertedWith('MustNotInitialized');
      });
    });
  });

  describe('#transferOwnership', () => {
    let subject: (sender: Wallet, _newOwnerAddr: string) => Promise<any>;
    let newOwner: string;

    before(() => {
      subject = (sender: Wallet, _newOwnerAddr: string) => context.connect(sender).transferOwnership(_newOwnerAddr);
      newOwner = actors.anyone().address;
    });

    beforeEach(async () => {
      await context.initalize(actors.owner().address);
    });

    describe('works and', () => {
      it('emits the ownership transferred event', async () => {
        await expect(subject(actors.owner(), newOwner))
          .to.emit(context, 'OwnershipTransferred')
          .withArgs(actors.owner().address, newOwner);
      });

      it('sets the new owner', async () => {
        await subject(actors.owner(), newOwner);
        expect(await context.owner()).to.be.eq(newOwner);
      });
    });
    describe('fails when', () => {
      it('not called by current owner', async () => {
        await expect(subject(actors.anyone(), newOwner)).to.be.revertedWith('OnlyOwner');
      });

      it('trying to transfer to zero address', async () => {
        await expect(subject(actors.owner(), AddressZero)).to.be.revertedWith('NoAddressZero');
      });
    });
  });

  describe('#renounceOwnership', () => {
    let subject: (sender: Wallet) => Promise<any>;
    let oldOwner: string;

    before(() => {
      subject = (sender: Wallet) => context.connect(sender).renounceOnwership();
      oldOwner = actors.owner().address;
    });

    beforeEach(async () => {
      await context.initalize(oldOwner);
    });

    describe('works and', () => {
      it('emits the ownership transferred event', async () => {
        await expect(subject(actors.owner()))
          .to.emit(context, 'OwnershipTransferred')
          .withArgs(actors.owner().address, AddressZero);
      });

      it('sets owner to zero address', async () => {
        await subject(actors.owner());
        expect(await context.owner()).to.be.eq(AddressZero);
      });
    });
  });
});
