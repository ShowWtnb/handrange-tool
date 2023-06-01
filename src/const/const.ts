// import { createStyles, makeStyles } from "@mui/styles";

class PorkerHand {
    PowerNumber: number;
    YokosawaTier: YokosawaHandRangeTier;
    HandStr: string;

    constructor(PowerNumber: number, YokosawaTier: YokosawaHandRangeTier, HandStr: string) {
        this.PowerNumber = PowerNumber;
        this.YokosawaTier = YokosawaTier;
        this.HandStr = HandStr;
    }
}
export enum YokosawaHandRangeTier {
    TIER_1 = 0,
    TIER_2,
    TIER_3,
    TIER_4,
    TIER_5,
    TIER_6,
    TIER_7,
    TIER_8,
}
export enum Actions {
    CALL = 0,
    RERAISE,
}

export const PorkerHands: PorkerHand[][] = [
    [
        new PorkerHand(99, YokosawaHandRangeTier.TIER_1, "AA"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_1, "AKs"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "AQs"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "AJs"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "ATs"),
        new PorkerHand(50, YokosawaHandRangeTier.TIER_4, "A9s"),
        new PorkerHand(37, YokosawaHandRangeTier.TIER_4, "A8s"),
        new PorkerHand(32, YokosawaHandRangeTier.TIER_4, "A7s"),
        new PorkerHand(28, YokosawaHandRangeTier.TIER_4, "A6s"),
        new PorkerHand(31, YokosawaHandRangeTier.TIER_4, "A5s"),
        new PorkerHand(27, YokosawaHandRangeTier.TIER_4, "A4s"),
        new PorkerHand(26, YokosawaHandRangeTier.TIER_4, "A3s"),
        new PorkerHand(24, YokosawaHandRangeTier.TIER_4, "A2s"),
    ],
    [
        new PorkerHand(99, YokosawaHandRangeTier.TIER_1, "AKo"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_1, "KK"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "KQs"),
        new PorkerHand(75, YokosawaHandRangeTier.TIER_3, "KJs"),
        new PorkerHand(66, YokosawaHandRangeTier.TIER_4, "KTs"),
        new PorkerHand(44, YokosawaHandRangeTier.TIER_4, "K9s"),
        new PorkerHand(17, YokosawaHandRangeTier.TIER_5, "K8s"),
        new PorkerHand(15, YokosawaHandRangeTier.TIER_5, "K7s"),
        new PorkerHand(14, YokosawaHandRangeTier.TIER_5, "K6s"),
        new PorkerHand(13, YokosawaHandRangeTier.TIER_5, "K5s"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_5, "K4s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_5, "K3s"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_5, "K2s"),
    ],
    [
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "AQo"),
        new PorkerHand(48, YokosawaHandRangeTier.TIER_3, "KQo"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_1, "QQ"),
        new PorkerHand(75, YokosawaHandRangeTier.TIER_3, "QJs"),
        new PorkerHand(58, YokosawaHandRangeTier.TIER_4, "QTs"),
        new PorkerHand(38, YokosawaHandRangeTier.TIER_5, "Q9s"),
        new PorkerHand(16, YokosawaHandRangeTier.TIER_6, "Q8s"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_6, "Q7s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_6, "Q6s"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_7, "Q5s"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_7, "Q4s"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_7, "Q3s"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_7, "Q2s"),
    ],
    [
        new PorkerHand(50, YokosawaHandRangeTier.TIER_3, "AJo"),
        new PorkerHand(31, YokosawaHandRangeTier.TIER_4, "KJo"),
        new PorkerHand(26, YokosawaHandRangeTier.TIER_5, "QJo"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "JJ"),
        new PorkerHand(58, YokosawaHandRangeTier.TIER_3, "JTs"),
        new PorkerHand(39, YokosawaHandRangeTier.TIER_5, "J9s"),
        new PorkerHand(21, YokosawaHandRangeTier.TIER_6, "J8s"),
        new PorkerHand(12, YokosawaHandRangeTier.TIER_6, "J7s"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_7, "J6s"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "J5s"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "J4s"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "J3s"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_8, "J2s"),
    ],
    [
        new PorkerHand(36, YokosawaHandRangeTier.TIER_4, "ATo"),
        new PorkerHand(19, YokosawaHandRangeTier.TIER_5, "KTo"),
        new PorkerHand(17, YokosawaHandRangeTier.TIER_6, "QTo"),
        new PorkerHand(22, YokosawaHandRangeTier.TIER_5, "JTo"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "TT"),
        new PorkerHand(26, YokosawaHandRangeTier.TIER_4, "T9s"),
        new PorkerHand(15, YokosawaHandRangeTier.TIER_5, "T8s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "T7s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_8, "T6s"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "T5s"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "T4s"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_8, "T3s"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "T2s"),
    ],
    [
        new PorkerHand(27, YokosawaHandRangeTier.TIER_5, "A9o"),
        new PorkerHand(12, YokosawaHandRangeTier.TIER_6, "K9o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_6, "Q9o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_6, "J9o"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_6, "T9o"),
        new PorkerHand(99, YokosawaHandRangeTier.TIER_2, "99"),
        new PorkerHand(31, YokosawaHandRangeTier.TIER_5, "98s"),
        new PorkerHand(17, YokosawaHandRangeTier.TIER_6, "97s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "96s"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "95s"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "94s"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "93s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "92s"),
    ],
    [
        new PorkerHand(24, YokosawaHandRangeTier.TIER_6, "A8o"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_8, "K8o"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_8, "Q8o"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_8, "J8o"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_8, "T8o"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "98o"),
        new PorkerHand(66, YokosawaHandRangeTier.TIER_3, "88"),
        new PorkerHand(19, YokosawaHandRangeTier.TIER_6, "87s"),
        new PorkerHand(15, YokosawaHandRangeTier.TIER_7, "86s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_8, "85s"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_8, "84s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "83s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "82s"),
    ],
    [
        new PorkerHand(22, YokosawaHandRangeTier.TIER_6, "A7o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "K7o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "Q7o"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_8, "J7o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "T7o"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "97o"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_8, "87o"),
        new PorkerHand(58, YokosawaHandRangeTier.TIER_3, "77"),
        new PorkerHand(15, YokosawaHandRangeTier.TIER_6, "76s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "75s"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "74s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "73s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "72s"),
    ],
    [
        new PorkerHand(18, YokosawaHandRangeTier.TIER_7, "A6o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "K6o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "Q6o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "J6o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "T6o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "96o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "86o"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "76o"),
        new PorkerHand(51, YokosawaHandRangeTier.TIER_4, "66"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_6, "65s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "64s"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "63s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "62s"),
    ],
    [
        new PorkerHand(21, YokosawaHandRangeTier.TIER_8, "A5o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "K5o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "Q5o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "J5o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "T5o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "95o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "85o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "75o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "65o"),
        new PorkerHand(44, YokosawaHandRangeTier.TIER_4, "55"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_7, "54s"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_8, "53s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "52s"),
    ],
    [
        new PorkerHand(18, YokosawaHandRangeTier.TIER_8, "A4o"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_8, "K4o"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_8, "Q4o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "J4o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "T4o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "94o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "84o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "74o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "64o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "54o"),
        new PorkerHand(39, YokosawaHandRangeTier.TIER_5, "44"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "43s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "42s"),
    ],
    [
        new PorkerHand(16, YokosawaHandRangeTier.TIER_8, "A3o"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_8, "K3o"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_8, "Q3o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "J3o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "T3o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "93o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "83o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "73o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "63o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "53o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "43o"),
        new PorkerHand(33, YokosawaHandRangeTier.TIER_5, "33"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "32s"),
    ],
    [
        new PorkerHand(15, YokosawaHandRangeTier.TIER_8, "A2o"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "K2o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "Q2o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_8, "J2o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "T2o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "92o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "82o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "72o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "62o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "52o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "42o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_8, "32o"),
        new PorkerHand(28, YokosawaHandRangeTier.TIER_5, "22"),
    ],
]

// // スタイルを定義
// export const handCellStyles = makeStyles(() =>
//     createStyles({
//         tier1Cell: {
//             backgroundColor: '#191970'
//         },
//         tier2Cell: {
//             backgroundColor: '#FF0000'
//         },
//         tier3Cell: {
//             color: '#000000',
//             backgroundColor: '#FFD700'
//         },
//         tier4Cell: {
//             backgroundColor: '#228B22'
//         },
//         tier5Cell: {
//             color: '#000000',
//             backgroundColor: '#1E90FF'
//         },
//         tier6Cell: {
//             color: '#000000',
//             backgroundColor: '#FFFFFF'
//         },
//         tier7Cell: {
//             color: '#000000',
//             backgroundColor: '#D8BFD8'
//         },
//         tier8Cell: {
//             color: '#000000',
//             backgroundColor: '#696969'
//         },
//     }),
// );

// // スタイルを定義
// const handCellStyles = makeStyles(() =>
//     createStyles({
//         tier1Cell: {
//             backgroundColor: '#191970'
//         },
//         tier2Cell: {
//             backgroundColor: '#FF0000'
//         },
//         tier3Cell: {
//             backgroundColor: '#FFD700'
//         },
//         tier4Cell: {
//             backgroundColor: '#228B22'
//         },
//         tier5Cell: {
//             backgroundColor: '#1E90FF'
//         },
//         tier6Cell: {
//             backgroundColor: '#FFFFFF'
//         },
//         tier7Cell: {
//             backgroundColor: '#D8BFD8'
//         },
//         tier8Cell: {
//             backgroundColor: '#696969'
//         },
//     }),
// );

// export function GetCellStyle(tier: YokosawaHandRangeTier) {
//     const styles = handCellStyles();
//     switch (tier) {
//         case YokosawaHandRangeTier.TIER_1:
//             return styles.tier1Cell;
//         case YokosawaHandRangeTier.TIER_2:
//             return styles.tier2Cell;
//         case YokosawaHandRangeTier.TIER_3:
//             return styles.tier3Cell;
//         case YokosawaHandRangeTier.TIER_4:
//             return styles.tier4Cell;
//         case YokosawaHandRangeTier.TIER_5:
//             return styles.tier5Cell;
//         case YokosawaHandRangeTier.TIER_6:
//             return styles.tier6Cell;
//         case YokosawaHandRangeTier.TIER_7:
//             return styles.tier7Cell;
//         case YokosawaHandRangeTier.TIER_8:
//             return styles.tier8Cell;
//         default:
//             break;
//     }
//     return styles.tier8Cell;
// }

// export function GetColor(tier: YokosawaHandRangeTier) {
//     switch (tier) {
//         case YokosawaHandRangeTier.TIER_1:
//             return Colors.MidnightBlue;
//         case YokosawaHandRangeTier.TIER_2:
//             return Colors.Red;
//         case YokosawaHandRangeTier.TIER_3:
//             return Colors.Gold;
//         case YokosawaHandRangeTier.TIER_4:
//             return Colors.ForestGreen;
//         case YokosawaHandRangeTier.TIER_5:
//             return Colors.DodgerBlue;
//         case YokosawaHandRangeTier.TIER_6:
//             return Colors.White;
//         case YokosawaHandRangeTier.TIER_7:
//             return Colors.Thistle;
//         case YokosawaHandRangeTier.TIER_8:
//             return Colors.DimGray;
//         default:
//             break;
//     }
//     return Colors.Transparent;
// }
