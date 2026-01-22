function bridge_colorEnabled(){
	readURL_second(document.getElementById("readIMG"));
}
			
function readURL_second(input) {
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var img = new Image;
			
			img.onload = function() {
				//START CONVERTING
				baseOfConversion_Second(img);
			};
			img.src = reader.result;
		};
		
		reader.readAsDataURL(input.files[0]);
	}
}

function baseOfConversion_Second(img){
	//GETS HEIGHT PROPORTIONS
	var height = document.getElementById("width").value * img.height / img.width;

	//SETS CANVAS
	var canvas = document.createElement('canvas');
	canvas.width = document.getElementById("width").value;
	canvas.height = height / 2;
	canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
	
	addText(canvas);
	
	removeElements();

	addElements(canvas.width);
}

function addText(canvas){
	for(var y = 0; y < canvas.height; y++){
		for(var x = 0; x < canvas.width; x++){
			var data = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
			var character = document.createElement('a');
			
			character.innerHTML = "@" + (x == canvas.width - 1 ? "<br />" : "");
			character.style.color = "rgb(" + data[0] + "," + data[1] + "," + data[2] + ")";
			character.style.fontFamily = "Consolas";
			
			document.getElementById("text-inside").appendChild(character);
		}
	}
}

function removeElements(){
	var remove = document.getElementById('center');
	remove.parentNode.removeChild(remove);
	
	remove = document.getElementById('converted-text');
	remove.parentNode.removeChild(remove);
}

function addElements(width){
	var size = getSize(width);
	
	document.getElementById("center-textArea").style.display = 'block';
	document.getElementById("text-inside").style.fontSize = size * 1.5 + "px";
	document.getElementById("text-inside").style.lineHeight = 1;
	document.getElementById("text-inside").style.backgroundColor = "black";
	document.getElementById("text-inside").setAttribute("data-type", "1"); 
}

function getSize(width){
	var size = window.innerWidth / width;
	return size = (size > 10 ? 10 : size);
}