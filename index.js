"use strict"
const express = require('express');
const bodyParser = require('body-parser');
const exphbs  = require('express-handlebars');
var flash = require('express-flash');
var cookieParser = require('cookie-parser');
var cookieSession = require('cookie-session')
const Registration_numbers = require("./registration_numbers");
const pg = require('pg');
const Pool = pg.Pool; 

const app = express();

let PORT = process.env.PORT || 3000;

let useSSL = false;
if (process.env.DATABASE_URL) {
    useSSL = true;
}

const connectionString = process.env.DATABASE_URL || 'postgresql://aviwe:aviwe@localhost:5432/registrationNumbers'


const pool = new Pool({
    connectionString,
    ssl: useSSL
});

const registration_numbers = Registration_numbers(pool);

app.engine('handlebars', exphbs(
  {defaultLayout: 'main',
    helpers:{
            selectedTag: function(){
                if(this.selected){
                    return 'selected';
                }
            }
    }

 }));

app.set('view engine', 'handlebars');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: false })); // support encoded bodies
app.use(express.static('public'));

//app.use(express.cookieParser('keyboard cat'));
//app.use(express.cookieSession({ cookie: { maxAge: 60000 }}));
//app.use(flash());

app.get('/', async function(req, res, next){

    try {
        
        let registrationNumbers = await registration_numbers.getRegNums();
        let filters = await registration_numbers.selectors();
  
        res.render("registration_numbers", {registrationNumbers, filters});

    } catch (error) {
        next(error);
    }

    
});

app.post('/registration', async function(req, res, next){

  try {
        let reg_num = req.body.reg;
       // let validReg = registration_numbers.regNumberFromTown(reg_num);
       // if (validReg) {
        await registration_numbers.addRegNum(reg_num);
        
            res.redirect("/");
       // } else {
            //req.flash('info', 'Registration number must be from Cape Town, Belville, Paarl or Strand only!');
            //res.redirect('/'); 
       // }
  } catch (error) {
        next(error);
  }

});

app.post('/registration/:reg_number', async function(req, res, next){

    try {
          let reg_num = req.params.reg;
         // let validReg = registration_numbers.regNumberFromTown(reg_num);
         // if (validReg) {
          await registration_numbers.addRegNum(reg_num);
          
              res.redirect("/");
         // } else {
              //req.flash('info', 'Registration number must be from Cape Town, Belville, Paarl or Strand only!');
              //res.redirect('/'); 
         // }
    } catch (error) {
          next(error);
    }
  
  });

app.get('/reset', async function(req, res, next){

   try {
        await registration_numbers.clearRegNos();

        res.redirect("/");
   } catch (error) {
       next(error);
   }
});

app.get('/filter/:town', async function (req, res, next) {

    try {
        let town = req.params.town;
    
        let registrationNumbers = await registration_numbers.filterBySelectedTown(town);
        let filters = await registration_numbers.selectors(town);

        res.render("registration_numbers", {registrationNumbers, filters});
    } catch (error) {
        next(error);
    }
});

app.listen(PORT, function(){
  console.log('App starting on port', PORT)
})
