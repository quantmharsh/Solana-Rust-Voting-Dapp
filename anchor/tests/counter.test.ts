import { startAnchor } from "solana-bankrun";
import { BankrunProvider } from "anchor-bankrun";
import { PublicKey } from '@solana/web3.js';
import * as anchor from '@coral-xyz/anchor';
import { BN, Program } from "@coral-xyz/anchor";

//make sure to change anchor.toml contract name . 
//whenever to Anchor build
//copy the  programs/voting/target/deploy/voting.so
//into  /tests/(create folder(fixtures)) .paste voting.so 


const IDL = require("../target/idl/voting.json");
import { Voting } from '../target/types/voting';
import { Anchor } from "lucide-react";

const PUPPET_PROGRAM_ID = new PublicKey("wYCpxJZHNXBZdST973UMJV1JmPVZ4gT8jaCVNFt5545");

describe('Create a system account', () => {
  let context;
  let provider;
  let puppetProgram ;
  // anchor.setProvider(anchor.AnchorProvider.env());

  // let puppetProgram=  anchor.workspace.Voting as  Program<Voting>;
  
  beforeAll(async() => {
    // // Initialize the provider properly
    provider = anchor.AnchorProvider.env();
    anchor.setProvider(provider);
    puppetProgram = anchor.workspace.Voting as Program<Voting>;
  });

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
    ).accounts({
      signer: provider.wallet.publicKey,
      pollAccount: pollAddress,
      systemProgram: anchor.web3.SystemProgram.programId,
    }).rpc();     // .rpc to eexecute the function

    const pollAccount = await puppetProgram.account.pollAccount.fetch(pollAddress);
    console.log(pollAccount);
    
    expect(pollAccount.pollName).toEqual("test-poll");
    expect(pollAccount.pollDescription).toEqual("description");
    expect(pollAccount.pollVotingStart.toNumber()).toBeLessThan(pollAccount.pollVotingEnd.toNumber());

    

  });
// Need to work with initialize Candidate unable to do transaction through dialto
  test( "Initialize Candidate" , async()=>{
    console.log("Starting candidates initialization");
    const pollId = new anchor.BN(1);

  // Helper to initialize a candidate
  const initCandidate = async (candidateName: string) => {
    console.log("Inside init candidte method");
    const [candidateAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from(candidateName)],
      puppetProgram.programId
    );
    console.log("Got candidate Address" , candidateAddress);

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
      puppetProgram.programId
    );

    console.log("Got Poll Address" , pollAddress);
    try {
      await puppetProgram.methods
        .initializeCandidate(pollId, candidateName)
        .accounts({
          signer: provider.wallet.publicKey,
          pollAccount: pollAddress,
          candidateAccount: candidateAddress,
          systemProgram: anchor.web3.SystemProgram.programId,
        })
        .rpc();
      console.log(`Initialized candidate: ${candidateName}`);
    } catch (error) {
      console.error(`Error initializing candidate ${candidateName}:`, error);
      throw error;
    }
  };
  
  console.log("Going  to initialize candidates");
  // Initialize both candidates
  await initCandidate("Smooth");
  await initCandidate("Crunchy");
  console.log("Both Candidates Initialized Successfully");
    const [crunchyAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8) ,Buffer.from("Crunchy")],
      puppetProgram.programId
    );
    const crunchyCandidate =await puppetProgram.account.candidateAccount.fetch(crunchyAddress);
    console.log(crunchyCandidate);

     const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8) ,Buffer.from("Smooth")],
      puppetProgram.programId
    );
    const smoothCandidate =await puppetProgram.account.candidateAccount.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(crunchyCandidate.candidateName).toBe("Crunchy");
expect(crunchyCandidate.candidateVotes.toNumber()).toBe(0);
expect(smoothCandidate.candidateName).toBe("Smooth");
expect(smoothCandidate.candidateVotes.toNumber()).toBe(0);


    

  }) 
  test("Vote" , async()=>{
      const pollId = new anchor.BN(1);
    const candidateName = "Smooth";
    const [candidateAddress] = PublicKey.findProgramAddressSync(
      [pollId.toArrayLike(Buffer, "le", 8), Buffer.from(candidateName)],
      puppetProgram.programId
    );

    const [pollAddress] = PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
      puppetProgram.programId
    );


await puppetProgram.methods
      .vote(pollId,candidateName).accounts({
        signer: provider.wallet.publicKey,
        pollAccount: pollAddress,
        candidateAccount: candidateAddress,
      }).rpc();
      
         const [smoothAddress] = PublicKey.findProgramAddressSync(
      [new anchor.BN(1).toArrayLike(Buffer, "le", 8) ,Buffer.from("Smooth")],
      puppetProgram.programId
    );
    const smoothCandidate =await puppetProgram.account.candidateAccount.fetch(smoothAddress);
    console.log(smoothCandidate);
    expect(smoothCandidate.candidateName).toBe("Smooth");
// expect(smoothCandidate.candidateVotes.toNumber()).toBe(1);
  })

});