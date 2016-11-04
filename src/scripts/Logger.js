function Logger(enabled){
  this.enabled = enabled || false;
}

Logger.prototype.log = function(string){
  if(this.enabled){
    console.log(string);
  }
};

Logger.prototype.logError = function(){

};