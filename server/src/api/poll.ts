import express from "express";
import { AuthenticateUser } from "../middleware/jwtAuthenticate.js";

let router = express.Router() 

router.get("/polls/all", 
    AuthenticateUser(),
    (req, res) => {
        // TODO...
    }
)

router.get("/polls/latest",
    AuthenticateUser(),
    (req, res) => {
        // TODO...
    }
)

router.get("/polls/:id",
    AuthenticateUser(),
    (req, res) => {
        // TODO...
    }
)

router.post("/polls/new",
    AuthenticateUser(),
    (req, res) => {
        // TODO...
    }
)

export default router