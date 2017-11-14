var express = require('express');
var fs = require('fs')
var bodyParser = require('body-parser');
var Tesseract = require('tesseract.js')
//var formidable = require('express-formidable');
var fileUpload = require('express-fileupload');
var app = express();

app.set('view engine', 'html');

app.use(bodyParser.urlencoded({
  extended: true
}));

app.use(express.static(__dirname + '/public'));

//app.use(formidable());
app.use(fileUpload());

var myImage = require('path').resolve(__dirname, 'test2.jpg');


app.get('/', function(req, res) {
  //Tesseract.recognize(myImage, {
  //  lang: 'spa',
  //})
  //.then(function(result) {
  //  console.log("=============");
  //  res.send(result.text);
  //})
  //.catch(function(result) {
  //console.log(result)
  //})

  res.render('index.html');
  //  res.send('Hello World!');

});

app.get('/getData', function(req, res) {

  res.send('');

});

app.post('/calculate', function(req, res) {
  let sampleFile = req.files["cropped_image[]"];
  sampleFile.mv('tttttttt.jpg', function(err) {

    var myImage = require('path').resolve(__dirname, 'tttttttt.jpg');

    Tesseract.recognize(myImage, {
        lang: 'spa',
      })
      .then(function(result) {
          var test = result.text;

          var input = test.split(/[ ]+/);

          for (var i = 0; i < input.length; i++) {

            if (input[i].indexOf("Juni") > -1) {
              input[i] = "Junio:";
            }

            if (input[i].indexOf("P..U.N.") > -1) {
              input[i] = "MADRE\nR.U.N.";
            }

            if (input[i].indexOf("ne:<\n\nNonbre") > -1) {
              input[i] = "\n\nNombre";
            }

            if (input[i].indexOf(":12.345.678-9\n\nNonbre") > -1) {
              input[i] = ":12.345.678-9\n\nNombre";
            }

            if (input[i].indexOf("Mas::u11") > -1) {
              input[i] = "Masculino";
            }

            if (input[i].indexOf("N0|bre") > -1) {
              input[i] = "Nombre";
            }

          }

          var test = input.join(" ");

        res.send(test);
      })
      .catch(function(result) {
        console.log(result)
      })


  });


});



app.listen(3000, function() {
  console.log('Example app listening on port 3000!');
});
