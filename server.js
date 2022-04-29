const express = require("express");
const app = express();
const bodyparser = require("body-parser");
const session = require("express-session");
const path = require("path");
const ejs = require("ejs");
const url = require("url");
const moment = require('moment')
var clc = require("cli-color");
const cnfg = require("./config.json");
const Discord = require('discord.js');
const client = new Discord.Client();
const PORT = 8080

// engines and other

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.engine("html", ejs.renderFile);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, "/web/views"));
app.use(express.static(path.join(__dirname, "/web/public")));
app.use('/assets', express.static('assets'));
app.set('json spaces', 1)

// discord bot

 client.on('ready', () => {
   console.log("Discord client logged!")
 });

client.login(process.env.token);

// pages

app.get('/', async(req, res) => {
	res.render('index', {
		user: req.user,
		chnc: client.channels.cache.size,
		usrc: client.users.cache.size,
		gldc: client.guilds.cache.size,
		cnfg
	})
}) 

app.get('/commands', (req, res) => {
	const commands = require('./commands.json');
	const cmd = commands.commands
	res.render('commands', {
		user: req.user,
		cnfg, cmd
	})
})

// links

app.get('/invite', (req, res) => {
	res.redirect(cnfg.links.bot_invite)
})

app.get('/support', (req, res) => {
	res.redirect(cnfg.links.support_server)
})

app.get('/vote', (req, res) => {
	res.redirect(cnfg.links.vote_utl)
})

// error page

app.get("/error", (req, res) => {
  res.render("error", {
    user: req.user,
    statuscode: req.query.statuscode,
    message: req.query.message,
	cnfg
  });
});

app.use((req, res) => {
  const err = new Error("Not Found");
  err.status = 404;
  return res.redirect(
    url.format({
      pathname: "/error",
      query: {
        statuscode: 404,
        message: "Page Not Found!"
      }
    })
  );
});

// other

app.listen(PORT, () => {
	console.log("Project running on port - " + PORT)
	console.log("Github - https://github.com/vsl-dev")
	console.log("Developer - https://vsldev.tk")
})