import express from "express";
import ejs from "ejs";
import {Player, Team, User } from "./interfaces";
import { connect, getPlayers, checkDB,updatePlayerPos, updatePlayerAge,registerUser,createInitialUser, login } from "./database";
import dotenv from "dotenv";
import session  from "./session";


const app = express();
app.use(express.static("public"));    
app.use(express.json({ limit: "1mb" }));
app.use(express.urlencoded({ extended:true}));
app.use(session);

app.set("view engine", "ejs"); 
app.set("port", 3001);

let players: Player[] = [];
let loggedin;


app.post("/", async (req, res) => {
  const username_signin: string = req.body.username_signin;
  const password_signin: string = req.body.password_signin;
  console.log(username_signin);
  console.log(password_signin);
      try {
          await registerUser(username_signin, password_signin);
          loggedin = true;
          res.redirect("/");
      }
      catch {
          res.redirect("/");
      }
});

app.post("/login", async (req, res, next) => {
  if (req.body.username) {
      const username: string = req.body.username;
      const password: string = req.body.password;
      try {
          let user: User | undefined =  await login(username, password);  
          console.log(user);
          if (user) {
              console.log("logged in")
              delete user.password;
              req.session.user = user;
              loggedin = true;
              res.redirect("/");
          }
      } catch (e: any) {
        console.log("geen user")
          res.redirect("/");
      }
  }
  else {
      next();
  }
});

app.post("/logout", async(req, res) => {
  req.session.destroy(() =>{
      res.redirect("/");
      console.log("logged out")
  });
})


app.get("/", (req, res) => {
  res.render("index", {players: players});
});

app.post('/updateAge', (req, res) => {

  const {ageInput,name}  = req.body;
  updatePlayerAge(ageInput,name)  .then(() => {
    console.log("gelukt")
  })
});

app.get('/updateAge', (req, res) => {
  res.render('index', players);
});


app.post('/updatePos', (req, res) => {
  const Pos  = req.body.position;
  const newPos = req.body.position.option;
  
  let update = updatePlayerPos(Pos,newPos)
  .then(() => {
      res.send('Player position updated successfully!');
      
      console.log("gelukt")
  })

  res.render('index', { update, players });
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
      createInitialUser();
      players = await getPlayers();
      console.log(`Server is running on port ${app.get("port")}`);
  });