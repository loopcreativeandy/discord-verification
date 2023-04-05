import { useAnchorWallet, useConnection, useWallet } from '@solana/wallet-adapter-react';
import { Keypair, PublicKey, SystemProgram, Transaction, TransactionInstruction, TransactionMessage, TransactionSignature, VersionedTransaction } from '@solana/web3.js';
import { FC, useCallback } from 'react';
import { notify } from "../utils/notifications";
import { useRouter } from 'next/router';
import { AnchorProvider, BN, Program } from "@coral-xyz/anchor";
import { Dvp, IDL}  from "../idl/dvp";

export const SignupComponent: FC = () => {
    const router = useRouter();
    const {uid, name} = router.query;

    const { connection } = useConnection();
    const { publicKey, sendTransaction } = useWallet();

    const anchorWallet = useAnchorWallet();
    const anchorProvider = new AnchorProvider(connection, anchorWallet, {});

    const programId = new PublicKey("DVPyjRxvx7ABzpnFCrvdDB2kLd1FDQBkRzfrLpHtnNvk");
    const program = new Program<Dvp>(IDL, programId, anchorProvider);

    const onClick = useCallback(async () => {
        if (!name || !uid){
            notify({ type: 'error', message: `Please provide uid and name as url parameters!` });
            console.log('error', `Please provide uid (Discord user id) and name (Discord user name) as url parameters!`);
            return;
        }

        if (!publicKey) {
            notify({ type: 'error', message: `Wallet not connected!` });
            console.log('error', `Send Transaction: Wallet not connected!`);
            return;
        }

        let signature: TransactionSignature = '';
        try {

            // Create instructions to send, in this case a simple transfer
            const instructions: TransactionInstruction[] = [];

            const uidbn = new BN(uid);
            const uname: string = name as string;
            const seed1 = Buffer.from("discord");
            const seed2 = uidbn.toArray("le",8);
            const [userAccountPDA, _bump] = PublicKey.findProgramAddressSync([seed1, seed2], program.programId);

            const ix = await program.methods.singup(uidbn, uname)
                .accounts({
                    signer: publicKey, 
                    userAccount: userAccountPDA,
                    systemProgram: SystemProgram.programId
                })
                .instruction();
            instructions.push(ix);



            // Get the lates block hash to use on our transaction and confirmation
            let latestBlockhash = await connection.getLatestBlockhash()

            // Create a new TransactionMessage with version and compile it to legacy
            const messageLegacy = new TransactionMessage({
                payerKey: publicKey,
                recentBlockhash: latestBlockhash.blockhash,
                instructions,
            }).compileToLegacyMessage();

            // Create a new VersionedTransacction which supports legacy and v0
            const transation = new VersionedTransaction(messageLegacy)

            // Send transaction and await for signature
            signature = await sendTransaction(transation, connection);

            // Send transaction and await for signature
            await connection.confirmTransaction({ signature, ...latestBlockhash }, 'confirmed');

            console.log(signature);
            notify({ type: 'success', message: 'Transaction successful!', txid: signature });
        } catch (error: any) {
            notify({ type: 'error', message: `Transaction failed!`, description: error?.message, txid: signature });
            console.log('error', `Transaction failed! ${error?.message}`, signature);
            return;
        }
    }, [publicKey, notify, connection, sendTransaction]);

    return (
        <div className="flex flex-row justify-center">
            {name && <label>Hello {name}!</label>}
            <div className="relative group items-center">
                <div className="m-1 absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-fuchsia-500 
                rounded-lg blur opacity-20 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
                    <button
                        className="group w-60 m-2 btn animate-pulse bg-gradient-to-br from-indigo-500 to-fuchsia-500 hover:from-white hover:to-purple-300 text-black"
                        onClick={onClick} disabled={!publicKey}
                    >
                        <div className="hidden group-disabled:block ">
                        Wallet not connected
                        </div>
                         <span className="block group-disabled:hidden" >
                            Sign Up
                        </span>
                    </button>
             </div>
        </div>
    );
};
