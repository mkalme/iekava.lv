function downloadHTMLFile(){
	if(document.getElementById("text-inside").getAttribute("data-type") == 1){
		html_color();
	}else{
		html_no_color();
	}
}

function html_no_color(){
	var text = "<!DOCTYPE html>\r\n<html>\r\n<body>\r\n<p style=\"font-family: Consolas, Courier, Courier New, Lucida Console, Monaco;\nfont-size: " + document.getElementById("converted-text").style.fontSize + ";\">" + document.getElementById("converted-text").innerHTML + "</p>\r\n</body>\r\n</html>";
	downloadFileText(text, "imageToText.html");
}

function html_color(){
	var div = document.getElementById("text-inside");
	var text = "<!DOCTYPE html>\r\n<html>\r\n<head>\r\n<style>\r\na{\r\nfont-family: Consolas, Courier, Courier New, Lucida Console, Monaco;\r\n}\r\n#div{\r\nline-height: 1;\r\nbackground-color: " + document.getElementById("text-inside").style.backgroundColor + ";\r\ndisplay: inline-block;\r\npadding: 10px;\r\n}\r\n</style>\r\n</head>\r\n<body>\r\n<div id=\"div\">\r\n";
	
	var colorChar;
	
	for (var i = 1; i < div.childNodes.length; i++){
		colorChar = window.getComputedStyle(div.childNodes[i]).getPropertyValue("color");
		
		text += "<a style=\"color: " + colorChar + ";\">" + div.childNodes[i].innerHTML + "</a>";
		text += ((div.childNodes[i].innerHTML).match("<br>") ? "\r\n" : "");
	}
	
	text += "\r\n</div>\r\n</body>\r\n</html>"
	
	downloadFileText(text, "imageToText.html");
}