function PointSaver(functionHub){
    this._init = function(functionHub){
        this.m_functionHub = functionHub ;
    }

    this.saveData = function(currentData){
        var self = this ;
        var dataName = document.getElementById("dataNameSave").value ;
        this.m_functionHub.setCurrentName(dataName) ;

        var formData = new FormData() ;
        formData.append("dots", JSON.stringify(currentData)) ;
        formData.append("name",dataName) ;
        var url = "http://localhost:30001/saveData" ;
        lSendUrl('POST', url, formData, self.successSave) ;
    }

    this.successSave = function(response){
        console.log("Save OK!") ;
    }

    this._init(functionHub) ;
}