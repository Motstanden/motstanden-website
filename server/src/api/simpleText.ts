import express from "express";

const router = express.Router();

router.get("/simple-text/:key", (req, res) => { 

    // Todo

    res.end()
})

export default router