export default class Block {
    constructor (blockType) {
        this.blockType = blockType
        this.pattern = 1;
        
        this.patternNum = 10;
    }

    registerFunction (response) {  
        const functions = {}
        for (let i = 1; i <= this.patternNum; i++) {
            const key = 'pattern' + i
            functions[key] = eval('this.drawPattern' + i)
        }

        const name = 'pattern' + this.pattern

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
        p5.fill(255);
        p5.rect(0, 0, w, h);

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

      drawPattern2 (info) {
        const p5 = info.p5
        const x = info.x
        const y = info.y
        const w = info.w
        const h = info.h

        p5.push();
        p5.noFill();
        p5.strokeWeight(4);	
        p5.translate(x, y);
        p5.fill(255);
        p5.rect(0, 0, w, h);
        // var w = 50;
        var step = w / 4;
        var count = 0;
        for (var i = w; i > 0; i -= step) {
            if (count % 2 == 0) {
                p5.stroke(131, 18, 28);	
            } else {
                p5.stroke(142, 75, 28);
            }
            
            var size = i;
            p5.arc(w / 2, h, size, size, p5.PI, 0);		
            count++;
        }
        p5.pop();	
    }

    drawLineWithVector(p5, v1, v2) {
        p5.line(v1.x, v1.y, v2.x, v2.y);
    }
    
    drawPattern3 (info) {
        const p5 = info.p5
        const x = info.x
        const y = info.y
        const w = info.w
        const h = info.h

        p5.push();
        p5.translate(x, y);
        p5.fill(255);
        p5.rect(0, 0, w, h);

        /*
            0 1  2  3  4
            15         5
            14		     6
            13         7
            12 11 10 9 8
        */
        var wUnit = w / 4;
        var hUnit = h / 4;
        var v0 = p5.createVector(0, 0);
        var v1 = p5.createVector(0 + wUnit, 0);
        var v2 = p5.createVector(0 + wUnit * 2, 0);
        var v3 = p5.createVector(0 + wUnit * 3, 0);
        var v4 = p5.createVector(0 + w, 0);
        
        var v5 = p5.createVector(0 + w, 0 + hUnit);
        var v6 = p5.createVector(0 + w, 0 + hUnit * 2);
        var v7 = p5.createVector(0 + w, 0 + hUnit * 3);
        var v8 = p5.createVector(0 + w, 0 + h);
        
        var v9 = p5.createVector(0 + wUnit * 3, 0 + h);
        var v10 = p5.createVector(0 + wUnit * 2, 0 + h);
        var v11 = p5.createVector(0 + wUnit, 0 + h);
        var v12 = p5.createVector(0, 0 + h);
    
        var v13 = p5.createVector(0, 0 + hUnit * 3);
        var v14 = p5.createVector(0, 0 + hUnit * 2);
        var v15 = p5.createVector(0, 0 + hUnit);
    
        p5.strokeWeight(3);
        p5.stroke(131, 18, 28);	
        
        // drawLineWithVector(p5, v0, v8);
        p5.line(v0.x, v0.y, v8.x, v8.y);
        p5.line(v1.x, v1.y, v7.x, v7.y);
        p5.line(v2.x, v2.y, v6.x, v6.y);
        p5.line(v3.x, v3.y, v5.x, v5.y);
        p5.line(v15.x, v15.y, v9.x, v9.y);
        p5.line(v14.x, v14.y, v10.x, v10.y);
        p5.line(v13.x, v13.y, v11.x, v11.y);
    
        p5.pop();	
    }

    drawPattern4(info) {
        const p5 = info.p5
        const x = info.x
        const y = info.y
        const w = info.w
        const h = info.h

        p5.push();
        p5.translate(x, y);
        p5.fill(255);
        p5.rect(0, 0, w, h);

        /*
            0 1  2  3  4
            15         5
            14		     6
            13         7
            12 11 10 9 8
        */
        var wUnit = w / 4;
        var hUnit = h / 4;
        var v0 = p5.createVector(0, 0);
        var v1 = p5.createVector(0 + wUnit, 0);
        var v2 = p5.createVector(0 + wUnit * 2, 0);
        var v3 = p5.createVector(0 + wUnit * 3, 0);
        var v4 = p5.createVector(0 + w, 0);
        
        var v5 = p5.createVector(0 + w, 0 + hUnit);
        var v6 = p5.createVector(0 + w, 0 + hUnit * 2);
        var v7 = p5.createVector(0 + w, 0 + hUnit * 3);
        var v8 = p5.createVector(0 + w, 0 + h);
        
        var v9 = p5.createVector(0 + wUnit * 3, 0 + h);
        var v10 = p5.createVector(0 + wUnit * 2, 0 + h);
        var v11 = p5.createVector(0 + wUnit, 0 + h);
        var v12 = p5.createVector(0, 0 + h);
    
        var v13 = p5.createVector(0, 0 + hUnit * 3);
        var v14 = p5.createVector(0, 0 + hUnit * 2);
        var v15 = p5.createVector(0, 0 + hUnit);
    
        p5.strokeWeight(2);
        p5.stroke(131, 18, 28);	

        p5.line(v0.x, v0.y, v8.x, v8.y);
        p5.line(v1.x, v1.y, v7.x, v7.y);
        p5.line(v2.x, v2.y, v6.x, v6.y);
        p5.line(v3.x, v3.y, v5.x, v5.y);
        p5.line(v15.x, v15.y, v9.x, v9.y);
        p5.line(v14.x, v14.y, v10.x, v10.y);
        p5.line(v13.x, v13.y, v11.x, v11.y);
    
        p5.stroke(142, 75, 28);
        p5.line(v4.x, v4.y, v12.x, v12.y);
        p5.line(v3.x, v3.y, v13.x, v13.y);
        p5.line(v2.x, v2.y, v14.x, v14.y);
        p5.line(v1.x, v1.y, v15.x, v15.y);        
        p5.line(v5.x, v5.y, v11.x, v11.y);
        p5.line(v6.x, v6.y, v10.x, v10.y);
        p5.line(v7.x, v7.y, v9.x, v9.y);
    
        p5.pop();	
    }    
}
