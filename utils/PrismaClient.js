import { PrismaClient } from "@prisma/client";

let prismaInstance=null;

function getPrismaInstance(){
    console.log("In prisma function")
    if(!prismaInstance){
        console.log("Inside instacne loop")
        prismaInstance=new PrismaClient()

    }
    console.log("REturning prismainstance")
    return prismaInstance
}

export default getPrismaInstance;

