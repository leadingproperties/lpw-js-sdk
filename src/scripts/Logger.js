function Logger(enabled){
  this.enabled = enabled;
}

Logger.prototype.log = function(string){
  if(this.enabled){
    console.log(string);
  }
};

Logger.prototype.logError = function(){

};