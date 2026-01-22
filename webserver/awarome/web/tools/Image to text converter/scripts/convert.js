var characters = "@@8%MW52tvvf(!,.``` ";

function changeLabel(file){
	document.getElementById("label_fileName").innerHTML = file.files[0].name;
}
			
function bridge(){
	readURL(document.getElementById("readIMG"));
}
			
function readURL(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = new Image;
			
			img.onload = function() {
				//START CONVERTING
				baseOfConversion(img);
			};
			img.src = reader.result;
		};
		
		reader.readAsDataURL(input.files[0]);
	}
}

function baseOfConversion(img){
	//SET ALL VARIABLES
	var brightnessDifference = 0;
	var brightnessAverage = 0;
	var brightnessArray = new Array();
	var text = "";
	
	
	//SET HEIGHT PROPORTIONS
	var height = document.getElementById("width").value * img.height / img.width;

	//SET CANVAS
	var canvas = document.createElement('canvas');
	canvas.width = document.getElementById("width").value;
	canvas.height = height / 2;
	canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
		
	//ADD TEXT
	var threeValues = setText_first(canvas, 0, brightnessArray);
	
	//RECEIVE THREE VALUES
	text = threeValues[0];
	brightnessAverage = threeValues[1];
	brightnessArray = threeValues[2];
	
	//GET BRIGHTNESS
	brightnessAverage = changeBrightnessAverage(brightnessAverage, canvas.height, canvas.width);
	
	//GET BRIGHTNESS DIFFERENCE
	brightnessDifference = getBrightnessDifference(brightnessArray, canvas.height, canvas.width, brightnessAverage);
	
	console.log("Average: " + brightnessAverage + " | Difference: " + brightnessDifference);
	
	//SETS CONTRAST
	text = setContrast(text, brightnessArray, brightnessAverage, brightnessDifference, canvas);
	
	//SETS BODY
	setBody(text, canvas.width);
}

function setContrast(text, brightnessArray, brightnessAverage, brightnessDifference, canvas){
	if(brightnessDifference < 0.29){
		var contrast = 0.3;
		var div = contrast / brightnessDifference;
				
		for(var i = 0; i < brightnessArray.length; i++){
			var newValue = brightnessAverage + (brightnessArray[i] - brightnessAverage) * div;
					
			brightnessArray[i] = (newValue <= 0 ? 0 : (newValue >= 1 ? 1 : newValue));
		}
				
		//SETS CONTRAST TEXT
		text = setText_second(brightnessArray, canvas.width);
	
		//GET BRIGHTNESS
		brightnessAverage = changeBrightnessAverage(getBrightness(brightnessArray), canvas.height, canvas.width);;
	
		//GET BRIGHTNESS DIFFERENCE
		brightnessDifference = getBrightnessDifference(brightnessArray, canvas.height, canvas.width, brightnessAverage);
	
		console.log("Average: " + brightnessAverage + " | Difference: " + brightnessDifference)	
	}
	
	return text;
}

function setText_first(canvas, brightnessAverage, brightnessArray){
	var text = "";
	
	for(var y = 0; y < canvas.height; y++){
		for(var x = 0; x < canvas.width; x++){
			var data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
			var brightness = ((data[0] * 299) + (data[1] * 587) + (data[2] * 114)) / 1000 / 255;
			var n = brightness * (characters.length - 1);
			
			text += (n == characters.length - 1 ? String.fromCharCode(160) : characters.charAt(n));
	
			brightnessAverage += brightness;
			brightnessArray[(y * canvas.width) + x] = brightness;
				
		}
		text += (y == canvas.height - 1 ? "" : "</br>");
	}
	
	return [text, brightnessAverage, brightnessArray];
}

function setText_second(brightnessArray, width){
	var text = "";
							
	var newSpace = 0;
	for(var i = 0; i < brightnessArray.length; i++){
		var n = brightnessArray[i] * (characters.length - 1);
					
		text += (n == characters.length - 1 ? String.fromCharCode(160) : characters.charAt(n));
				
		newSpace++;
		if(newSpace == width){
			text += "</br>";
			newSpace = 0;
		}
	}
	
	return text;
}

function getBrightness(brightnessArray){
	brightnessAverage = 0;
	for(var i = 0; i < brightnessArray.length; i++){
		brightnessAverage += brightnessArray[i];
	}
	
	return brightnessAverage;
}

function changeBrightnessAverage(brightnessAverage, height, width){
	return brightnessAverage = Math.round(brightnessAverage / (height * width) * 1000) / 1000;
}

function getBrightnessDifference(brightnessArray, height, width, brightnessAverage){
	brightnessDifference = 0;
								
	for(var i = 0; i < brightnessArray.length; i++){
		brightnessDifference += Math.abs(brightnessArray[i] - brightnessAverage);
	}
								
	return brightnessDifference = Math.round(brightnessDifference / brightnessArray.length * 1000) / 1000;
}

function setBody(text, width){
	//REMOVES CENTER
	var remove = document.getElementById('center');
	remove.parentNode.removeChild(remove);
	
	//ADDS ELEMENTS
	document.getElementById("center-textArea").style.display = 'block';
	document.getElementById("downloadFileButton").style.display = 'inline-block';
	
	//CALCULATES FONT SIZE
	var size = window.innerWidth / width;
	size = (size > 10 ? 10 : size);
	document.getElementById("converted-text").style.fontSize = size * 1.3 + "px";
	
	document.getElementById("converted-text").innerHTML = text;
}