var lSendUrl = function(PostType, Url, formData, successPaperState, self){
    var xmlhttp ;

    if(PostType == 'GET'){
        if(window.XMLHttpRequest){
            //code for IE7+, Firefox, Chrome, Opera, Safari
            xmlhttp = new XMLHttpRequest() ;
        }else{
            xmlhttp = new ActiveXObject("Mircrosoft.XMLHTTP") ;
        }
        xmlhttp.onreadystatechange = function(){
            // self.successPaperState(self) ;
            successPaperState() ;
        }
        xmlhttp.open(PostType, Url, true) ;
        xmlhttp.send(null)
    }
    else{
        $.ajax({
            url: Url ,
            type: "POST" ,
            dataType: "JSON" ,
            data: formData ,
            crossDomain: true ,
            processData: false ,
            contentType: false ,
            success: function(response){
                successPaperState(response, self) ;
            } ,
            error: function(jqXHR, textStatus, errorMessage){
                console.log(errorMessage) ;
            }
        });
    }
}