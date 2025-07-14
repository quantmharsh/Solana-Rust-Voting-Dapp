import {ActionGetResponse, ACTIONS_CORS_HEADERS} from "@solana/actions"


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

