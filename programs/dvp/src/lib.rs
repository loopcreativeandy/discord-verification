use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod dvp {
    use super::*;
    pub fn singup(ctx: Context<SignUpAccounts>, dc_id: u64, dc_name: String) -> ProgramResult {
        let user_account = &mut ctx.accounts.user_account;
        if name.as_bytes().len() > UserAccount::MAX_NAME_LENGH {
            msg!("User Name too long! ({} characters max)",UserAccount::MAX_NAME_LENGH)
            panic!();
        }
        user_account.state = 1;
        user_account.wallet = ctx.accounts.signer.key();
        user_account.discord_id = dc_id;
        user_account.discord_name = dc_name;
        msg!("Signed up {} ({})",dc_name,dc_id)
        Ok(())
    }
}

#[account]
#[derive(Default)]
pub struct UserAccount {
    state: u8,
    wallet: Pubkey,
    discord_id: u64, //eg. 16358092002033784
    discord_name: String // 37 char max
}

impl UserAccount {
    pub const MAX_NAME_LENGH: usize: 37;
    pub const MAX_SIZE: usize = 1 + 32 + 64 + (4 + MAX_NAME_LENGH);
}

#[derive(Accounts)]
pub struct SignUpAccounts<'info> {
    #[account(init, payer = signer, space = 8 + UserAccount::MAX_SIZE,
        seeds = [b"discord", signer.key().as_ref()], bump)]
    pub user_account: Account<'info, UserAccount>,
    pub signer: Signer<'info>,
    pub system_program: Program<'info, System>
}


