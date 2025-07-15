import {ActionGetResponse, ACTIONS_CORS_HEADERS} from "@solana/actions"
import * as anchor from '@coral-xyz/anchor';
import { Voting } from "anchor/target/types/voting";
import idl from '@/../anchor/target/idl/voting.json';

export const OPTIONS=GET;
export async  function GET (request:Request){

    const actionMetaData: ActionGetResponse={

        icon :"https://img.freepik.com/free-photo/cashew-butter-dark-background_1150-45402.jpg?semt=ais_hybrid&w=740" ,
        title:"Vote for your favourite  type of peanut butter!",
        description:"Vote between crunchy and smooth peanut  butter!!",
        label:"Vote now!",
        links:{
            actions:[
                {
                href:'/api/vote?candidate=Crunchy',
                label:'Vote Crunchy' ,
                type:"post"
            } ,
                {
                href:'/api/vote?candidate=Smooth',
                label:'Vote Smooth',
                type:"post"
            }
        ]
        }

    }
    return Response.json(actionMetaData ,{headers:ACTIONS_CORS_HEADERS});

}

export async function  POST (request:Request){


    //create a connection with Solana local validator.
    const connection = new anchor.web3.Connection("http://127.0.0.1:8899" , "confirmed");
    /* Create a TypeScript interface to my Anchor voting program (with correct types), using this RPC connection, so I can easily build instructions, simulate or send transactions, and fetch accounts.*/
    const program : anchor.Program<Voting>= new anchor.Program(idl as Voting , {connection});

    

    


}

