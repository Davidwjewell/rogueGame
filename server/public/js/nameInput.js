function nameInput() {
  var txt;
  var playerName = prompt("Please enter your name:", "Sick Cunt");
  if (playerName == null || playerName == "") {

    nameInput();
  } 
  
  else {
    
    return playerName;
  }
 
}