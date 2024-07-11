import { useEffect, useState, useRef } from "react";
import { useWindowSize } from "../utils/useWindowSize";
import { Stage, Layer, Shape, Text, Rect } from "react-konva";
import Konva from 'konva';
// 色々すごいことはできそうだけど今回の目的にはリッチすぎる
// import Sketch from "react-p5"
// import p5Types from "p5"

// TypeScript非対応のライブラリを参照する時にエラーになる
// https://qiita.com/Nossa/items/726cc3e67527e896ed1e
// const { Rectangle, Ellipse, Polyline, CornerBox } = require('react-shapes');
// import {Rectangle, Ellipse, Polyline} from "react-shapes"

const maxVal = NaN;
// const rectPoints = [
//     [[(1 / 3), 1], [(1 / 3 + 1 / 24), 3 / 4], [(2 / 3 - 1 / 24), 3 / 4], [(2 / 3), 1]],
//     [[(1 / 3), 0], [(1 / 3 + 1 / 24), 1 / 4], [(2 / 3 - 1 / 24), 1 / 4], [(2 / 3), 0]]
// ];
const arcPoints = [
    // Dealerと対面
    [[(1 / 3), 1, maxVal], [(1 / 3 + 1 / 24), 3 / 4, maxVal], [(2 / 3 - 1 / 24), 3 / 4, maxVal], [(2 / 3), 1, maxVal]],
    [[(1 / 3), 0, maxVal], [(1 / 3 + 1 / 24), 1 / 4, maxVal], [(2 / 3 - 1 / 24), 1 / 4, maxVal], [(2 / 3), 0, maxVal]],
    // 上下の脇
    [
        [(2 / 3), 1, (2 / 3) + (2 / 6) * (2 * Math.cos(Math.PI / 4) - 1), 1, (2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), (2 / 6)],
        [(2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
        [(2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), /*(1 / 6)*/maxVal],
        [(2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), (2 / 3 + (1 / 6) * (2 * Math.cos(Math.PI / 4) - 1)), (3 / 4), (2 / 3), (3 / 4), (1 / 6)],
        [(2 / 3), (3 / 4), maxVal],
        [(2 / 3 - 1 / 24), 3 / 4, maxVal],
        [(2 / 3), 1, maxVal]
    ]
    ,
    [
        [(1 / 3), 1, (1 / 3) - (2 / 6) * (2 * Math.cos(Math.PI / 4) - 1), 1, (1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), (2 / 6)],
        [(1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
        [(1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), /*(1 / 6)*/maxVal],
        [(1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), (1 / 3 - (1 / 6) * (2 * Math.cos(Math.PI / 4) - 1)), (3 / 4), (1 / 3), (3 / 4), (1 / 6)],
        [(1 / 3), (3 / 4), maxVal],
        [(1 / 3 + 1 / 24), 3 / 4, maxVal],
        [(1 / 3), 1, maxVal]
    ]
    ,
    [
        [(1 / 3), 0, (1 / 3) - (2 / 6) * (2 * Math.cos(Math.PI / 4) - 1), 0, (1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), (2 / 6)],
        [(1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
        [(1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), /*(1 / 6)*/maxVal],
        [(1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), (1 / 3 - (1 / 6) * (2 * Math.cos(Math.PI / 4) - 1)), (1 / 4), (1 / 3), (1 / 4), (1 / 6)],
        [(1 / 3), (1 / 4), maxVal],
        [(1 / 3 + 1 / 24), 1 / 4, maxVal],
        [(1 / 3), 0, maxVal]
    ],
    [
        [(2 / 3), 0, (2 / 3) + (2 / 6) * (2 * Math.cos(Math.PI / 4) - 1), 0, (2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), (2 / 6)],
        [(2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
        [(2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), /*(1 / 6)*/maxVal],
        [(2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), (2 / 3 + (1 / 6) * (2 * Math.cos(Math.PI / 4) - 1)), (1 / 4), (2 / 3), (1 / 4), (1 / 6)],
        [(2 / 3), (1 / 4), maxVal],
        [(2 / 3 - 1 / 24), 1 / 4, maxVal],
        [(2 / 3), 0, maxVal]
    ],

    // 左右
    [
        [(2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), 1, (1 / 2 + (1 / 2 * (2 * Math.cos(Math.PI / 4) - 1))), (1), (1 / 2), (2 / 6)],
        [(1), (1 / 2), maxVal],
        [(2 / 3 + 1 / 6), (1 / 2), maxVal],
        [(2 / 3 + 1 / 6), (1 / 2), (2 / 3 + 1 / 6), (1 / 2 + (1 / 4 * (2 * Math.cos(Math.PI / 4) - 1))), (2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), (1 / 6)],
        [(2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), maxVal],
        [(2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
    ],
    [
        [(2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), 1, (1 / 2 - (1 / 2 * (2 * Math.cos(Math.PI / 4) - 1))), (1), (1 / 2), (2 / 6)],
        [(1), (1 / 2), maxVal],
        [(2 / 3 + 1 / 6), (1 / 2), maxVal],
        [(2 / 3 + 1 / 6), (1 / 2), (2 / 3 + 1 / 6), (1 / 2 - (1 / 4 * (2 * Math.cos(Math.PI / 4) - 1))), (2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), (1 / 6)],
        [(2 / 3 + (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), maxVal],
        [(2 / 3 + (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
    ],
    [
        [(1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), 0, (1 / 2 + (1 / 2 * (2 * Math.cos(Math.PI / 4) - 1))), (0), (1 / 2), (2 / 6)],
        [(0), (1 / 2), maxVal],
        [(1 / 3 - 1 / 6), (1 / 2), maxVal],
        [(1 / 3 - 1 / 6), (1 / 2), (1 / 3 - 1 / 6), (1 / 2 + (1 / 4 * (2 * Math.cos(Math.PI / 4) - 1))), (1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), (1 / 6)],
        [(1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 4) * Math.sin(Math.PI / 4)), maxVal],
        [(1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 + (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
    ],
    [
        [(1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), 0, (1 / 2 - (1 / 2 * (2 * Math.cos(Math.PI / 4) - 1))), (0), (1 / 2), (2 / 6)],
        [(0), (1 / 2), maxVal],
        [(1 / 3 - 1 / 6), (1 / 2), maxVal],
        [(1 / 3 - 1 / 6), (1 / 2), (1 / 3 - 1 / 6), (1 / 2 - (1 / 4 * (2 * Math.cos(Math.PI / 4) - 1))), (1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), (1 / 6)],
        [(1 / 3 - (1 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 4) * Math.sin(Math.PI / 4)), maxVal],
        [(1 / 3 - (2 / 6) * Math.cos(Math.PI / 4)), (1 / 2 - (1 / 2) * Math.sin(Math.PI / 4)), maxVal],
    ]
];
const playNumConverter = [-1, 5, 9, 1, 4, 6, 8, 7, 2, 3]

export class PokerTableProps {
    // playerCount?: number = 9;
    callback?: Function;
    styles?: PokerTableStyles;
}
export class PokerTableStyles {
    colorBackground?: string = '#2E8B57';
    color1?: string = '#2F4F4F';
    color2?: string = '#708090';
    fontsize?: number = 20;
    fontColor?: string = '#000000';
    dealerColor?: string = '#B0B0B0';
    dealerLabel?: string = 'Dealer';
}

// const colorBackground = '#2E8B57';
// const color1 = '#2F4F4F';
// const color2 = '#708090';
// const colorList = ['#B0B0B0', color2, color2, color2, color1, color1, color1, color2, color1, color2];

export default function PokerTable(prop: PokerTableProps) {
    const [winWidth, winHeight] = useWindowSize();
    // const diams = [80.0, 37.998];   // 陸上トラックの比率
    // const diamSum = diams[0] + 2.0 * diams[1];
    // const [line, setLine] = useState(0);
    // const [radius, setRadius] = useState(0);
    const [pointsActually, setPointsActually] = useState<number[][][]>([]);
    const [arcsActually, setArcsActually] = useState<number[][][]>([]);
    useEffect(() => {
        // var pointsA = [];
        const winWidthCoordinated = 0.93 * winWidth;
        const winHeightCoordinated = winWidthCoordinated * 2 / 3;
        // const winWidthCoordinated = 600;
        // const winHeightCoordinated = 400;

        // for (let i = 0; i < rectPoints.length; i++) {
        //     const elementI = rectPoints[i];
        //     var tmp = [];
        //     for (let j = 0; j < elementI.length; j++) {
        //         const elementJ = elementI[j];
        //         tmp.push([elementJ[0] * winWidthCoordinated, elementJ[1] * winHeightCoordinated]);
        //     }
        //     pointsA.push(tmp);
        // }
        // setPointsActually([...pointsA]);

        var arcA = [];
        for (let i = 0; i < arcPoints.length; i++) {
            const elementI = arcPoints[i];
            var tmp = [];
            for (let j = 0; j < elementI.length; j++) {
                const elementJ = elementI[j];
                var ele = []
                for (let k = 0; k < elementJ.length; k++) {
                    const element = elementJ[k];
                    if (k % 2 === 0) {
                        ele.push(element * winWidthCoordinated);
                    } else {
                        ele.push(element * winHeightCoordinated);
                    }
                }
                tmp.push(ele);
                // tmp.push([elementJ[0] * winWidthCoordinated, elementJ[1] * winHeightCoordinated, elementJ[2] * winWidthCoordinated, elementJ[3] * winHeightCoordinated, elementJ[4] * winWidthCoordinated, elementJ[5] * winHeightCoordinated, elementJ[6] * winWidthCoordinated]);
                // console.log('PokerTable elementJ', elementJ);
            }
            arcA.push(tmp);
        }
        // console.log('Canvas pointsA', pointsA);
        setArcsActually([...arcA]);
    }, [winWidth]);

    const [styles, setStyles] = useState<PokerTableStyles>();
    const [color1, setColor1] = useState('');
    const [color2, setColor2] = useState('');
    const [colorList, setColorList] = useState<string[]>();
    const [fontsize, setFontsize] = useState(-1);
    const [fontColor, setFontColor] = useState('');
    const [colorBackground, setColorBackground] = useState('');
    const [dealerColor, setDealerColor] = useState('');
    const [dealerLabel, setDealerLabel] = useState('');
    useEffect(() => {
        if (prop.styles !== undefined) {
            var tmpStyles = new PokerTableStyles;
            if (prop.styles?.color1 !== undefined) {
                tmpStyles.color1 = prop.styles?.color1;
            }
            if (prop.styles?.color2 !== undefined) {
                tmpStyles.color2 = prop.styles?.color2;
            }
            if (prop.styles?.fontsize !== undefined) {
                tmpStyles.fontsize = prop.styles?.fontsize;
            }
            if (prop.styles?.colorBackground !== undefined) {
                tmpStyles.colorBackground = prop.styles?.colorBackground;
            }
            if (prop.styles?.dealerColor !== undefined) {
                tmpStyles.dealerColor = prop.styles?.dealerColor;
            }
            if (prop.styles?.dealerLabel !== undefined) {
                tmpStyles.dealerLabel = prop.styles?.dealerLabel;
            }
            if (prop.styles?.fontColor !== undefined) {
                tmpStyles.fontColor = prop.styles?.fontColor;
            }
            setStyles({ ...tmpStyles });
        } else {
            setStyles(new PokerTableStyles);
        }
    }, [prop.styles]);
    useEffect(() => {
        if (styles?.color1 !== undefined) {
            setColor1(styles?.color1);
        }
        if (styles?.color2 !== undefined) {
            setColor2(styles?.color2);
        }
        if (styles?.fontsize !== undefined) {
            setFontsize(styles?.fontsize);
        }
        if (styles?.colorBackground !== undefined) {
            setColorBackground(styles?.colorBackground);
        }
        if (styles?.dealerColor !== undefined) {
            setDealerColor(styles?.dealerColor);
        }
        if (styles?.dealerLabel !== undefined) {
            setDealerLabel(styles?.dealerLabel);
        }
        if (styles?.fontColor !== undefined) {
            setFontColor(styles?.fontColor);
        }
    }, [styles]);
    useEffect(() => {
        var cl = [dealerColor, color2, color2, color2, color1, color1, color1, color2, color1, color2];
        setColorList([...cl]);
    }, [dealerColor, color1, color2]);

    useEffect(() => {

    }, [pointsActually]);
    function onClickShape(evt: Konva.KonvaEventObject<MouseEvent>): void {
        console.log('PokerTable onClickShape', evt.evt.button);
        console.log('PokerTable onClickShape', evt.target.id());
    }
    function onTouchShape(evt: Konva.KonvaEventObject<TouchEvent>): void {
        console.log('PokerTable onTouchShape', evt.target.id());
    }
    const GetShapes = () => {
        // winWidth, winHeight
        // console.log('UniversalPatternDrawer GetShapes', json);
        if (arcsActually === undefined) {
            return (<></>);
        }
        // console.log('PokerTable GetShapes', arcsActually);
        return (
            <>
                {arcsActually.map((arcs, idx: number = 0) => {
                    const index = idx++;
                    const fs = fontsize;
                    var pX = 0;
                    var pY = 0;
                    for (let i = 0; i < arcs.length; i++) {
                        const element = arcs[i];
                        pX += element[0];
                        pY += element[1];
                    }
                    pX /= arcs.length;
                    pY /= arcs.length;
                    var label = (playNumConverter[index]).toString();
                    if (playNumConverter[index] === -1) {
                        label = dealerLabel;
                    }
                    pX -= fs * label.length / 4;
                    pY -= fs / 4;
                    return (
                        <>
                            <Shape
                                sceneFunc={(context, shape) => {
                                    // const points = point.points;
                                    context.beginPath();
                                    // console.log('PokerTable GetShapes beginPath', arcs[0][0], arcs[0][1]);
                                    context.moveTo(arcs[0][0], arcs[0][1]);
                                    for (let i = 0; i < arcs.length; i++) {
                                        const element = arcs[i];
                                        if (element.length === 3 && isNaN(element[2])) {
                                            // console.log('PokerTable GetShapes lineTo', element[0], element[1]);
                                            context.lineTo(element[0], element[1]);
                                        } else {
                                            // console.log('PokerTable GetShapes arcTo', element[0], element[1], element[2], element[3], element[4], element[5], element[6]);
                                            context.moveTo(element[0], element[1]);
                                            context.arcTo(element[2], element[3], element[4], element[5], element[6]);
                                            // context.moveTo(element[4], element[5]);
                                        }
                                    }
                                    context.closePath();
                                    context.fillStrokeShape(shape);
                                }}
                                key={(playNumConverter[index]).toString()}
                                id={(playNumConverter[index]).toString()}
                                fill={colorList?.at(index)}
                                stroke={colorList?.at(index)}
                                strokeWidth={0.0}
                                onMouseUp={onClickShape}
                                onTouchEnd={onTouchShape}
                            />
                            <Text text={label} fill={fontColor} fontSize={fs} x={pX} y={pY} />
                        </>
                    );
                }
                )}
            </>
        );

    };
    return (
        <div>
            {/* <Canvas points={pointsActually} arcs={arcsActually} width={0.93 * winWidth} height={0.93 * winWidth * 2 / 3} /> */}
            <Stage width={0.93 * winWidth} height={0.93 * winWidth * 2 / 3} >
                <Layer>
                    <Rect width={0.93 * winWidth} height={0.93 * winWidth * 2 / 3} fill={colorBackground} />
                    {GetShapes()}
                </Layer>
            </Stage>
        </div>
    );
}

// class CanvasProps {
//     points?: number[][][];
//     arcs?: number[][][];
//     width?: number;
//     height?: number;
// }

// function Canvas(prop: CanvasProps) {
//     const [points, setPoints] = useState<number[][][]>([]);
//     const [arcs, setArcs] = useState<number[][][]>([]);
//     const [width, setWidth] = useState<number>(0);
//     const [height, setHeight] = useState<number>(0);
//     const [regions, setRegions] = useState<Path2D[]>([]);
//     // const [colorIdx, setColorIdx] = useState<number>(0);
//     var colorIdx = 0;
//     useEffect(() => {
//         if (prop.points != undefined) {
//             setPoints(prop.points);
//         }
//     }, [prop.points]);
//     useEffect(() => {
//         if (prop.arcs != undefined) {
//             setArcs(prop.arcs);
//         }
//     }, [prop.arcs]);
//     useEffect(() => {
//         if (prop.width != undefined) {
//             setWidth(prop.width);
//         }
//     }, [prop.width]);
//     useEffect(() => {
//         if (prop.height != undefined) {
//             setHeight(prop.height);
//         }
//     }, [prop.height]);


//     const [ctx, setCtx] = useState<CanvasRenderingContext2D>();
//     useEffect(() => {
//         setCtx(getContext());
//     }, []);
//     const canvasRef = useRef(null);
//     const getContext = (): CanvasRenderingContext2D => {
//         const canvas: any = canvasRef.current;
//         canvas.removeEventListener('click', OnClicked, false);
//         canvas.addEventListener('click', OnClicked, false);
//         return canvas.getContext('2d');
//     };

//     function OnClicked(event: PointerEvent) {
//         // console.log('Canvas OnClicked', event.pageX, event.pageY,event.offsetX, event.offsetY, event );
//         const x = event.offsetX;
//         const y = event.offsetY;
//         for (let i = 0; i < arcs.length; i++) {
//             const area = arcs[i];
//             var judge = JudgeInside(x, y, area);
//             if (judge) {
//                 // console.log('Canvas OnClicked', i, playNumConverter[i]);
//             } else {
//                 // console.log('Canvas OnClicked', x, y);
//             }
//         }
//         console.log('Canvas OnClicked regions', regions);
//         for (let i = 0; i < regions.length; i++) {
//             const region = regions[i];
//             // console.log('Canvas OnClicked region', region);
//             if (isIn(region, x, y)) {
//                 console.log('Canvas OnClicked region', i, playNumConverter[i]);
//             }
//         }
//     }
//     function isIn(content: Path2D, x: number, y: number) {
//         // const ctx: CanvasRenderingContext2D = getContext();
//         if (ctx === undefined) {
//             return;
//         }
//         // return ctx.isPointInPath(x, y);
//         return ctx.isPointInPath(content, x, y);
//     }

//     // 背景
//     useEffect(() => {
//         // const ctx: CanvasRenderingContext2D = getContext();
//         if (ctx === undefined) {
//             return;
//         }
//         ctx.beginPath();
//         ctx.fillStyle = colorBackground;
//         ctx.fillRect(0, 0, width, width);
//     }, [width]);
//     // useEffect(() => {
//     //     const ctx: CanvasRenderingContext2D = getContext();
//     //     for (let i = 0; i < points.length; i++) {
//     //         let region = new Path2D();
//     //         const elementI = points[i];
//     //         region.moveTo(elementI[0][0], elementI[0][1]);
//     //         // console.log('Canvas moveTo', elementI[0][0], elementI[0][1]);
//     //         for (let j = 1; j < elementI.length; j++) {
//     //             const elementJ = elementI[j];
//     //             // console.log('Canvas lineTo', elementJ[0], elementJ[1]);
//     //             region.lineTo(elementJ[0], elementJ[1]);
//     //         }
//     //         ctx.fillStyle = colorList[colorIdx++ % colorList.length];
//     //         // setColorIdx(colorIdx + 1);
//     //         ctx.fill(region, "nonzero");
//     //     }
//     // }, [points]);
//     useEffect(() => {
//         if (arcs === undefined) {
//             return;
//         }
//         // const ctx: CanvasRenderingContext2D = getContext();
//         if (ctx === undefined) {
//             return;
//         }

//         var rs = []
//         for (let i = 0; i < arcs.length; i++) {
//             let region = new Path2D();
//             const elementI = arcs[i];
//             ctx.beginPath();
//             region.moveTo(elementI[0][0], elementI[0][1]);
//             // console.log('Canvas moveTo', elementI[0][0], elementI[0][1]);
//             // for (let j = 1; j < elementI.length; j++) {
//             for (let j = 0; j < elementI.length; j++) {
//                 const elementJ = elementI[j];
//                 // region.lineTo(elementJ[0], elementJ[1]);
//                 if (isNaN(elementJ[2])) {
//                     // console.log('Canvas lineTo', elementJ[0], elementJ[1]);
//                     // region.moveTo(elementJ[0], elementJ[1]);
//                     // region.lineTo(elementJ2[0], elementJ2[1]);
//                     region.lineTo(elementJ[0], elementJ[1]);
//                 } else {
//                     // region.moveTo(400, 400);
//                     // console.log('Canvas arcTo', 400 + 200 * (2*Math.cos(Math.PI / 4) - 1), 400, (400 + 200 * Math.cos(Math.PI / 4)), (200 + 200 * Math.sin(Math.PI / 4)), 200);
//                     // region.arcTo(400 + 200 * (2*Math.cos(Math.PI / 4) - 1), 400, (400 + 200 * Math.cos(Math.PI / 4)), (200 + 200 * Math.sin(Math.PI / 4)), 200);

//                     region.moveTo(elementJ[0], elementJ[1]);
//                     // console.log('Canvas arcTo', elementJ[0], elementJ[1], elementJ[2], elementJ[3], elementJ[4], elementJ[5], elementJ[6]);
//                     region.arcTo(elementJ[2], elementJ[3], elementJ[4], elementJ[5], elementJ[6]);
//                     // region.moveTo(elementJ[4], elementJ[5]);
//                 }
//             }
//             ctx.fillStyle = colorList[colorIdx++ % colorList.length];
//             // setColorIdx(colorIdx + 1);
//             // region.closePath();
//             ctx.closePath();
//             ctx.stroke(region);
//             ctx.fill(region);
//             rs.push(region);
//             // console.log('Canvas useEffect region', region);
//         }

//         // https://stackoverflow.com/questions/68376049/how-to-apply-ispointinpath-to-multiple-path
//         // let reg = new Path2D();
//         // ctx.beginPath();
//         // reg.lineTo( 78, 10);
//         // reg.lineTo(190, 52);
//         // reg.lineTo(105, 149);
//         // reg.lineTo( 21, 113);
//         // reg.lineTo( 78, 10);
//         // console.log('Canvas', reg);
//         // ctx.closePath();
//         // ctx.stroke(reg);
//         // const p = {x: 84, y: 50};
//         // ctx.isPointInPath(reg, p.x, p.y) && console.log('Canvas Inside Path!');
//         // ctx.fillRect(p.x-4, p.y, 9, 1);
//         // ctx.fillRect(p.x, p.y-4, 1, 9);

//         // console.log('Canvas useEffect rs', rs);
//         // console.log('Canvas useEffect rs', ctx.isPointInPath(rs[0], 300, 350));
//         setRegions([...rs]);
//     }, [arcs]);

//     return (
//         <div>
//             {/* <canvas color={colorBackground} height={height} width={width} className="canvas" ref={canvasRef} /> */}
//         </div>
//     );
// }

function JudgeInside(x: number, y: number, area: number[][]) {
    if (area.length < 3) {
        return false;
    }
    var counter = 0;
    var res = [0, 0, 0, 0];
    var flag = false;
    for (let i = 0; i < area.length; i++) {
        const point = area[i];
        if (point.length != 3) {
            continue;
        }
        if (point[0] < x && point[1] < y) {
            // x,yはともにpoint[0],point[1]より大きい（point[0],point[1]は左上）
            res[0] += 1;
        } else if (point[0] > x && point[1] < y) {
            // point[0],point[1]は右上
            res[1] += 1;
        } else if (point[0] < x && point[1] > y) {
            // point[0],point[1]は左下
            res[2] += 1;
        } else if (point[0] > x && point[1] > y) {
            // point[0],point[1]は右下
            res[3] += 1;
        }
        // 5角形等の場合は2,1,1,1とかになるので不等号
        if (res[0] >= 1 && res[1] >= 1 && res[2] >= 1 && res[3] >= 1) {
            flag = true;
            break;
        }
        // console.log('Canvas OnClicked', point, res);
    }
    // console.log('Canvas OnClicked', res);
    return flag;
    // if (flag) {
    //     return true;
    // }else{
    //     // console.log('Canvas OnClicked', res);
    // }
}
