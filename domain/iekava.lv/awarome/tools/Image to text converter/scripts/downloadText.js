function downloadTextFile(){
	
	var text = text = replaceBreak(document.getElementById("converted-text").innerHTML, '&nbsp;', ' ');
	
	downloadFileText(text.replace(/<br\s*[\/]?>/gi, "\r\n"), "imageToText.txt");
}

function replaceBreak(text, replace, replaceWith){
	return text.replace(new RegExp(replace, 'g'), replaceWith);
}

function downloadFileText(text, fileName) {
	var a = document.createElement('a');
	document.body.appendChild(a);
	var file = new Blob([text], {type: 'text/plain'});
	a.href = URL.createObjectURL(file);
	a.download = fileName;
	a.click();
}