import getPrismaInstance from "../utils/PrismaClient.js"

export const checkUser=async (req,res,next)=>{
    try{
        const {email}=req.body
        console.log(email)
        if(!email){
            console.log("email is required")
            return res.json({msg:"Email is required",status:false})
        }
        const prisma =getPrismaInstance();
        const user=await prisma.user.findUnique({where:{email}})
        console.log(user,"user")
        if(!user){
            console.log("user not found")
            return res.json(({msg:"User not found ",status:false}))
        }
        else{
            console.log("user found")
            return res.json({msg:"User found",status:true,data:user})
        }
    }catch(error){
        console.log(error)
        next(error)
    }
}

export const onBoardUser= async (req,res,next)=>{
    try{
        const {email,name,about, image:profilePicture}=req.body
        if(!email || !name || !profilePicture){
            return res.send("Email, name and image are require")
        }
        const prisma = getPrismaInstance();
        const user = await prisma.user.create({
            data:{email,name, about,profilePicture},

        })
        return res.json({msg:"Success",status:true,user})
    }catch(err){
        next(err)
    }
}


export const getAllusers = async (req, res, next) =>{
    try{
        const prisma = getPrismaInstance();
        const users= await prisma.user.findMany({
            orderBy:{name : "asc"},
            select :{
                id:true,
                email:true,
                name:true,
                profilePicture:true,
                about:true,
            }
        });
        const usersGroupYInitialLetter ={};

        users.forEach((user)=>{
            const initialLetter=user.name.charAt(0).toUpperCase();
            if(!usersGroupYInitialLetter[initialLetter]){
                usersGroupYInitialLetter[initialLetter]=[];
            }
            usersGroupYInitialLetter[initialLetter].push(user)
        })
        return res.status(200).send({users:usersGroupYInitialLetter})
    }catch(error){
        next(errpr);
    }
}