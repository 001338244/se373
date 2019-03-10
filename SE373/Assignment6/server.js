const express = require('express');
const hbs = require('hbs');
const mongoose = require('mongoose');
const Employee = require('./schema/employee.js');

var app = express();

app.set('view engine', hbs);
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));

mongoose.connect('mongodb://localhost:27017/Employees', { useNewUrlParser:true });
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', ()=>{
    console.log("We're connected!");
});

app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
});

//Functions
function RandomNumber(o) {
    var num = Math.random() * (o.high - o.low) + o.low;
    if (o.dataType == "INT")
        return Math.round(num);
    return num;
}
function DateFormat(o){
    return `${o.getMonth()+1}/${o.getDate()}/${o.getFullYear()}`;
}
function MoneyFormat(o){
    o = o + "";
    if (o == "") return "";
    o = "$" + parseFloat(o.replace(/,/g, "")).toFixed(2).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    o = o.replace("$-", "-$");
    return o;
}

app.get('/', (req, res) => {
    res.render("index.hbs", {
        button: { text: "Create", class: "btn-primary" }
    });
});

app.get('/edit', (req, res) => {
    let id = req.query.id;
    Employee.findOne({_id:id}, (err, data) => {
        res.render("edit.hbs", {
            data: data,
            id: id,
            button: { text:"Update", class:"btn-primary" }
        });
    });
});

app.get('/remove', (req, res) => {
    let id= req.query.id;
    Employee.findOne({_id:id}, (err, data) => {
        res.render("remove.hbs", {
            data: data,
            id: id,
            button: { text:"Delete", class:"btn-danger" }
        });
    });
});

app.all('/create', (req, res) => {
    let form = req.body;
    let data = {
        firstName: form.firstName,
        lastName: form.lastName,
        department: form.department,
        startDate: `${form.startDate} 00:00:0000`,
        jobTitle: form.jobTitle,
        salary: form.salary
    };
    let newEmployee = new Employee(data);
    newEmployee.save((err, emp) => {
        if (err) return console.error(err);
        console.log("Saved " + emp);
    });
    res.redirect('/view');
});

app.use('/update', (req, res) => {
    let form = req.body;
    let data = {
        _id: form.id,
        firstName: form.firstName,
        lastName: form.lastName,
        department: form.department,
        startDate: form.startDate,
        jobTitle: form.jobTitle,
        salary: form.salary
    };
    let updatedEmployee = new Employee(data);
    Employee.findOneAndUpdate({_id:form.id}, updatedEmployee, (err, emp) => {
        if (err) return console.error(err);
        console.log("Saved " + emp);
    });
    res.redirect('/view');
});

app.use('/delete', (req, res) => {
    let form = req.body;
    Employee.findOneAndDelete({_id:form.id}, (err) => {
        if (err) return console.error(err);
    });
    res.redirect('/view');
});


app.all('/view', (req, res) => {
    Employee.find((err, data) => {
        res.render("view.hbs", {
            data: data
        });
    });
});

hbs.registerHelper('table', (req, res) => {
    let data = req.data.root.data;
    let rows = data.length;
    let table = '';
    table += '<table class="table table-stripped">';
    table += '<tr>'
    table += '<th>First Name</th>';
    table += '<th>Last Name</th>';
    table += '<th>Department</th>';
    table += '<th class="text-center">Start Date</th>';
    table += '<th>Job Title</th>';
    table += '<th class="text-center">Salary</th>';
    table += '<th class="text-center">Update</th>';
    table += '<th class="text-center">Delete</th>';
    table += '</tr>';

    for(let i = 0; i < rows; i++) {
        table += '<tr>';
        table += `<td>${data[i].firstName}</td>`;
        table += `<td>${data[i].lastName}</td>`;
        table += `<td>${data[i].department}</td>`;
        table += `<td class="text-center">${DateFormat(data[i].startDate)}</td>`;
        table += `<td>${data[i].jobTitle}</td>`;
        table += `<td class="text-center">${MoneyFormat(data[i].salary)}</td>`;
        table += `<td class="text-center"><a href="/edit?id=${data[i]._id}">Update</a></td>`;
        table += `<td class="text-center"><a href="/remove?id=${data[i]._id}">Delete</a></td>`;
        table += '</tr>';
    }
    table += "</table>"
    return table;
});

// Error Helper
hbs.registerHelper('error404', ()=>{
    var msg = '';
    var divType = '';
    var randNum = RandomNumber({"high": 50,"low": 20,"dataType":"INT"});
    for(let i = 0; i < randNum; i++){
        var divNum = RandomNumber({"high": 3,"low": 1,"dataType":"INT"});
        if(divNum == 1){
            divType = 'shrink';
        } else if (divNum == 2){
            divType = 'rotate';
        } else {
            divType = 'still'
        }
        msg += `<div class='${divType}'>404</div>`;
    }
    return msg;
});
