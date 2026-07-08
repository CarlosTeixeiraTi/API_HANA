const express = require('express')
const router = express.Router()
const {IP30} = require('../models')

router.get("/", async (req, res) => {
    try {
       const data = await IP30.findAll()
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/:matricula", async (req, res) => {
    try {
       const data = await IP30.findOne({
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
       const data = await IP30.create(req.body)
         
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.post("/edit", async (req, res) => {
    try {
        const data = await IP30.findOne({
            where: {
                user: req.body.user
            }
        })
        if (!data)
        return res.status(404).send({error: "Não encontrado"})
        data.readerIP30 = req.body.readerIP30
        await data.save()
        return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.post("/delete", async (req, res) => {
    try {
        const data = await IP30.findOne({
            where: {
                user: req.body.user
            }
        })
        if (!data)
        return res.status(404).send({error: "Não encontrado"})
        data.readerIP30 = req.body.readerIP30
        await data.destroy()
        return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
module.exports = app => app.use('/IP30', router)