const express = require('express')
const router = express.Router()
const {LocInst} = require('../models');


router.get("/", async (req, res) => {
    try {
       const data = await LocInst.findAll()
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/:matricula", async (req, res) => {
    try {
       const data = await LocInst.findOne({
           where: {
               user: req.params.matricula
           }
       })
       if (!data)
       return res.status(404).send({error: "Não encontrado"})
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.post("/", async (req, res) => {
    try {
       const data = await LocInst.create(req.body)
         
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.post("/edit", async (req, res) => {
    try {
        const data = await LocInst.findOne({
            where: {
                user: req.body.user
            }
        })
        if (!data)
        return res.status(404).send({error: "Não encontrado"})
        data.LocInst = req.body.LocInst
        await data.save()
        return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.post("/delete", async (req, res) => {
    try {
        const data = await LocInst.findOne({
            where: {
                user: req.body.user
            }
        })
        if (!data)
        return res.status(404).send({error: "Não encontrado"})
        data.LocInst = req.body.LocInst
        await data.destroy()
        return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
module.exports = app => app.use('/LocInst', router)