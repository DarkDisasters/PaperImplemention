function addContour(context, contour, contourColor){
    console.log("addcontour")
        context.beginPath()
        console.log("contourColor",contourColor)
        context.strokeStyle = contourColor[1]
        context.fillStyle = "#000000"
        

        context.lineWidth = 3
        
        
        for(var i=0; i < contour.length; ++i){
            //console.log("i",i)
            var dotCanvas = contour[i]
            var coordinateArray = dotCanvas["coordinates"]
            for(var j = 0; j < coordinateArray.length; ++j){
                var array = coordinateArray[j]
                if(array.length == 0) continue
                for(var k = 0; k < array.length; ++k){
                    //console.log("array[k]",array[k])
                    coordinate = array[k]

                    for(var m = 0; m < coordinate.length-1; ++m){
                        
                            context.moveTo(coordinate[m][0], this._canvasHeight-coordinate[m][1])
                        
                            context.lineTo(coordinate[m+1][0], this._canvasWidth-coordinate[m+1][1])
                            

                        //console.log("coordinate[m]",coordinate[m])
                    }
                }
                
            }
            //context.fill()
            //console.log("coordinate",coordinate)
            
        }
        //context.closePath()
        
        context.stroke()
        
}