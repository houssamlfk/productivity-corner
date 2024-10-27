const express = require('express');
const path = require('path');
const sqlite3 = require('sqlite3').verbose();

var db = new sqlite3.Database("tasks.db");
db.run("CREATE TABLE IF NOT EXISTS tasks (task TEXT)");
db.close();

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.set("view engine", "ejs");

var authenticated = false;

app.get("/", (req, res) => {
        if (!authenticated) {
                res.render("authenticate", {});
        }

});

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

});


app.listen(3000);
