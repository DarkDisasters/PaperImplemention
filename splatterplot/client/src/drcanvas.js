//通过方法传外部的参数过来，从而在本function中调用
function SplatterplotDraw(domId){
    var _this = this
    this.m_classIdDots = {} 
    this.m_preCircle = undefined
    this.m_liClusterInfo = []      // ? 为什么不是{}，储存的应该是一个dict类型的
    this.m_liDistanceInfo = []
    this.m_liContourInfo = []
    this.m_liWeightInfo = []
    this.m_liWeight = []
    this.m_lastLabColor = []
    this.m_middleLabColor = []
    this.m_middleLchColor = []
    this.m_dotArrayBound = []
    this.m_objectPath = []
    this.m_path = []
    this.m_intersectPath = []
    this.m_allowedDistanceDot = []
    this.m_drawDistanceDot = []
    this.m_intersectPathCount =0
    this.m_moveFlag = true
    this.m_ifDrawDots = true

    this._init = function(domId){
        this._canvas = document.getElementById(domId)
        this._ctx = this._canvas.getContext("2d")
        this._canvasWidth = this._canvas.getBoundingClientRect().width
        this._canvasHeight = this._canvas.getBoundingClientRect().height
        paper.setup(this._canvas)
        for(var i = 0; i < this._canvasWidth; ++i){
            for(var j = 0; j < this._canvasHeight; ++j)
                _this.m_liWeightInfo[i*this._canvasWidth + j] = []
                
        }
        //console.log("width,height:",this._canvasWidth,this._canvasHeight)
    }

    this.getBasedColor = function(iClusterId){
        var liColor = d3.schemeCategory10 ;
        for(var j = 0; j < 10; ++j){
            if(iClusterId == j + 1){
                var liKDEColor = [color[0], color[j+1]]
                return liKDEColor
            }
        }
    }

    this.render_renderRelated = function(){
        var liColor = d3.schemeCategory10 ;
        //this._ctx.beginPath()

        for(var i = 0; i < this.m_liClusterInfo.length; i++){

            var iClusterId = this.m_liClusterInfo[i]["classId"] ;
            var liDots = this.m_liClusterInfo[i]["dots"]
            var liKDE = this.m_liClusterInfo[i]["densitys"]
            var minDensity = this.m_liClusterInfo[i]["mindensity"]
            var maxDensity = this.m_liClusterInfo[i]["maxdensity"]
            var liDistance = this.m_liClusterInfo[i]["lidistance"]

            //var liKDEColor = g_liRedColor ;
            var dotColor = liColor[iClusterId % 10] 
            console.log("render_strokeRelated m_liClusterInfo", this.m_liClusterInfo)
            //console.log("i distance",i, liDistance)
            // liColor[iCLusterId]
            /*
            for(var j = 0; j < 10; ++j){
                if(iClusterId == j+1){
                    liKDEColor = [color[0], color[j+1]]
                    break ;
                }
            }
            */
            var liKDEColor = this.getBasedColor(iClusterId)
            console.log(i,liKDEColor)
            console.log("classId",iClusterId)
            if(g_kdeRender){ 
                this.addKDE(liKDE, minDensity, maxDensity, liKDEColor, 0.4)
            }
            if(g_contourRender){

                this.getContour(liKDE, i, iClusterId, maxDensity, liDistance, liKDEColor)
                //this.getContour2(liKDE)
                //this.colorBlend(liKDEColor, i, this.m_liClusterInfo.length, 0.8)
                this.m_ifDrawDots = false
            }
            //this._ctx.fillStyle = dotColor ;
            
        }
        
    }

    this.render = function(){
        this._ctx.clearRect(0,0,this._canvasWidth,this._canvasWidth)
        //this._ctx.beginPath()
        this._ctx.fillStyle = 'rgb(255,0,0,0.5)'


        this.render_renderRelated() ;

        if(this.m_preCircle != undefined){
            this._ctx.strokeStyle = "#000000"
            drawCircle(this._ctx, this.m_preCircle.x, this.m_preCircle.y, this.m_preCircle.radius, false,true)
        }

        var color = d3.schemeCategory10 ;
        if(this.m_ifDrawDots == true){
            for(var classId in _this.m_classIdDots){
                //console.log("classId",classId)
                var color_temp = color[Number(classId)%10] ;
                var liDot = _this.m_classIdDots[classId] ;
                for(var i = 0; i < liDot.length; i++){
                    var pos = liDot[i] ;
                    this._ctx.fillStyle = color_temp ;
                    drawCircle(this._ctx, pos.x, pos.y, 5, true, false)
                }
            }
        }
        //console.log("liDot",liDot)
        //this.render_renderRelated() ;
    }

    this.moveCircle = function(visible,centerX,centerY,radius){
        cX = centerX - this._canvas.offsetLeft 
        cY = centerY - this._canvas.offsetTop
        if(visible){
            //console.log('visible',visible)
            this.m_preCircle = {
                'x': cX ,
                'y' : cY ,
                'radius' : radius ,
            }
            //console.log(this.m_blobCircle)
        }
        else{
            this.m_preCircle = undefined
        }
        if(_this.m_moveFlag == true)
            this.render()
    }

    this.addCircle = function(dotNumber, dotClass, dotArray){
        for(var i = 0; i < dotNumber; i++){
            //console.log("dotArray",dotArray)
            //console.log("preX",dotArray[i].x) ;
            dotArray[i].x -= this._canvas.offsetLeft ;
            //console.log("canvasLeft",this._canvas.offsetLeft)
            //console.log("lateX",dotArray[i].x)
            dotArray[i].y -= this._canvas.offsetTop ;
            //console.log("dotArrayx"+i,dotArray[i].x)
        }

        if(_this.m_classIdDots[dotClass] == undefined){
            _this.m_classIdDots[dotClass] = dotArray ;
        }
        else{
            _this.m_classIdDots[dotClass] = _this.m_classIdDots[dotClass].concat(dotArray) ;
        }
        console.log("classIdDots",_this.m_classIdDots[dotClass])
        this.render() ;

    }

    this.clearDots = function(){
        _this.m_classIdDots = {} ;

        document.getElementById("currentName").innerHTML = "" ;
        this.render()
    }

    this.loadDots = function(dotClass,dotArray){
        if(_this.m_classIdDots[dotClass] == undefined){
            _this.m_classIdDots[dotClass] = dotArray ; 
        }
        else{
            _this.m_classIdDots[dotClass] = _this.m_classIdDots[dotClass].concat(dotArray) ;
        }
        _this.m_liClusterInfo = []
        _this.m_moveFlag = true
        console.log("classIdDots",_this.m_classIdDots[dotClass])
        this.render() ;
    } 

    this.getData = function(){
        return _this.m_classIdDots ;
    }

    this.findDotBound = function(LiDot){
        var xMax = 0
        var yMax = 0
        var xMin = 1000
        var yMin = 1000
        for(var classID in LiDot){
            var dotArray = LiDot[classID]
            for(var i = 0; i < dotArray.length; ++i){
                if(dotArray[i].x > xMax)  xMax = dotArray[i].x
                if(dotArray[i].y > yMax)  yMax = dotArray[i].y
                if(dotArray[i].x < xMin)  xMin = dotArray[i].x
                if(dotArray[i].y < yMin)  yMin = dotArray[i].y
            }
        }

        xMax = Math.ceil(xMax)
        yMax = Math.ceil(yMax)
        xMin = Math.floor(xMin)
        yMin = Math.floor(yMin)

        var dotBound = {
            "xMin" : xMin,
            "xMax" : xMax,
            "yMin" : yMin,
            "yMax" : yMax
        }

        _this.m_dotArrayBound.push(dotBound)

    }

    this.weightInfo = function(KDE, number, dotlength){
        var weightScale = d3.scaleQuantize()
            .domain([0, 3e-5])
            .range([0, 0.25, 0.5])
        var count = 0
        var weight = 0
        var dotArrayBound = _this.m_dotArrayBound[0]
        for(var i = dotArrayBound.yMin-1; i < dotArrayBound.yMax; ++i){
            for(var j = dotArrayBound.xMin-1; j < dotArrayBound.xMax; ++j){
                var density = KDE[i*800 + j]
                if(density >= 3e-5) weight = 1;
                else{
                    weight = weightScale(density)
                }

                if(density >= 3e-5) count++

                //if(weight != 0) count++
                for(var k = 0; k < dotlength; ++k){
                    if(k == number){
                        _this.m_liWeightInfo[i*800 + j][k] = weight
                    }
                    else /*if(k != number && _this.m_liWeightInfo[i*800 + j][k] != 0)*/
                        _this.m_liWeightInfo[i*800 + j][k] += 0 
                    /*else
                        _this.m_liWeightInfo[i*800 + j][k] += 0 
                        */
                }
            }  
        }
        console.log("count", count)
    }

    this.computeWeight = function(colorAmount){
        var count0 = 0
        var count1 = 0
        var count2 = 0
        var count3 = 0
        var count4 = 0
        var dotArrayBound = _this.m_dotArrayBound[0]
        for(var i = dotArrayBound.yMin-1; i < dotArrayBound.yMax; i++){
            for(var j = dotArrayBound.xMin-1; j < dotArrayBound.xMax; j++){
                var weight1 = 0.0000
                for(var k = 0; k < colorAmount; ++k){
                    weight1 += _this.m_liWeightInfo[i*800 + j][k]
                    
                }    
                //if(weight1 != 0) count0 ++
                _this.m_liWeight[i*800 + j] = weight1 / colorAmount
                
                //if(_this.m_liWeight[i*800 + j] != 0.25 && _this.m_liWeight[i*800 + j] != 0.5 && _this.m_liWeight[i*800 + j] != 1 && _this.m_liWeight[i*800 + j] != 0 ) count4 = _this.m_liWeight[i*800 + j]

                if(_this.m_liWeight[i*800 + j] == 1.0000) count1++
                else if(_this.m_liWeight[i*800 + j] == 0.5) count2 ++
                else if(_this.m_liWeight[i*800 + j] == 0) count0++
                else if(_this.m_liWeight[i*800 + j] == 0.25) count3++
                //else if(_this.m_liWeight[i*800 + j] != 0.25 && _this.m_liWeight[i*800 + j] != 0.5 && _this.m_liWeight[i*800 + j] != 1 && _this.m_liWeight[i*800 + j] != 0 ) count4++
                else if(_this.m_liWeight[i*800 + j] == 0.125 )  count4++
            }
        }
        console.log("!=0", count0)
        //console.log("liWeight", _this.m_liWeight)
        
        console.log("1",count1)
        console.log("0.5", count2)
        console.log("0.25", count3)
        console.log("0.125", count4)
        
    }

    this.getContour = function(density,colorSequence,classId,maxdensity,distance,contourColor){
        _this.m_moveFlag = false
        var contour = d3.contours()
            .size([800,800])
            //.thresholds([0,2e-5,3e-5,5e-5,6e-5,maxdensity])
            .thresholds([3e-5])
            (density)
        //console.log("density",density)
        console.log("contour", contour)
        this.addContour(contour,colorSequence,classId,contourColor, 0.5, distance)
    }

    this.addContour = function( contour, colorSequence,classId, contourColor, opacity=1., dotDistance){
        //this._ctx.clearRect(0,0,this._canvasWidth,this._canvasWidth)
        console.log("addcontour")
        var count1 = 0
        var length = _this.m_liClusterInfo.length
        var ctx = this._ctx
        //ctx.beginPath()    
        console.log("contourColor",contourColor) ;
        console.log("i distance", colorSequence, dotDistance)
        ctx.beginPath()
        //var path = this.m_path[colorSequence]
        
        this.findOutlier(colorSequence, classId, dotDistance, 25) ;

        for(var i=0; i < contour.length; ++i){
            //console.log("i",i)
            var dotCanvas = contour[i]
            var coordinateArray = dotCanvas["coordinates"]
            for(var j = 0; j < coordinateArray.length; ++j){
                this.m_path[colorSequence][j] = new paper.Path()
                var array = coordinateArray[j]
                if(array.length == 0) continue
                for(var k = 0; k < array.length; ++k){
                    //console.log("array[k]",array[k])
                    coordinate = array[k]
                    for(var m = 0; m < coordinate.length; ++m){
                        var point = new paper.Point(coordinate[m][0], this._canvasHeight-coordinate[m][1])
                        if(m == 0){  
                            this.m_path[colorSequence][j].moveTo(point)  
                            //ctx.moveTo(coordinate[m][0], this._canvasHeight-coordinate[m][1])
                        }else{
                            //ctx.lineTo(coordinate[m][0], this._canvasWidth-coordinate[m][1])    
                            this.m_path[colorSequence][j].lineTo(point)
                        }
                    }    
                } 
                this.m_path[colorSequence][j].closePath()
                this.m_path[colorSequence][j].strokeColor = contourColor[1]
                this.m_path[colorSequence][j].strokeWidth = 3
                //var color = new paper.Color(contourColor[1])
                var labColor = d3.lab(contourColor[1])

                //var lchColor = d3.hcl(labColor)

                labColor.opacity = opacity
                
                //console.log("lchColor",lchColor)
                //ctx.fillStyle = lchColor
                //ctx.lineWidth = 3
                
                //var object = new pathObject(null,null)
                var object = {path:null,initialColor:null}

                var objectColor = labColor
                this.m_path[colorSequence][j].fillColor = labColor.toString() 

                object.path = this.m_path[colorSequence][j]
                object.initialColor = objectColor
                this.m_objectPath[colorSequence][j] = object

                console.log("this.m_pathColor colorSequence j", colorSequence, j, this.m_path[colorSequence][j].fillColor)      
                //this.m_path[colorSequence][j].fillColor = d3.rgb(lchColor)
            } 
        }
        /*
        if(colorSequence == length-1)
            console.log("********",this.m_objectPath)
        */
        //path.closePath()
        var subtractPath = []
        
       /* 
        //修改为对象数组前的代码 
        if(colorSequence != 0 && colorSequence < length){
            var intersectpathLength = this.m_intersectPath.length
            //var count = 0;
            for(var i = 0; i < this.m_path[colorSequence].length; ++i){
                for(var j = 0; j < intersectpathLength; ++j){
                    console.log("intersectBefore")
                    var intersectPath = this.m_intersectPath[j].intersect(this.m_path[colorSequence][i])
                    //var subtract1 = this.m_path[colorSequence][i].subtract(intersectPath)
                    //var subtract2 = this.m_intersectPath[j].subtract(intersectPath)

                    this.m_intersectPath.push( this.m_intersectPath[j].intersect(this.m_path[colorSequence][i]))
                    this.m_intersectPath.push( this.m_intersectPath[j].subtract(intersectPath))
                    
                    if(length == 2){
                        this.m_intersectPath.push( this.m_path[colorSequence][i].subtract(intersectPath))
                    }
                    else{
                        subtractPath.push( this.m_path[colorSequence][i].subtract(intersectPath))
                    }
                    intersectPath.remove()

                    //count += 2
                    //subtract1.remove()
                    //subtract2.remove()
                    
                    
                }

                if(length != 2){
                    for(var m = 0; m < subtractPath.length; m++){
                        var subtractpath
                        if(m == 0){
                            subtractpath = this.m_path[colorSequence][i].subtract(subtractPath[m])
                        }
                        else{
                            subtractpath = subtractpath.subtract(subtractPath[m])
                        }
                    }
                    this.m_intersectPath.push(subtractpath)
                    //console.log("middlePreintersectPath",this.m_intersectPath)
                    subtractPath = []

                }
                
                
                if(i == this.m_path[colorSequence].length-1){
                    //for(var k = 0; k < intersectpathLength-count; k++){
                    for(var k = 0; k < Math.pow(2,colorSequence)-1; k++){
                        this.m_intersectPath.shift()
                    }
                    //console.log("shiftLength",intersectpathLength-count)
                }
                //console.log("middleAfrintersectPath",this.m_intersectPath)
                //console.log("intersect!!!")
            }

        }
        else if(colorSequence == 0){
            for(var i = 0; i < this.m_path[0].length; ++i)
                this.m_intersectPath.push(this.m_path[0][i])

                console.log("intersectPath",this.m_intersectPath)
        }
      //修改为对象数组前的代码 结束
      */
               
        if(colorSequence != 0 && colorSequence < length){
            var intersectpathLength = this.m_intersectPath.length 
            for(var i = 0; i < this.m_objectPath[colorSequence].length; i++){
                for(var j = 0; j < intersectpathLength; j++){
                    //var intersectPathColorWeight = new pathColorWeight(null,[],0)       //{"path":null,"color":[],"weight":0}
                    var intersectPathColorWeight = {path:null, colorArray:[], weight:0}
                    //var subtract1PathColorWeight = new pathColorWeight(null,[],0)
                    var subtract1PathColorWeight = {path:null, colorArray:[], weight:0}
                    //var subtract2PathColorWeight = new pathColorWeight(null,[],0)
                    var subtract2PathColorWeight = {path:null, colorArray:[], weight:0}
                    //intersect
                    var intersectpath = this.m_intersectPath[j].path.intersect(this.m_objectPath[colorSequence][i].path)
                    var subtract1path = this.m_intersectPath[j].path.subtract(intersectpath)

                    console.log("2222222") ;
                    intersectPathColorWeight.path = intersectpath ;
                    intersectPathColorWeight.colorArray = intersectPathColorWeight.colorArray.concat(this.m_intersectPath[j].colorArray);
                    console.log("*******",this.m_intersectPath[j].colorArray);
                    intersectPathColorWeight.colorArray.push(this.m_objectPath[colorSequence][i].initialColor) ;
                    intersectPathColorWeight.weight = this.m_intersectPath[j].weight + 1 ;
                    this.m_intersectPath.push(intersectPathColorWeight) ;
                    
                    //subtract intersectPath
                    //subtract1PathColorWeight.path = this.m_intersectPath[j].path.subtract(intersectpath)
                    subtract1PathColorWeight.path = subtract1path
                    subtract1PathColorWeight.colorArray = subtract1PathColorWeight.colorArray.concat(this.m_intersectPath[j].colorArray)
                    subtract1PathColorWeight.weight = this.m_intersectPath[j].weight
                    this.m_intersectPath.push(subtract1PathColorWeight)

                    //subtract m_path
                    subtract2PathColorWeight.colorArray.push(this.m_objectPath[colorSequence][i].initialColor)
                    subtract2PathColorWeight.weight = 1
                    if(length == 2){
                        var subtract22path = this.m_objectPath[colorSequence][i].path.subtract(intersectpath)
                        subtract2PathColorWeight.path = subtract22path    
                        this.m_intersectPath.push(subtract2PathColorWeight)
                    }
                    else{
                        var subtract2Midpath = this.m_intersectPath[j].path.intersect(this.m_objectPath[colorSequence][i].path)
                        subtractPath.push(subtract2Midpath)
                    }
                }

                if(length != 2 && i == this.m_objectPath[colorSequence].length-1){   
                    var subtractpath 
                    for(var m = 0; m < subtractPath.length; m++){
                        console.log("subtractPath.length",subtractPath.length)
                        if(m == 0)
                            subtractpath = this.m_objectPath[colorSequence][i].path.subtract(subtractPath[0])
                        else{
                            var midpath = subtractpath 
                            subtractpath = subtractpath.subtract(subtractPath[m])
                            midpath.remove()
                        }
                    }
                    subtract2PathColorWeight.path = subtractpath
                    this.m_intersectPath.push(subtract2PathColorWeight)
                    for(var n = 0; n < subtractPath.length; ++n){
                        subtractPath[n].remove()
                    }
                    subtractPath = []
                }

                if(i == this.m_objectPath[colorSequence].length - 1){
                    console.log("shiftPre",this.m_intersectPath)
                    for(var k = 0; k < Math.pow(2,colorSequence)-1; k++){
                        //console.log("shiftPre",this.m_intersectPath)
                        this.m_intersectPath[0].path.remove()
                        this.m_intersectPath.shift()
                    }
                }
                console.log("shiftAfr",this.m_intersectPath)
            }
        }
        else if(colorSequence == 0){
            for(var i = 0; i < this.m_objectPath[0].length; ++i){
                var firstPathColorWeight = {path:null, colorArray:[], weight:0}
                firstPathColorWeight.path = this.m_objectPath[0][i].path
                colorFirst = this.m_objectPath[0][i].initialColor
                firstPathColorWeight.colorArray.push(colorFirst)
                firstPathColorWeight.weight = 1

                this.m_intersectPath.push(firstPathColorWeight)
            }
        }
        
        if(colorSequence == length-1 ){
            console.log("intersectpath",this.m_intersectPath)
            //console.log("m_pathPre",this.m_objectPath.path)
            this.deletePrePath(length)
            console.log("length",length)
            //console.log("m_path",this.m_objectPath.path)
            this.drawColor(length)
            console.log("allowedDistanceDot", this.m_allowedDistanceDot)
            for(var i = 0; i < length; i++){
                this.drawOutlier(i, dotDistance, length, 15)
            }
            g_contourRender = false
            paper.view.draw()
            count1++

            
        }
        console.log("paperViewCount",count1)
        
        //path.style = null
        //ctx.closePath()
        //ctx.fill()
        //ctx.stroke()
    }

    //Find dots where the mindistance is greater than limit 
    this.findOutlier = function(dotSequence, classId, dotDistance, limit){
        for(var i = 0; i < dotDistance.length; i++){
            if(dotDistance[i].mindistance > limit){
                var allowedDot = Object.assign(dotDistance[i], {"classId":classId})
                this.m_allowedDistanceDot.push(allowedDot)
            }
        }
    }

    this.deletePrePath = function(colorAmount){
       for(var i = 0; i < 3; ++i){
            this.m_objectPath[i][0].path.remove()
       }
    }

    //Find the first allowed dot in the grid we define the size, and draw these dots
    this.drawOutlier = function(colorSequence, dotDistance, length, padding){
        //dotBound 存储xy的边界值
        var count = 0 ;
        var dotBound = _this.m_dotArrayBound[0]
        var xmin = dotBound.xMin
        var xmax = dotBound.xMax
        var ymin = dotBound.yMin
        var ymax = dotBound.yMax ;

        //处理边界的max值
        if(ymax%padding != 0)
            ymax = ymax+(padding-ymax%padding)
        if(xmax%padding != 0)
            xmax = xmax+(padding-xmax%padding)

        for(var i = ymin-ymin%padding; i < ymax; i+=padding){
            for(var j = xmin-xmin%padding; j < xmax; j+=padding){
                gridXMin = j 
                gridXMax = gridXMin + padding
                gridYMin = i 
                gridYMax = gridYMin + padding;

                for(var k = 0; k < this.m_allowedDistanceDot.length; k++){
                    if(this.m_allowedDistanceDot[k].classId == this.m_liClusterInfo[colorSequence].classId)
                    {
                        // console.log("source",this.m_allowedDistanceDot[k].source)
                        // console.log("*********",this.m_liClusterInfo[colorSequence].dots[this.m_allowedDistanceDot[k].source])
                        // console.log("qqqqqqqq",this.m_liClusterInfo[colorSequence])
                        count++
                        
                        var dotX = this.m_liClusterInfo[colorSequence].dots[this.m_allowedDistanceDot[k].source][0]
                        var dotY = this.m_liClusterInfo[colorSequence].dots[this.m_allowedDistanceDot[k].source][1] ;
                        // if(count % 10000 == 0){
                        //     console.log("count****",count)
                        //     console.log("dotX",dotX)
                        //     console.log("dotY",dotY)
                        //     console.log("gridXmin",gridXMin)
                        //     console.log("gridYmin",gridYMin)
                        //     console.log("gridXmax",gridXMax)
                        //     console.log("gridYmax",gridYMax)
                        // }
                        if(dotX > gridXMin && dotY > gridYMin && dotX < gridXMax && dotY < gridYMax){
                            this.m_drawDistanceDot.push(this.m_allowedDistanceDot[k]) ;
                            //console.log("#########",count)
                            break ;
                        }
                    }
                }
            }
        }
        //console.log("count",count)
        if(colorSequence == length-1){
            console.log("drawDistanceDot",this.m_drawDistanceDot)
            var color = d3.schemeCategory10

            for(var i = 0; i < this.m_drawDistanceDot.length; i++){
                //通过classId找到初始颜色，找到drawDot的xy值
                var classId = this.m_allowedDistanceDot[i].classId
                var dotColor = color[Number(classId)%10] 
                var sequence = 0

                //找到该点是liCluster的第一个元素
                for(var j = 0; j < length; j++){
                    if(classId == this.m_liClusterInfo[j].classId){
                        sequence = j ;
                        break ;
                    }
                }
                
                var dotX = this.m_liClusterInfo[sequence].dots[this.m_allowedDistanceDot[i].source][0]
                var dotY = this.m_liClusterInfo[sequence].dots[this.m_allowedDistanceDot[i].source][1]
                // this._ctx.beginPath()
                // this._ctx.fillStyle = dotColor
                // this._ctx.arc(dotX, dotY, 5, 0, 2*Math.PI)
                // this._ctx.closePath()
                var dotPath = new paper.Path.Circle({
                    center: [dotX, dotY],
                    radius: 3
                });
                dotPath.fillColor = dotColor ;
            }

        }    
        //console.log("dotDistance", dotDistance)
    }

    this.drawColor = function(colorAmount){
        for(var i = 0; i < this.m_intersectPath.length; ++i){
            var length = this.m_intersectPath[i].colorArray.length;
            this.m_intersectPath[i].weight = this.m_intersectPath[i].weight/colorAmount ;
            var weight = this.m_intersectPath[i].weight;

            //将colorArray中每个颜色的l,c,h相加放在colorArray[length]这个位置,length为添加元素前的长度
            this.m_intersectPath[i].colorArray.push(d3.lab("#000000"))
            
            for(var j = 0; j < length; j++){
                this.m_intersectPath[i].colorArray[length].l += this.m_intersectPath[i].colorArray[j].l;
                this.m_intersectPath[i].colorArray[length].a += this.m_intersectPath[i].colorArray[j].a;
                this.m_intersectPath[i].colorArray[length].b += this.m_intersectPath[i].colorArray[j].b;
            }
            

            //循环length-1次，每次shift掉colorArray的第一个元素
            
            var colorArrayLength = this.m_intersectPath[i].colorArray.length;
            for(var k = 0; k < colorArrayLength-1; k++){
                dele = this.m_intersectPath[i].colorArray.shift();
            }

            //* 1/w
            this.m_intersectPath[i].colorArray[0].l /= weight
            this.m_intersectPath[i].colorArray[0].a /= weight
            this.m_intersectPath[i].colorArray[0].b /= weight

            this.m_intersectPath[i].colorArray[0] = d3.hcl(this.m_intersectPath[i].colorArray[0])

            // //(att)^w-1*L,(att)^w-1*C,H
            if(i == 0){
                this.m_intersectPath[i].colorArray[0].l *= 0.5
                this.m_intersectPath[i].colorArray[0].c *= 0.5
            }
            else{
                this.m_intersectPath[i].colorArray[0].l *= Math.pow(0.5,weight-1)
                this.m_intersectPath[i].colorArray[0].c *= Math.pow(0.5,weight-1)
            }
            this.m_intersectPath[i].colorArray[0] = d3.lab(this.m_intersectPath[i].colorArray[0])
            this.m_intersectPath[i].colorArray[0].opacity = 0.5
            
            this.m_intersectPath[i].path.fillColor = this.m_intersectPath[i].colorArray[0].toString()
            //this.m_intersectPath[6].path.fillColor = "#000000"

            console.log("intersectcolori",i,this.m_intersectPath[i].colorArray[0]) ;

        }
    }

    this.colorBlend = function(contourColor, classSequence, classAmount, opacity=1.){
        var count4 = 0
        var left = 0, top = 0
        var step = this._canvasWidth / 800
        this._ctx.beginPath()

        console.log(' render begin ');
        var dotArrayBound = _this.m_dotArrayBound[0]
        
        for(var i = dotArrayBound.yMin-1; i < dotArrayBound.yMax; ++i){
            for(var j = dotArrayBound.xMin; j < dotArrayBound.xMax; ++j){
        
       /*
       for(var i = 0; i < 800 ; ++i){
            for(var j = 0; j < 800; ++j){
        */
                var top = step*i
                //var top = this._canvasHeight - step*i
                var left = step * j
                /*
                if(i < dotArrayBound.yMin-1 || i >= dotArrayBound.yMax || j < dotArrayBound.xMin || j >= dotArrayBound.xMax){
                    this._ctx.fillStyle = "#ffffff"
                    this._ctx.fillRect(left,top,step,step)    
                    continue
                }*/
                var basedColor = contourColor[1]
                var firstLabColor = d3.lab(contourColor[1])
                var liWeightInfo = this.m_liWeightInfo[i*800 + j]
                var liWeight = this.m_liWeight[i*800 + j]

                //var middleLabColor = this.m_middleLabColor[i*800 + j]
                if(liWeightInfo[classSequence] == 0 )
                    continue
                else{
                    firstLabColor.l *= liWeightInfo[classSequence]
                    firstLabColor.a *= liWeightInfo[classSequence]
                    firstLabColor.b *= liWeightInfo[classSequence]
                }
                //console.log("colorBlend", classSequence)
                if(classSequence == 0)
                    this.m_middleLabColor[i*800 + j] = firstLabColor
                else{
                    this.m_middleLabColor[i*800 + j].l += firstLabColor.l
                    this.m_middleLabColor[i*800 + j].a += firstLabColor.a
                    this.m_middleLabColor[i*800 + j].b += firstLabColor.b
                } 
                // console.log("colorBlend2", classSequence)
                if(classSequence == classAmount-1){
                    this.m_middleLabColor[i*800 + j].l /= liWeight
                    this.m_middleLabColor[i*800 + j].a /= liWeight
                    this.m_middleLabColor[i*800 + j].b /= liWeight
                }
                
                if(this.m_middleLabColor[i*800+j].opacity != 1) count4 = i*800+j 
                //console.log("colorBlend3", classSequence)
                //console.log("middleLabColor", this.m_middleLabColor)
                this.m_middleLabColor[i*800 + j].opacity = opacity

                if(classSequence != classAmount-1){
                    continue
                }
                this.m_middleLchColor[i*800 + j] = d3.hcl(this.m_middleLabColor[i*800+j])
                this.m_middleLchColor[i*800 + j] = d3.hcl(this.m_middleLabColor[i*800+j])
                this.m_middleLchColor[i*800 + j].l = Math.pow(this.m_middleLchColor[i*800+j].l, liWeight-1)
                this.m_middleLchColor[i*800 + j].c = Math.pow(this.m_middleLchColor[i*800+j].c, liWeight-1)
                this.m_lastLabColor[i*800+j] = d3.lab(this.m_middleLchColor[i*800+j])
                this._ctx.fillStyle = this.m_lastLabColor[i*800+j]
                this._ctx.fillRect(left, top, step, step)
                //console.log("firstLabColor", firstLabColor)
            }
        }
        this.m_moveFlag = false
        console.log("middleLabColor2", this.m_middleLabColor)
        console.log("opacitycount", count4)
    }

    this.addKDE = function(liKDE, minKDE, maxKDE, liKDEColor, opacity=1.){
        console.log(" minKDE, maxKDE ", minKDE, maxKDE) ;
        var step = (this._canvasWidth)/800

        var colorScale = d3.scaleLinear()
             .domain([0, maxKDE])
             .range(liKDEColor)

        var left = 0, top = 0
        this._ctx.beginPath()
        for(var i = 0; i < 800; i++){
            top = this._canvasHeight - step*i ;
            for(var j = 0; j < 800; ++j){
                var left = step * j
                var density = liKDE[i * 800 +j]
                var color = d3.color(colorScale(density)) ;
                // console.log(i*100+j)
                //console.log("density",density)
                //console.log("color",color)
                color.opacity = opacity
                this._ctx.fillStyle = color.toString()

                this._ctx.fillRect(left, top, step, step)
                
            }
        }
    }

    this.serverCompute = function(liClusterInfo, xyMinMax){
         this.m_liClusterInfo = liClusterInfo ;

         this.m_xMin = xyMinMax[0], this.m_xMax = xyMinMax[1] 
         this.m_yMin = xyMinMax[2], this.m_yMax = xyMinMax[3]

         this.m_moveFlag = false
         this.m_middleLabColor = []
         this.m_middleLchColor = []
         this.m_lastLabColor = []
         for(var i = 0; i < 800; ++i){
            for(var j = 0; j < 800; ++j){
                this.m_middleLabColor[i*800 + j] = d3.lab("#ffffff")
                this.m_middleLchColor[i*800 + j] = d3.hcl("#ffffff")
                this.m_lastLabColor[i*800 + j] = d3.lab("#ffffff")
            }
         }
         //console.log("classIdDots2", this.m_classIdDots)
         _this.m_dotArrayBound = []
         this.findDotBound(this.m_classIdDots)
         console.log("dotArrayBound",_this.m_dotArrayBound)
         console.log("liClusterInfo", this.m_liClusterInfo)
         
        for(var i = 0; i < this.m_liClusterInfo.length; i++){ 
            //var liKDE = this.m_liClusterInfo[i]["densitys"]
            
            //var path = new paper.Path()
            this.m_path[i] = [] 
            this.m_objectPath[i] = []
            
            //this.weightInfo(liKDE,i,this.m_liClusterInfo.length)
        }

        //console.log("this.m_path", this.m_path)

        //this.computeWeight(this.m_liClusterInfo.length)
        
         this.m_kdeRender = true
         this.render() ;
    }

    this._init(domId)
}
