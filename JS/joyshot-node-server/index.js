const { default: axios } = require('axios');
const express = require('express');
const app = express();

app.use((req, res, next)=>{
	next();
});

app.get("/textsearch", (req, res) => {
	// let key = "AIzaSyCZt0Avv2Dx6P9uSyYXAh2dP-dx5JaxrII";
	let key = "AIzaSyD9kBPooRXLLadDGapObylIZgcWay3Pdus"; //joyshotapp@gmail.com
	let textsearch = "https://maps.googleapis.com/maps/api/place/textsearch/json"
	let googleMap = `${textsearch}?region=tw&language=${req.query.lang}&key=${key}&query=${req.query.query}`
	
 	axios.get(googleMap).then(function (response) {
		res.header("Access-Control-Allow-Origin", "*"); // 解cors
			res.send(response.data);
    }).catch(function (error) {
			console.log(error);
    });
});


app.get("/", (req, res) => {
	res.send("hello node");
});


app.listen(3000, () => {
  console.log('Node run at 3000')
})
 