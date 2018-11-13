function KdeEnhancer(){

    this._init = function(){
        console.log("...addKde...") ;
    }

    this.addKde = function(dataName){
        var self = this ;
        var formData = new FormData() ;
        formData.append("name", JSON.stringify(dataName)) ;
        var url = "http://localhost:30001/clusterKDE" ;
        lSendUrl("POST", url, formData, self.successGetClusterKDE) ;
    }

    this.successGetClusterKDE = function(response){
        console.log("response['clusters']", response['clusters'])
        console.log("response['mm']", response["mm"])
        //console.log("response['distance']", response['distance']) ;
        console.log("serverCompute succeed")
        g_spDrawing.serverCompute(response["clusters"], response["mm"]) ;
    }

    this._init() ;
    return this;
}