import {ActionGetResponse} from "@solana/actions"

export async  function GET (request:Request){

    const actionMetaData: ActionGetResponse={

        icon :"https://www.google.com/imgres?q=peanut%20butter&imgurl=https%3A%2F%2Fwww.nuflowerfoods.com%2Fwp-content%2Fuploads%2F2024%2F09%2Fglobe2.jpg&imgrefurl=https%3A%2F%2Fwww.nuflowerfoods.com%2Fblogs%2Fpeanut-butter-around-the-world-global-variations%2F&docid=bHqFHXdVo9M84M&tbnid=Rd5ut6Mkb7_m8M&vet=12ahUKEwi-u4iI0LeOAxWKQPUHHX_bF2wQM3oECBsQAA..i&w=900&h=600&hcb=2&ved=2ahUKEwi-u4iI0LeOAxWKQPUHHX_bF2wQM3oECBsQAA" ,
        title:"Vote for your favourite  type of peanut butter!",
        description:"Vote between crunchy and smooth peanut  butter!!",
        label:"Vote"

    }
    return Response.json(actionMetaData);

}

