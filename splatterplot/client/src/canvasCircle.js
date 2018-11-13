function drawCircle(context,centerDotX,centerDotY,radius,ifFill,ifStroke){
    context.beginPath()
    context.arc(centerDotX,centerDotY,radius,0,2*Math.PI)
    if(ifFill){
        context.fill()
    }
    if(ifStroke)    
        context.stroke()
    context.closePath()
}