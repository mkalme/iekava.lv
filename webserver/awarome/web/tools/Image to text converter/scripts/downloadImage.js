function downloadImageFile(){
	if(document.getElementById("text-inside").getAttribute("data-type") == 1){
		image_color();
	}else{
		image_no_color();
	}
}

function image_no_color(){
	var multiply = 12 / document.getElementById("converted-text").style.fontSize.replace('px', '');
	
	//calculate width in char
	var text = replaceBreak(document.getElementById("converted-text").innerHTML, '&nbsp;', ' ');
	var array = text.split('<br>');
	
	//SETS CANVAS
	var canvas = document.createElement('canvas');
	canvas.width = (array[0].length) * 7.2 + 15 + (1.5 * (array[0].length / 100  < 0.5 ? 0 : array[0].length / 100));
	canvas.height = (array.length - 1) * 14.5 + 8;
	
	console.log(array[0].length);
	
	var context = canvas.getContext("2d");
	
	context = canvas.getContext("2d");
	context.fillStyle = "white";
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.fillStyle = "black";
	context.font = "normal 12px Lucida Console";
	
	
	//CREATES IMAGE
	context = createImage_noColour(context, array);
	
	downloadCanvas(canvas, 'imageToText.png');
}

function createImage_noColour(context, array){
	for(var i = 0; i < array.length; i++){
		context.fillText(array[i], 5, 14 + (i * 14.5));
	}
	
	return context;
}

function image_color(){
	var array = document.getElementById("text-inside").childNodes;
	
	var fontSize = 12;
	var multiply = fontSize / document.getElementById("text-inside").style.fontSize.replace('px', '');
	
	//SETS CANVAS
	var canvas = document.createElement('canvas');
	canvas.width = document.getElementById("span1").clientWidth * multiply + 15;
	canvas.height = 0.9475 * document.getElementById("span1").clientHeight * multiply + 15; 
	
	var context = canvas.getContext("2d");
	
	//SET BACKGROUND COLOR
	context = canvas.getContext("2d");
	context.fillStyle = document.getElementById("text-inside").style.backgroundColor;
	context.fillRect(0, 0, canvas.width, canvas.height);
	
	context.font = "normal 12px Consolas";
	
	var y = fontSize + 2;
	var x = 5;
	
	//CREATES IMAGE
	context = createImage_Color(context, array, x, y, fontSize);
	
	downloadCanvas(canvas, 'imageToText.png');
}

function createImage_Color(context, array, x, y, fontSize){
	var newLine = 0;
	for (var i = 1; i < array.length; i++){
		context.fillStyle = window.getComputedStyle(array[i]).getPropertyValue("color");
		context.fillText(array[i].innerHTML[0], (x + newLine), y);
		
		newLine += fontSize * 0.555;
		if((array[i].innerHTML).match("<br>")){
			y += fontSize * 1;
			newLine = 0;
		}
	}
	
	return context;
}

function dataURItoBlob(dataURI) {
  var byteString = atob(dataURI.split(',')[1]);

  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]

  var ab = new ArrayBuffer(byteString.length);

  var ia = new Uint8Array(ab);

  for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
  }

  var blob = new Blob([ab], {type: mimeString});
  return blob;

}

function downloadCanvas(canvas, filename) {
	var a = document.createElement('a');
	document.body.appendChild(a);
	
    a.href = URL.createObjectURL(dataURItoBlob(canvas.toDataURL("image/png").replace("image/png", "image/octet-stream")));
	
    a.download = filename;
	
	a.click();
}