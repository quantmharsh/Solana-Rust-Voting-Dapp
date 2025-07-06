#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

#[program]
pub mod voting  {
    use super::*;

 
}

#[account]
#[derive(InitSpace)]
pub struct  PollAccount{
    #[max_len(32)]
    pub poll_name:String,
    #[max_len(280)]
    pub poll_description:String,
    pub poll_voting_start:u64,
    pub poll_voting_end:u64,
    pub poll_option_index:u64,

}
