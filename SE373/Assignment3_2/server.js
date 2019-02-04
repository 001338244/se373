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



//put this function at the end to get a arror page
app.use((req, res, next)=>{
    const error = new Error('Page not found');
    error.status = 404;
    next(error);
});
app.use((error, req, res, next)=>{
    res.status(error.status || 500);
    res.render('error.hbs', {
        message:`${error.status} ${error.message}`
    });
});