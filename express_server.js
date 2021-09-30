const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));
const cookieParser = require('cookie-parser');

app.set("view engine", "ejs");
app.use(cookieParser())

function generateRandomString() {
  let r = (Math.random() + 1).toString(36).substring(7);
  return r;
}
// Database
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};




app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

//Homepage
app.get("/urls", (req, res) => {
  const templateVars = {
    username: req.cookies["username"],
    urls: urlDatabase
  };
  console.log(templateVars.username)
  res.render("urls_index", templateVars);
});

// Login Route
app.post('/login', (req, res) => {
  res.cookie('username', req.body.username);
  res.redirect('/urls');
})


// Logout Route
app.post('/logout',(req,res)=>{
  res.clearCookie('username');
  res.redirect('/urls');
})


// new url

 app.get("/urls/new", (req, res) => {
  //const templateVars = { username: req.cookies["username"]};
  res.render("urls_new");
});


app.get("/urls/:shortURL", (req, res) => {
  const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL]};
  res.render("urls_show", templateVars);
});

// posting new url to database
app.post("/urls", (req, res) => {
  shortURL = generateRandomString();
  urlDatabase[shortURL] = req.body.longURL; // updating the database
  console.log(req.body.longURL);  // Log the POST request body to the console
  res.redirect(`/urls/:${shortURL}`);
});

app.get("/u/:shortURL", (req, res) => {
   const longURL = urlDatabase[shortURL];
  res.redirect(longURL);
});

// updating database
app.post('/urls/:id', (req,res) => {
  let shortURL = req.params.id;
  urlDatabase[shortURL] = req.body.longURL;
  res.redirect("/urls");
})

// deleting urls
app.post('/urls/:id/delete', (req,res) => {
  delete urlDatabase[req.params.id];
  res.redirect('/urls')
})

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

