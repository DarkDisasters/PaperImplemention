function FunctionHub(){
    var _this = this

    this._init = function(){
        this._pointGenerator = new PointGenerator()
        this._pointLabel = new PointLabel()
        this._kdeEnhancer = new KdeEnhancer()
        this._pointSaver = new PointSaver(this)
        this._dataName = '' 
    }

    this.setCurrentName = function(dataName){
        this._dataName = dataName ;
    }

    this.loadDataset = function(){
        var self = this ;
        var dataName = this._dataName ;
        console.log("loadDataset",dataName)
        var formData = new FormData() ;
        formData.append("name", dataName) ;
        var url = "http://localhost:30001/loadData" ;
        lSendUrl("POST", url, formData, self.successLoad, this) ;
    }

    this.successLoad = function(response, self){
        console.log("self", self, self._dataName) ;
        var mapClassIdDots = response["dots"] ; 
        console.log("load data", Object.keys(mapClassIdDots)) ;
        g_spDrawing.clearDots() ;
        for(var classId in mapClassIdDots){
            var liData = mapClassIdDots[classId] ;
            g_spDrawing.loadDots(classId, liData) ;
        }
        document.getElementById("currentName").innerHTML = "DataSet" + self._dataName ;
    }

    this.setFunc = function(e){
        switch(e.type){
            case 'updateData' :
                this._dataName = document.getElementById("w_loadName").value ;
                console.log(this._dataName) ;
                if(this._dataName == ""){
                    window.alert("empty") ;
                    break ;
                }
                else{
                    this.loadDataset() ;
                }
                //break

            case 'generateDots' :
                this._pointGenerator.generateDots()
                break

            case 'clearDots' :
                g_spDrawing.clearDots() ;
                break

            case 'saveData' :
                var classIdDots = g_spDrawing.getData() ; 
                this._pointSaver.saveData(classIdDots) ;
                document.getElementById("currentName").innerHTML = "DataSet:" + this._dataName ;
                console.log("saveData",classIdDots)
                break

            case 'startServer' :
                console.log("dataName", this._dataName) ;
                this._kdeEnhancer.addKde(this._dataName) ;
                break
        }
    }

    this._init()
}