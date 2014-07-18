function makeItRain() {

//GET SEARCH TERM (url/?search=SEARCHTERM)
function getParameterByName(name) {
    var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
    return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
}
function ricerca() {
	search = getParameterByName('search');
if (search != null) {return search} 
else {
	ricerca();
	} 
};

window.onload = function() {
	//SETUP
	//SET BACKGROUND COLOR
	function refreshData(){
	x = 10;
	document.body.style.backgroundColor=randomColor({luminosity: 'dark',hue: 'monochrome'});    
	setTimeout(refreshData, x*1000);
	}
	refreshData();
	
	//CANVAS SETUP
	var canvas = document.getElementById('sketch');
	ctx = canvas.getContext("2d");
	//SET CANVAS SIZE
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
	console.log(canvas.width, canvas.height);
	//SET GLOBAL VARS
	//WHERE DO I STOP DRAWING?
	var limite;
	calclimite = function() {
		if (window.innerHeight >= window.innerWidth){
			limite = window.innerHeight;
			console.log(limite);
			} else {
				limite = window.innerWidth;
				console.log(limite);
				};
		};
	calclimite();
	
	//SPEED is based on the largest portion of the window. With a fps of 30, if you divide it by 30 it means that every second my wave exit the canvas, if you devide it by 300, it means that every 10 seconds the wave exits the canvas
	var speed = limite/1800;
	
	function selectSpeed(x){
	$('#timeframe a').removeClass("selected");
	$(x).addClass("selected");
	};

	$('#TenSec').click(function() {
	speed = limite/300; 
	selectSpeed('#TenSec'); 
	return false;});
	$('#OneMin').click(function() {
	speed = limite/1800;
	selectSpeed('#OneMin'); 
	return false;});
	$('#FiveMin').click(function() {
	speed = limite/9000; 
	selectSpeed('#FiveMin');
	return false;});
	
	var circles = new Array();
	
	//CROSS BROWSER ANIMATIONS
	var requestAnimationFrame = window.requestAnimationFrame || 
	                            window.mozRequestAnimationFrame ||
	                            window.webkitRequestAnimationFrame ||
	                            window.msRequestAnimationFrame;
	
	function Circle(halfx, halfy, width, radius, color, maxradius) {
	            this.x = halfx;
	            this.y = halfy;
	            this.width = width;
	            this.color = color;
	            this.radius = radius;
	            this.maxradius = maxradius;
	            }
	
	Circle.prototype.update = function () {
	    ctx.beginPath();
	    ctx.arc(this.x, 
	            this.y, 
	            this.radius,
	            0, 
	            Math.PI * 2,
	            false);
	    ctx.closePath();
	    ctx.strokeStyle = this.color;
	    ctx.lineWidth = this.width;
	    ctx.stroke();
	   
	    if (this.radius <= this.maxradius/10) { //change back to limite
	    	this.radius+=speed;
	    		}
	    else {
			this.radius = this.radius;
			this.color = 'rgba(100,100,100,0.1)'; //this is for setting the color of the stopped circle
			}
	    
	}; 
	
	//I PARAMETRI DEI CERCHI
	function drawCircle(data_followers) {
	
	var spessore;
	
		if ( data_followers <= 100) {
		spessore = 0.1
		} else if (data_followers > 100 && data_followers <= 1000) {
		spessore = 0.5
		} else if (data_followers > 1000 && data_followers <= 10000) {
		spessore = 1
		} else if (data_followers > 10000 && data_followers <= 100000) {
		spessore = 2
		} else if (data_followers > 1000000) {spessore = 4};
		
	var raggiomassimo;
	
		if ( data_followers <= 100) {
		raggiomassimo = limite/8
		} else if (data_followers > 100 && data_followers <= 1000) {
		raggiomassimo = limite/6
		} else if (data_followers > 1000 && data_followers <= 10000) {
		raggiomassimo = limite/4
		} else if (data_followers > 10000 && data_followers <= 100000) {
		raggiomassimo = limite/2
		} else if (data_followers > 100000) {raggiomassimo = limite};	
	
	var halfx = Math.floor(Math.random() * window.innerWidth) + 1; //window.innerWidth/2;
	var halfy = Math.floor(Math.random() * window.innerHeight) + 1; //window.innerHeight/2;
	var width = spessore;
	var radius = 0;
	var color = randomColor({luminosity: 'light', hue: 'blue'});
	var maxradius = raggiomassimo;
	 
	var circle = new Circle(halfx, halfy, width, radius, color, maxradius);
	circles.push(circle);
	//drawAndUpdate();
	};
	
	//SOCKET.IO
	var socket = io.connect('safe-springs-3426.herokuapp.com'),
	  
	  tweets = document.getElementById('tweets');
	  socket.on('tweet', function (data, data_followers, datacolore) {
	    //console.log(data);
	    $('#logmessage').text(data);
	    drawCircle(data_followers);
	    });
	  
	  socket.on('connect', function(){
	                      socket.emit('search', ricerca());
		});
	                  
	  socket.on('connected', function() {
	  	console.log('connesso');
	  	$('body').append("<p id=\"logmessage\">Waiting for the first tweet…</p>");
	  });
	  
	 
	var drawAndUpdate = function() {
	     ctx.clearRect(0, 0, canvas.width, canvas.height);
	  
	     for (var i = 0; i < circles.length; i++) {
	         var myCircle = circles[i];
	         myCircle.update();
	     }
	      
	     setTimeout(function() {
	         requestAnimationFrame(drawAndUpdate);
	         }, 1000 / 30);
	 };
	 
	 drawAndUpdate();
 };

};