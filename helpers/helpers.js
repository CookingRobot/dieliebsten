

exports.comprise =function(cArray) {
  var content = "";
    for (var i = 0; i < cArray.length; i++) {
    content = content+","+cArray[i];
   }
   return content;
}

exports.decomprise = function (cString) {
  var cArray=cString.split(",");
  var indexToRemove = 0;
  var numberToRemove = 1;
  cArray.splice(indexToRemove, numberToRemove);
  return cArray;
}

exports.checkArray=function (theArray) {
   for (var i = 0; i < theArray.length; i++) {
    if((theArray[i].length>100)||(theArray[i].length<1))return false;
   }
   return true;
}

exports.checkMail = function (mailString){
  var cArray=mailString.split("@");
  if(cArray.length==2) {
    if((cArray[0].length>3)&&(cArray[0].length<50)&&(cArray[1].length>3)&&(cArray[1].length<50)) {
      return true;
    }
    else {
      return false;
    }
  }
  else {
    return false;
  }
  
} 
exports.checkName = function (nameString) {
  if((nameString.length>2)&&(nameString.length<50)) {
    if(nameString.indexOf(" ") == -1) {
      return true;
    }
    else return false;
  }
  else return false;
}
exports.checkPWD = function (nameString) {
  if(nameString.length>5) {
    if(nameString.indexOf(" ") == -1) {
      return true;
    }
    else return false;
  }
  else return false;
}


exports.randomString = function (length, chars) {
    var result = '';
    for (var i = length; i > 0; --i) result += chars[Math.round(Math.random() * (chars.length - 1))];
    return result;
}




