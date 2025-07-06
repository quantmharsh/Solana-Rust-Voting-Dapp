import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { Voting } from "../target/types/voting";

describe("voting", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());

  const program = anchor.workspace.Voting as Program<Voting>;

  it("Initialize a poll!", async () => {
    const pollId = new anchor.BN(1);
    const [pollAddress] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("poll"), pollId.toArrayLike(Buffer, "le", 8)],
      program.programId
    );

    const startTime = new anchor.BN(Math.floor(Date.now() / 1000));
    const endTime = new anchor.BN(Math.floor(Date.now() / 1000) + 3600); // 1 hour from now

    // Add your test here.
    const tx = await program.methods
      .initializePoll(
        pollId,
        startTime,
        endTime,
        "Test Poll",
        "This is a test poll description"
      )
      .accounts({
        signer: program.provider.publicKey,
        pollAccount: pollAddress,
        systemProgram: anchor.web3.SystemProgram.programId,
      })
      .rpc();

    console.log("Your transaction signature", tx);

    // Fetch the poll account
    const pollAccount = await program.account.pollAccount.fetch(pollAddress);
    console.log("Poll created:", {
      name: pollAccount.pollName,
      description: pollAccount.pollDescription,
      startTime: pollAccount.pollVotingStart.toString(),
      endTime: pollAccount.pollVotingEnd.toString(),
    });
  });
});
