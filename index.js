const express= require('express');
const fs= require("fs");
const path = require("path");
const fileUpload = require('express-fileupload');
const bodyParser = require('body-parser');
const sharp= require("sharp");
const { spawn } = require('child_process');
//initializing the app
const app = express();
// Use body-parser middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
//middleware to handle file uploads
app.use(fileUpload());
//requesing the homepage
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname + '/index.html')
});
//for downloading plot
app.get('/downloadplot', (req, res) => {
  const { width, height, filename } = req.query;
  const imagePath = path.join(__dirname, 'public', 'images', 'myplot.png');
  // Validate the width and height inputs (you can add more validation)
  if (!width || !height || isNaN(width) || isNaN(height)) {
    return res.status(400).send('Invalid width or height');
  }
  // Resize the image using sharp
  sharp(imagePath)
    .resize(parseInt(width), parseInt(height))
    .toBuffer()
    .then((data) => {
      res.setHeader('Content-Disposition', `attachment; filename="${filename}.png"`);
      res.setHeader('Content-Type', 'image/png');
      // Send the resized image as a downloadable file
      res.send(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Error processing the image');
    });
});
//for dowloading resultaant table
app.get('/downloadtable',(req,res)=>{
  const tsvFilePath = path.join(__dirname, '/public/images/', 'my_table.tsv');
  res.download(tsvFilePath, 'my_table.tsv', (err) => {
    if (err) {
      console.error(err);
    }
  });
})
//for downloading Compressed data of the input
app.get('/downloadcompressdata',(req,res)=>{
  const tsvFilePath = path.join(__dirname, '/public/images/', 'latentdata.tsv');
  res.download(tsvFilePath, 'latentdata.tsv', (err) => {
    if (err) {
      console.error(err);
    }
  });
})
//directing to view_result.html where the output
app.get('/viewresult', (req, res) => {
    res.sendFile(__dirname + '/public/view_result.html');
});

app.post('/load-dataset', (req, res) => {
    // res.sendFile(__dirname+ '/public/loading.html')
  // You can now use the selected dataset (e.g., "goolam.rda") for processing.
  const datapath = "./datas/Goolam.rda"
  const process = spawn('Rscript', ['goolam.R', datapath]);
  // Handle the script's output and errors as needed
process.stdout.on('data', (data) => {
   const output = data.toString();
  console.log(output)
  console.log("R script for built-in dataset executed successfully")
  if (output.match(/\.png$/)){
   
    res.sendFile(__dirname + '/public/view_result.html');
  }
  
});
process.stderr.on('data', (error) => {
  console.error(`R script error: ${error}`);
});
process.on('close', (code) => {
  console.log(`R script process exited with code ${code}`);
});
 
});

app.post('/uploadfile', (req, res) => {
      const uploadfile = req.files.file;
    const inputfile =__dirname + "/public/files/" + uploadfile.name; //saving the uploaded files to files

    uploadfile.mv(inputfile, (err)=>{
      if(err){
        res.status(500).send(err);
      }
      //   res.sendFile(__dirname + '/public/loading.html')
       
const process = spawn('Rscript', ['goolam.R', inputfile]);
  // Handle the script's output and errors as needed
process.stdout.on('data', (data) => {
   const output = data.toString();
    console.log(output)
    console.log("Rscript is being called");
  if (output.match(/\.png$/)){
    res.sendFile(__dirname + '/public/view_result.html');
    }

});
process.stderr.on('data', (error) => {
  console.error(`R script error: ${error}`);
});     
});
      
});
app.listen(4000,()=> console.log("server started at port 4000"));


