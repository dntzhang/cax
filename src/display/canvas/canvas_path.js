import Path from '../path.js'

class CanvasPath extends Path{
    constructor(d , option){
        super(d , option)
    }

    draw(ctx) {
        ctx.save()

        ctx.lineWidth = this.strokeWidth
        ctx.strokeStyle = this.stroke
        ctx.fillStyle = this.fill
        ctx.beginPath()
        const points = this.d.split(/[M,L,H,V,C,S,Q,T,A,Z,m,l,h,v,c,s,q,t,a,z]/g);
        const cmds = this.d.match(/[M,L,H,V,C,S,Q,T,A,Z,m,l,h,v,c,s,q,t,a,z]/g);

        for (let j = 0, cmdLen = cmds.length; j < cmdLen; j++) {
            var pArr = points[j].split(" ");
            if (cmds[j] == "M") {
                pArr[0] = parseFloat(pArr[0]);
                pArr[1] = parseFloat(pArr[1]);
                ctx.moveTo.apply(ctx, pArr);
            } else if (cmds[j] == "C") {
                pArr[0] = parseFloat(pArr[0]);
                pArr[2] = parseFloat(pArr[2]);
                pArr[4] = parseFloat(pArr[4]);
                pArr[1] = parseFloat(pArr[1]);
                pArr[3] = parseFloat(pArr[3]);
                pArr[5] = parseFloat(pArr[5]);
                ctx.bezierCurveTo.apply(ctx, pArr)
            } else if (cmds[j] == "L") {
                pArr[0] = parseFloat(pArr[0]);
                pArr[1] = parseFloat(pArr[1]);
                ctx.lineTo.apply(ctx, pArr);
            }
        }

        ctx.fill();
        ctx.stroke();

        ctx.restore()
    }




}

export default CanvasPath