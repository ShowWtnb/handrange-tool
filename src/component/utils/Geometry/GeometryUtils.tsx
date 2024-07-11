import { useEffect, useState , useRef } from "react";

class CanvasProps{
    points?: string;
    radius?: number;
    line?: number;
}

function Canvas(prop:CanvasProps) {
    const [l, setLine] = useState(0);
    const [r, setRadius] = useState(0);
      const canvasRef = useRef(null);
      const getContext = (): CanvasRenderingContext2D => {
        const canvas: any = canvasRef.current;
        return canvas.getContext('2d');
      };
    //   useEffect(() => {
    //     const ctx: CanvasRenderingContext2D = getContext();
    //     ctx.fillRect(0,0, 100, 100);
    //     ctx.beginPath();
    //     // ctx.moveTo(150, 150);
    //     ctx.fillStyle = '#f3f3f3';
    //     ctx.arc(150, 150, 100, 0 * Math.PI / 180, 45 * Math.PI / 180, true);
    //     ctx.fill();
    //     ctx.fillStyle = '#00FF00';
    //     ctx.save();
    //   }, [prop.points]);
      useEffect(() => {
        if(prop.radius != undefined && prop.line!=undefined){
            setRadius(prop.radius);
            setLine(prop.line);
        }
      }, [prop.radius, prop.line]);
      useEffect(() => {
            const ctx: CanvasRenderingContext2D = getContext();
            var arcTanPIby5 = Math.atan(Math.PI/5);
            var tanPIby5 = Math.tan(Math.PI/5);
            var R = r;
            var a = -1 * tanPIby5;
            var b = -1*r-a*(r+(l/2));
            var A = (1+a)*(1+a);
            var B = -2*r+2*a*b+2*a*r;
            var C = b*b+2*b*r+2*r*r-R*R;
            // console.log('Canvas a', a,b,A, B, C);
            var x1 = (-B + Math.sqrt(B*B-4*A*C))/(2*A);
            var x2 = (-B - Math.sqrt(B*B-4*A*C))/(2*A);
            var Cy1 = x1*x1-2*r*x1+2*r*r-R*R;
            var Cy2 = x2*x2-2*r*x2+2*r*r-R*R;
            var y11 = (-2*r + Math.sqrt(4*r*r -4* Cy1))/(2);
            var y12 = (-2*r - Math.sqrt(4*r*r -4* Cy1))/(2);
            var y21 = (-2*r + Math.sqrt(4*r*r -4* Cy2))/(2);
            var y22 = (-2*r - Math.sqrt(4*r*r -4* Cy2))/(2);
            console.log('Canvas p1', x1, x2, y11, y12, y21, y22);
            
            R = r / 2;
            // a = -1 * tanPIby5;
            // b = -1*r-a*(r+(l/2));
            // A = (1+a)*(1+a);
            // B = -2*r+2*a*b+2*a*r;
            C = b*b+2*b*r+2*r*r-R*R;
            // console.log('Canvas a', a,b,A, B, C);
            var x2_1 = (-B + Math.sqrt(B*B-4*A*C))/(2*A);
            var x2_2 = (-B - Math.sqrt(B*B-4*A*C))/(2*A);
            Cy1 = x2_1*x2_1-2*r*x2_1+2*r*r-R*R;
            Cy2 = x2_2*x2_2-2*r*x2_2+2*r*r-R*R;
            var y2_11 = (-2*r + Math.sqrt(4*r*r -4* Cy1))/(2);
            var y2_y12 = (-2*r - Math.sqrt(4*r*r -4* Cy1))/(2);
            var y2_y21 = (-2*r + Math.sqrt(4*r*r -4* Cy2))/(2);
            var y2_y22 = (-2*r - Math.sqrt(4*r*r -4* Cy2))/(2);
            console.log('Canvas p2', x2_1, x2_2, y2_11, y2_y12, y2_y21, y2_y22);
            // 直線と交わる場合
            var yy = -R;
            var xy = (yy - b) / a;
            console.log('Canvas p3', xy, yy);
    
            ctx.beginPath();
            // ctx.moveTo(150, 150);
            // 外の緑
            ctx.fillStyle = '#00FF00';
            ctx.arc(r, r, r, (Math.PI / 2), (3 * Math.PI / 2), false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc((r+l), r, r, (Math.PI / 2), (3 * Math.PI / 2), true);
            ctx.fill();
            ctx.beginPath();
            ctx.fillRect(r, 0, (l), (2*r));
            // 黒で中抜き
            ctx.fillStyle = '#000000'; 
            ctx.beginPath();
            ctx.arc((r), (r), (r/2), (Math.PI / 2), (3 * Math.PI / 2), false);
            ctx.fill();
            ctx.beginPath();
            ctx.arc((r+l), (r), (r/2), (Math.PI / 2), (3 * Math.PI / 2), true);        
            ctx.fill();
            ctx.beginPath();
            ctx.fillRect(r, r/2, (l), (r));
    
            ctx.fillStyle = '#0000FF'; 
            ctx.beginPath();
            // ctx.lineTo();
            ctx.fillRect(x2, -y21, (r+l/2-x2), (r+y21));
            ctx.fillStyle = '#FF00FF'; 
            ctx.beginPath();
            ctx.fillRect(x2_2, -y2_y21, (r+l/2-x2_2), (r+y2_y21));
            ctx.fillStyle = '#FFFFFF'; 
            ctx.beginPath();
            ctx.fillRect(xy, -yy, (r+l/2-xy), (r+yy));
    
            // ctx.fillStyle = '#FF00006E'; 
            // ctx.beginPath();
            // ctx.moveTo(r, r);
            // ctx.arc(r, (r), r, ((2*Math.PI)*(180/360)), ((2*Math.PI)*(242/360)), false); 
            // ctx.fill();
    
            // ctx.fillStyle = '#FFFF006E'; 
            // ctx.beginPath();
            // ctx.moveTo((r+l/2), r);
            // ctx.arc((r+l/2), (r), (r+l/2), ((2*Math.PI)*(180/360)), ((2*Math.PI)*(216/360)), false); 
            // ctx.fill();
    
            const colors = ['#FF00006E','#00FF006E','#0000FF6E','#FFFF006E','#FF00FF6E','#00FFFF6E','#FF00006E','#00FF006E','#0000FF6E','#FFFFFF6E']
            for (let i = 0; i < 10; i++) {
                ctx.fillStyle = colors[i%10]; 
                ctx.strokeStyle = "Orange";  // 線の色
                ctx.lineWidth = 5;           // 線の太さ
    
                ctx.beginPath();
                ctx.moveTo((r+l/2), r);
                const st = (180 + 36 * i) % 360;
                const ed = (216 + 36 * i) % 360;
                console.log('Canvas p', i, st, ed);
                ctx.arc((r + l / 2), (r), (r + l / 2), ((2 * Math.PI) * (st/360)), ((2 * Math.PI) * (ed/360)), false); 
                ctx.stroke();
                ctx.fill();
            }
    
            //
            ctx.save();
        }, [r, l]);
    
      console.log('Canvas', r ,l);
      return (
        <div>
          <canvas height={2 * r} width={2 * r + l} className="canvas" ref={canvasRef} />
        </div>
      );
    }
    
    // https://zenn.dev/ymmt1089/articles/20220513_next_p5
    // class SketchComponentProps{
    //     width?: number;
    //     height?: number;
    // }
    // // https://zenn.dev/ymmt1089/articles/20220513_next_p5
    // const SketchComponent = (prop: SketchComponentProps) => {
        
    //     const preload = (p5: p5Types) => {
    //         // 画像などのロードを行う
    //     };
    
    //     const setup = (p5: p5Types, canvasParentRef: Element) => {
    //         p5.createCanvas(p5.windowWidth, p5.windowHeight).parent(canvasParentRef);
    //         p5.background(255, 204, 0);
    //         // p5.colorMode(p5.HSB, p5.width, p5.height, 100);
    //         // p5.noStroke();
    //         // console.log('PokerTable', line);
    //         // p5.ellipse(100, 40, line, 55);
    //     };
    
    //     const barWidth = 20;
    //     let lastBar = -1;
    //     const draw = (p5: p5Types) => {
    //         // // p5でいうdrawの処理を書く
    //         // let whichBar = p5.mouseX / barWidth;
    //         // if (whichBar !== lastBar) {
    //         //     let barX = whichBar * barWidth;
    //         //     p5.fill(barX, p5.mouseY, 66);
    //         //     p5.rect(barX, 0, barWidth, p5.height);
    //         //     lastBar = whichBar;
    //         // }
    //     };
    
    //     const windowResized = (p5: p5Types) => {
    //         // コンポーネントのレスポンシブ化
    //         p5.resizeCanvas(p5.windowWidth, p5.windowHeight);
    
    //         console.log('PokerTable', line);
    //         p5.ellipse(line/2, 40, line, 55);
    //     };
    
    //     const mouseClicked = (p5: p5Types) => {
    //         // p5.ellipse(mouseX, mouseY, 105, 55);
    //         // console.log('PokerTable', p5.mouseX, p5.mouseY);
    //     }
    
    //     return (
    //         <Sketch
    //             preload={preload}
    //             setup={setup}
    //             draw={draw}
    //             windowResized={windowResized}
    //             mousePressed={mouseClicked}
    
    //         />
    //     );
    // };