
function PointGenerator(){
    var _this = this
    this.m_dotClass = undefined
    this.m_dotRadius = 70
    this.m_pointNum = 10 

    this._init = function(){
        console.log("..pointgenerator..")
        //this.m_abled = false
    }

    this.generateDots = function(){
        var self = this 
        this.m_dotClass = Number(document.getElementById("label").value)
        this.m_pointNum = Number(document.getElementById("pointNumber").value)

        console.log("Generate Dots：","class:",this.m_dotClass," ","number",this.m_pointNum)
        //console.log(g_spDrawing._canvasWidth)
        g_spDrawing._canvas.onmousemove = function(e){
            
            g_spDrawing.moveCircle(true,e.pageX,e.pageY,_this.m_dotRadius)

        }
        g_spDrawing._canvas.onmousedown = function(e){
            var randomDots = []
            for(var i = 0; i < self.m_pointNum; i++){
                var arc = Math.random() * 2 * Math.PI ;
                var cx = e.pageX + Math.cos(arc) * self.m_dotRadius * Math.random();
                var cy = e.pageY + Math.sin(arc) * self.m_dotRadius * Math.random();

                //console.log('cy:',cy) 
                var pos = {
                    x : cx ,
                    y : cy
                } ;
                randomDots.push(pos) ;
            }
            //console.log("randomDots",randomDots)
            g_spDrawing.addCircle(self.m_pointNum, self.m_dotClass, randomDots) ;
        }
    }
}