import express from "express"

const app = express()

app.use(express.json())

let KrishTokenValue = 1

interface SolanaTrack{
    [id:string]:{
        address:string
        solana:number
        krishToken?:number
    }
}


const SolanaTrack:SolanaTrack = {}

interface DepositReq{    
    body:{
        solana:number,
        address:string,
        id:number
    }
}
app.post("/deposit",(req:DepositReq,res)=>{
    const {solana,address,id} = req.body
    if(!SolanaTrack[id]){
        SolanaTrack[id]={
            address,
            solana
        }
    }
    else{
        SolanaTrack[id].solana = solana + SolanaTrack[id].solana
   }
   
    const mintTokenQuantity = MintKrishToken(solana)
    if(!SolanaTrack[id].krishToken){
        SolanaTrack[id].krishToken =mintTokenQuantity; 
    }
    else{        
        SolanaTrack[id].krishToken+=mintTokenQuantity
    }
    res.json({
        Wallet:{
            krish:SolanaTrack[id].krishToken
        }
    })
})

app.post("/withdraw",(req,res)=>{
    const {krish,id}=req.body
    const diff = 1 - KrishTokenValue
    SolanaTrack[id].solana += SolanaTrack[id].solana*diff
    if(SolanaTrack[id].krishToken){
        SolanaTrack[id].krishToken-=krish
    }
    res.json({
        Wallet:{
            solana:SolanaTrack[id].solana
        }
    })

})

app.get("/wallet/:id",(req,res)=>{
    const {id} = req.params
    res.json({
        wallet:SolanaTrack[id]
    })
})

app.listen(3000,()=>{
    console.log("Server Started at port 3000");    
})

function MintKrishToken(solana:number){
    const returnValue = KrishTokenValue*solana
    KrishTokenValue-=0.01
    return returnValue
}