"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
let SolanaPrice = 1;
let KrishTokenValue = 1;
const SolanaTrack = {};
app.post("/deposit", (req, res) => {
    const { solana, address, id } = req.body;
    if (!SolanaTrack[id]) {
        SolanaTrack[id] = {
            address,
            solana
        };
    }
    else {
        SolanaTrack[id].solana = solana + SolanaTrack[id].solana;
    }
    const mintTokenQuantity = MintKrishToken(solana);
    if (!SolanaTrack[id].krishToken) {
        SolanaTrack[id].krishToken = mintTokenQuantity;
    }
    else {
        SolanaTrack[id].krishToken += mintTokenQuantity;
    }
    res.json({
        Wallet: {
            krish: SolanaTrack[id].krishToken
        }
    });
});
app.post("/withdraw", (req, res) => {
    const { krish, id } = req.body;
    const diff = 1 - KrishTokenValue;
    SolanaTrack[id].solana += SolanaTrack[id].solana * diff;
    if (SolanaTrack[id].krishToken) {
        SolanaTrack[id].krishToken -= krish;
    }
    res.json({
        Wallet: {
            solana: SolanaTrack[id].solana
        }
    });
});
app.get("/wallet/:id", (req, res) => {
    const { id } = req.params;
    res.json({
        wallet: SolanaTrack[id]
    });
});
app.listen(3000, () => {
    console.log("Server Started at port 3000");
});
function MintKrishToken(solana) {
    const returnValue = KrishTokenValue * solana;
    KrishTokenValue -= 0.01;
    return returnValue;
}
