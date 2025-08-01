
use anchor_lang::prelude::*;
//Update declare id whenever re deploying the Smart Contract on solana TestNet or DevNet or MainNet
declare_id!("wYCpxJZHNXBZdST973UMJV1JmPVZ4gT8jaCVNFt5545");

//Voting Module  encapsulates all methods and structs required for voting 
#[program]
pub mod voting {
    use super::*;
    
    pub fn initialize_poll(
        //ctx is a context used to tell which  Accounts to look for while  initializing poll
        ctx: Context<InitializePoll>,
        _poll_id: u64,
        start_time: u64,
        end_time: u64,
        name: String,
        description: String,
    ) -> Result<()> {
        ctx.accounts.poll_account.poll_name = name;
        ctx.accounts.poll_account.poll_description = description;
        ctx.accounts.poll_account.poll_voting_start = start_time;
        ctx.accounts.poll_account.poll_voting_end = end_time;
        Ok(())
    }

    pub fn initialize_candidate(ctx:Context<InitializeCandidate>,
    _poll_id:u64,
    candidate:String
    ) ->Result <()>{
        ctx.accounts.candidate_account.candidate_name=candidate;
        ctx.accounts.candidate_account.candidate_votes=0;
        let poll =&mut ctx.accounts.poll_account;
        poll.poll_option_index+=1; 
    
        Ok(())
    }

    pub fn vote(ctx:Context<Vote> , _poll_id:u64 , _candidate:String)-> Result<()>{
        let candidate_account = &mut ctx.accounts.candidate_account;
        candidate_account.candidate_votes+=1;
        Ok(())
    }
}

// Specifies what accounts are passed to a function and their constraints
#[derive(Accounts)]
#[instruction(poll_id: u64)]
pub struct InitializePoll<'info> {
    #[account(mut)]
    pub signer: Signer<'info>,
    #[account(
        init_if_needed,
        payer = signer,
        space = 8 + PollAccount::INIT_SPACE,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll_account: Account<'info, PollAccount>,
    pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
#[instruction(poll_id:u64 , candidate:String)]
pub struct InitializeCandidate<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    // no need to add init or init_if_needed since poll should already exists
    #[account(
        mut,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll_account:Account<'info ,PollAccount>,
    #[account(
        init_if_needed,
        payer=signer,
        space=8+CandidateAccount::INIT_SPACE,
        seeds=[poll_id.to_le_bytes().as_ref() , candidate.as_ref()],
        bump
    )]
    pub candidate_account:Account<'info ,CandidateAccount>,
    pub system_program:Program<'info , System>,
}

#[derive(Accounts)]
#[instruction(poll_id:u64 , candidate:String)]
pub struct Vote<'info>{
    #[account(mut)]
    pub signer:Signer<'info>,
    #[account(
        mut ,
        seeds = [b"poll".as_ref(), poll_id.to_le_bytes().as_ref()],
        bump
    )]
    pub poll_account:Account<'info, PollAccount>,
    #[account(
        mut,
        seeds=[poll_id.to_le_bytes().as_ref() , candidate.as_ref()],
        bump

    )]
    pub candidate_account:Account<'info , CandidateAccount>,

}


// struct which will be stored on solana blockchain
#[account]
#[derive(InitSpace)]
pub struct PollAccount {
    #[max_len(32)]
    pub poll_name: String,
    #[max_len(280)]
    pub poll_description: String,
    pub poll_voting_start: u64,
    pub poll_voting_end: u64,
    pub poll_option_index: u64,
}
#[account]
#[derive(InitSpace)]
pub struct CandidateAccount{
    #[max_len(32)]
    pub candidate_name:String,
    pub candidate_votes:u64,
}