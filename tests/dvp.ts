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
  const uidstring = "16358092002033786";
  const uid = new anchor.BN(uidstring);
  const uname = "Andy#007";
  const seed1 = Buffer.from(anchor.utils.bytes.utf8.encode("discord"));
  const seed2 = uid.toArray("le",8);
  const [userAccount, _bump] = findProgramAddressSync([seed1, seed2], program.programId);


  it('Is signed up!', async () => {
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

  it('verify!', async () => {
    
    const ua = await anchor.getProvider().connection.getAccountInfo(userAccount);
    assert(ua.owner.toBase58() === program.programId.toBase58());
    assert(ua.data.at(8) === 1, "state should be 1");
    console.log(ua.data.readBigUInt64LE(8+1+32));
    assert(ua.data.readBigUInt64LE(8+1+32) === BigInt(uidstring), "user id not set correctly");
    const wallet = new anchor.web3.PublicKey(ua.data.slice(8+1, 8+1+32));
    console.log(wallet.toBase58());
    assert(wallet.toBase58() === testUserKP.publicKey.toBase58(), "user PK not set correctly");
  });
});

function assert(condition: boolean, msg = "assertion failed") {
  if(!condition)
    throw new Error(msg);
}
