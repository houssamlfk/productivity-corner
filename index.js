const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();
const passport = require('passport')
const session = require('express-session');
const GoogleStrategy = require('passport-google-oauth20').Strategy;

var db = new sqlite3.Database("tasks.db");
db.run("CREATE TABLE IF NOT EXISTS tasks (task TEXT)");
db.close();

const app = express();

app.use(session({ secret: 'mysession', resave: false, saveUninitialized: false }));

app.use(passport.initialize());
app.use(passport.session());

passport.use(
        new GoogleStrategy(
                {
                        clientID: '148285909822-nq32fsqv0ppj0lsqr12lsm2ku3n6o3s0.apps.googleusercontent.com',
                        clientSecret: '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',
                        callbackURL: '/auth/google/callback',
                },
                function (accessToken, refreshToken, profile, done) {
                        return done(null, profile);
                }
        )
);

passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((obj, done) => done(null, obj));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.set("view engine", "ejs");

app.get('/diary', (req, res) => {
        res.render('diary');
});

app.get('/', (req, res) => {
        let isauth = req.isAuthenticated();
        res.render('homepage', { user: { isAuth: isauth } });
});

app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/' }),
        (req, res) => {
                res.redirect('/');
        }
);
app.post("/tasklist/", (req, res) => {
        let database = new sqlite3.Database("tasks.db", sqlite3.OPEN_READWRITE);
        const task_list = req.body.data;
        console.log(JSON.stringify(task_list));
        database.run("DELETE FROM tasks WHERE true");
        Object.keys(task_list).forEach((element) => {
                database.run("INSERT INTO tasks VALUES (?)", task_list[element]);
        });
        database.close();
        res.redirect("/tasklist");
});

app.get('/tasklist/', (req, res) => {
        if (!req.isAuthenticated()) {
                res.redirect('/');
        } else {
                let datab = new sqlite3.Database("tasks.db", sqlite3.OPEN_READWRITE);
                task_list_send = new Object();
                let sql = "SELECT * FROM tasks WHERE true";
                datab.all(sql, [], (err, rows) => {
                        if (err) {
                                return console.error(err.message);
                        }
                        for (let i = 0; i < rows.length; i++) {
                                task_list_send[i + 1] = rows[i].task;
                        }
                        res.render("tasklist", { data: task_list_send });
                });

                datab.close();
        }
});

app.listen(3000);
