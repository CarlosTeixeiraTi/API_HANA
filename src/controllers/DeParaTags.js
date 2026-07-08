const express = require('express')
const router = express.Router()
const {DeParaTags} = require('../models')

router.get("/", async (req, res) => {
    try {
       const data = await DeParaTags.findAll()
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});
router.get("/:local/:tag", async (req, res) => {
    try {
       const data = await DeParaTags.findOne({
           where: {
		local: req.params.local,
               tag: req.params.tag
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
       const data = await DeParaTags.create(req.body)
         
       return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.post("/edit", async (req, res) => {
    try {
        const data = await DeParaTags.findOne({
            where: {
                tag: req.body.tag,
		local: req.body.local
            }
        })
        if (!data)
        return res.status(404).send({error: "Não encontrado"})
        data.cosSAP = req.body.cosSAP
        await data.save()
        return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

router.post("/delete", async (req, res) => {
    try {
        const data = await DeParaTags.findOne({
            where: {
                tag: req.body.tag,
                local: req.body.local
            }
        })
        if (!data)
        return res.status(404).send({error: "Não encontrado"})
        data.tag = req.body.tag
        await data.destroy()
        return res.json(data)

    } catch (err) {
        console.log(err);
        res.status(400).send({ error: "Erro tente novamente" });
    }
});

module.exports = app => app.use('/DeParaTags', router)
