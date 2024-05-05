import express from "express";
import ejs from "ejs";
import {Player, Team } from "./interfaces";
import { connect, getPlayers, checkDB } from "./database";
import dotenv from "dotenv";


const app = express();
app.use(express.static("public"));    
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended:true}))

app.set("view engine", "ejs"); 
app.set("port", 3001);

let players: Player[] = [];


app.get("/", (req, res) => {
  res.render("index", {players: players});
});

app.get("/filter", (req, res) => {
  const queryParam = req.query.query;
  const query = Array.isArray(queryParam) ? queryParam[0] : queryParam;
  
  if (typeof query !== 'string') {
    return res.redirect('/');
}
    const filtered = players.filter(player =>
      player.name.toLowerCase().includes(query.toLowerCase())
  );
  res.render('index', { players: filtered, query });
});

app.get("/players", (req, res) => {
  res.render("players", {players: players});
});

app.get("/detail/:id", (req, res) => {
  const id = req.params.id;
  const player = players.find(obj => obj.id ===id);
  res.render('detail', { player });
});

app.get("/team/:id", (req, res) => {
  const id = req.params.id;
  const player = players.find(obj => obj.team.id ===id);
  res.render('team', { player });
});

app.get("/teams", (req, res) => {

  res.render('teams',{players})
});



app.listen(app.get("port"), async () => {

      await connect();
      checkDB();
      players = await getPlayers();
      console.log(`Server is running on port ${app.get("port")}`);
  });