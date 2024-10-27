var clearbtn = document.getElementById("clearbtn");
var addbtn = document.getElementById("addbtn");
var entry = document.getElementById("entry");
var container = document.getElementById("secondclass");
var data = document.getElementById("data");
var savebtn = document.getElementById("savebtn");

task_list_received = new Object();
task_list_received = JSON.parse(data.textContent);
task_list = new Object();
var task_count = 0;

Object.keys(task_list_received).forEach((element) => {
        task_count += 1;
        let button = document.createElement("input");
        button.type = "checkbox";
        button.id = task_count.toString();
        button.addEventListener("change", (e) => {
                let idx = parseInt(e.target.id);
                delete task_list[idx];
                document.getElementById("taskelement" + idx).remove();
        });
        let name = document.createElement("p");
        name.textContent = task_list_received[element];

        let div = document.createElement("div");
        div.id = "taskelement" + task_count;
        div.style.display = "flex";

        let task_complex = [];
        task_complex.push(button);
        task_complex.push(name);
        task_complex.push(task_count);

        task_list[task_count] = task_complex;

        container.appendChild(div);
        document.getElementById("taskelement" + task_count).appendChild(button);
        document.getElementById("taskelement" + task_count).appendChild(name);
});


clearbtn.addEventListener("click", () => {
        Object.keys(task_list).forEach((element) => {
                let idx = task_list[element][2];
                document.getElementById("taskelement" + idx).remove();
                delete task_list[idx];
        });
        task_count = 0;
});
addbtn.addEventListener("click", () => {
        task_count += 1;
        let button = document.createElement("input");
        button.type = "checkbox";
        button.id = task_count.toString();

        button.addEventListener("change", (e) => {
                let idx = e.target.id;
                delete task_list[idx];
                document.getElementById("taskelement" + idx).remove();
        });
        let name = document.createElement("p");
        name.textContent = entry.value;

        let div = document.createElement("div");
        div.id = "taskelement" + task_count;
        div.style.display = "flex";

        let task_complex = [];
        task_complex.push(button);
        task_complex.push(name);
        task_complex.push(task_count);

        task_list[task_count] = task_complex;

        container.appendChild(div);
        document.getElementById("taskelement" + task_count).appendChild(button);
        document.getElementById("taskelement" + task_count).appendChild(name);
        entry.value = "";
});

savebtn.addEventListener("click", () => {
        task_send = new Object();
        Object.keys(task_list).forEach((element) => {
                task_send[task_list[element][2]] = task_list[element][1].textContent;
        });
        fetch("http://localhost:3000/tasklist/", {
                method: "POST",
                body: JSON.stringify({ data: task_send }),
                headers: {
                        "Content-Type": "application/json; charset=UTF-8"
                }
        });
});

