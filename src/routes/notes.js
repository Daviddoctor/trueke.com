const express = require("express");
const router = express.Router();

const Note = require("../models/Note"); /* Esta linea se usa para obtener el Schema creado en Note.js*/


router.get("/notes/add", (req, res) => {
  res.render("notes/new-note");
});

router.post("/notes/new-note", async (req, res) => {
  const {title, description}= req.body;
  const errors = [];
  if(!title){
    errors.push({text:"Por Favor Escriba Titulo"});
  }
  if(!description){
    errors.push({texto:"Por Favor Agregue Una Descripción"});
  }
  if(errors.length > 0){
    res.render("notes/new-note", {
      errors,
      title,
      description
    });
  }else{
    const newNote = new Note({title, description}); /*Esta linea sirve para crear la nota y poderla almacenar*/
    await newNote.save();
    res.redirect("/notes");
  }
});


router.get("/notes", async (req, res) => {
const notes = await Note.find() .sort({date: 'desc'});
res.render("notes/all-notes", { notes });

});

module.exports = router;
