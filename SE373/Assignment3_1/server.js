const express = require('express')
const hbs = require('hbs')

var app = express();

app.set('view engine', hbs);
hbs.registerPartials(__dirname + '/views/partials');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({extended:false}));
app.listen(3000, ()=> {
    console.log("Server is running on port 3000");
});
function RandomNumber(o) {
    var num = Math.random() * (o.high - o.low) + o.low;
    if (o.dataType == "INT")
        return Math.round(num);
    return num;
}

app.get('/', (req, res) => {
    res.render("index.hbs", {
        title: "Assignment 3-1"
    })
});

app.all('/results', (req, res) => {
    res.render('results.hbs', {
        title: "Assignment 3-1",
        size: req.body.gridSize
    });
});

hbs.registerHelper('select', ()=> {
    var select = '';
    var options = [3, 4, 5, 10, 20];

    var name = 'gridSize';
    select += `<select name='${name}'>`
    for (let i = 0; i < options.length; i++){
        select += `<option value='${options[i]}'>${options[i]}</option>`;
    }
    select += `</select>`
    return select;
});

hbs.registerHelper('table', (req, res) => {
    var table = '';
    var size = req.data.root.size;
    console.log(req);
    table += '<table>'
    for (let i = 0; i < size; i++){
        table += '<tr>'
        for(let i = 0; i < size; i++){
            var col = ((1<<24)*Math.random()|0).toString(16);
            for (let i = col.length; i < 6; i++){
                col = '0' + col;
            }
            table += `<td style='background-color:#${col};'>`;
            table += `<span style='color:#000000>${col}</span>`;
            table += '<br />';
            table += `<span style='color:#ffffff'>${col}</span>`;
            table += '</td>'
    
        }
        table += '</tr>'
    }
    table += '</table>';
    return table;
});