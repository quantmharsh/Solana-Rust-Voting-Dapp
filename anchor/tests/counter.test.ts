import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { BN, Program } from "@coral-xyz/anchor";

//make sure to change anchor.toml contract name . 


const IDL = require("../target/idl/voting.json");
import { Voting } from '../target/types/voting';

const PUPPET_PROGRAM_ID = new PublicKey("FqzkXZdwYjurnUKetJCAvaUw5WAqbwzU6gZEwydeEfqS");

describe('Create a system account', () => {
  let context;
  let provider;
  let puppetProgram:any;
  beforeAll(async()=>{
 context = await startAnchor("", [{name: "voting", programId: PUPPET_PROGRAM_ID}], []);
     provider = new BankrunProvider(context);

     puppetProgram = new Program<Voting>(
      IDL,
      provider,
    );
  })

  test("bankrun", async () => {
   

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), new anchor.BN(1).toArrayLike(Buffer, "le", 8)],
      puppetProgram.programId
    );

    await puppetProgram.methods.initializePoll(
      new anchor.BN(1),
        new anchor.BN(0),
        new anchor.BN(1759508293),
        "test-poll",
        "description",
    ).rpc();     // .rpc to eexecute the function

    const pollAccount = await puppetProgram.account.pollAccount.fetch(pollAddress);
    console.log(pollAccount);
    
    expect(pollAccount.pollName).toEqual("test-poll");
     expect(pollAccount.pollDescription).toEqual("description");
      expect(pollAccount.pollVotingStart.toNumber()).toBeLessThan(pollAccount.pollVotingEnd.toNumber());

    

  });

  it( "Initialize Candidate" , async()=>{}) 

});