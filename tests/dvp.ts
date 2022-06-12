import * as anchor from '@project-serum/anchor';
import { Program } from '@project-serum/anchor';
import { findProgramAddressSync } from '@project-serum/anchor/dist/cjs/utils/pubkey';
import { Dvp } from '../target/types/dvp';

export function loadWalletKey(keypairFile:string): anchor.web3.Keypair {
  if (!keypairFile || keypairFile == '') {
    throw new Error('Keypair is required!');
  }
  const fs = require("fs");
  const loaded = anchor.web3.Keypair.fromSecretKey(
    new Uint8Array(JSON.parse(fs.readFileSync(keypairFile).toString())),
  );
  console.log(`using wallet: ${loaded.publicKey}`);
  return loaded;
}

describe('dvp', () => {

  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.Provider.env());

  const program = anchor.workspace.Dvp as Program<Dvp>;

  const testUserKP = loadWalletKey("./TSTvzYALftrptX4V2sVKVn9EU6ogtwbdPnpc63w21s5.json")


  it('Is signed up!', async () => {
    const uid = new anchor.BN("16358092002033784");
    const uname = "Andy#007";
    const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("discord"));
    const seed2 = uid.toArray("le",8);
    console.log(seed2);
    const [userAccount, _bump] = findProgramAddressSync([seed1, seed2], program.programId);
    console.log(userAccount);
    console.log(program.programId.toBase58());
    const tx = await program.rpc.singup(uid, uname, 
    {
      accounts: {
        signer: testUserKP.publicKey,
        userAccount,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [testUserKP]
    });
    console.log("Your transaction signature", tx);
  });
});
