export default class Block {
    constructor (blockType) {
        this.blockType = blockType
        this.pattern = 0;
        this.patternNum = 2;
    }

    registerFunction (name, response) {  
        const functions = {}
        for (let i = 1; i < this.patternNum; i++) {
            const key = 'pattern' + i
            functions[key] = eval('this.drawPattern' + i)
        }

        if(typeof functions[name] !== "undefined") {
            functions[name](response);
        } else {
            console.log('This function is not regsted : ' + name)
        }
    }  
    
    drawPattern1 (info) {
        const p5 = info.p5
        const x = info.x
        const y = info.y
        const w = info.w
        const h = info.h
    
        var side = w;
        var side2 = h;	
        p5.push();
        p5.translate(x, y);
        p5.noStroke();
        p5.fill(131, 18, 28);	
        p5.beginShape();
        p5.vertex(side / 3, 0);
        p5.vertex(side / 3 + side / 3, 0);
        p5.vertex(side, side/3);
        p5.vertex(side, side/3 + side / 3);
        p5.vertex(side / 3 + side / 3, side);
        p5.vertex(side / 3, side);
        p5.vertex(0, side / 3 + side / 3);
        p5.vertex(0, side / 3);
        
        p5.endShape(p5.CLOSE);
        
        p5.noStroke();
        p5.fill(142, 75, 28);	
        // ellipse(x-side/2,y-side/2,30,30);	
        p5.ellipse(side / 2, side / 2, 10,10);	
        p5.pop();	
      }    
}
