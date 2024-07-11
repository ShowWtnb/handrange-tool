// import { createStyles, makeStyles } from "@mui/styles";

import { nPr, permutation } from "@/component/utils/utils";
import { GetNUMfromString, GetStringFromNUM, PlayCardCompare, PlayCardDeck, Suit, SuitKeys } from "./const_playCard";
import { Num, PlayCard } from "./const_playCard";
import PlayerStatus from "@/component/player/PlayerStatus";

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
    TIER_9,

    NONE = -1,
}
export const YokosawaHandRangeTierKeys = Object.keys(YokosawaHandRangeTier).filter((v) => isNaN(Number(v)));
export function getTierKeyName(value?: YokosawaHandRangeTier) {
    if (value === undefined) {
        return YokosawaHandRangeTier[YokosawaHandRangeTier.NONE];
    }
    return YokosawaHandRangeTier[value];
}
export enum Actions {
    FOLD = 0,
    CHECK,
    CALL,
    RAISE,
    RE_RAISE,

    NONE = -1,
}
export function getActionsKeyName(value?: Actions) {
    if (value === undefined) {
        return Actions[Actions.NONE];
    }
    return Actions[value];
}
export const ActionsKeys = Object.keys(Actions).filter((v) => isNaN(Number(v)));
export function GetActionStyle(action: Actions) {
    switch (action) {
        case Actions.FOLD:
            return { background: '#696969', foreground: '#E8E8E8' };
        case Actions.CHECK:
            return { background: 'green', foreground: '#E8E8E8' };
        case Actions.CALL:
            return { background: 'green', foreground: '#E8E8E8' };
        case Actions.RAISE:
            return { background: 'blue', foreground: '#E8E8E8' };
        default:
            return { background: '#696969', foreground: '#E8E8E8' };
    }
}

export enum Positions {
    BB = 0,
    SB,
    BTN,
    CO,
    HJ,
    LJ,
    UTG_2,
    UTG_1,
    UTG,

    NONE = -1,
}
export const PositionsKeys = Object.keys(Positions).filter((v) => isNaN(Number(v)));
export function getPositionsKeyName(value?: Positions) {
    if (value === undefined) {
        return Positions[Positions.NONE];
    } else if (value === Positions.UTG_1) {
        return 'UTG+1';
    } else if (value === Positions.UTG_2) {
        return 'UTG+2';
    }
    return Positions[value];
}

export function GetTierFromPosition(position: Positions): YokosawaHandRangeTier {
    // キャッシュのランク
    if (position >= Positions.UTG) {
        // 後ろに8人(Tier1, 2)
        return YokosawaHandRangeTier.TIER_2
    } else if (position >= Positions.UTG_2) {
        // 後ろに6~7人
        return YokosawaHandRangeTier.TIER_3
    } else if (position >= Positions.HJ) {
        // 後ろに4~5人
        return YokosawaHandRangeTier.TIER_4
    } else if (position >= Positions.CO) {
        // 後ろに3人
        return YokosawaHandRangeTier.TIER_5
    } else if (position >= Positions.SB) {
        // 後ろに0~2人
        return YokosawaHandRangeTier.TIER_6
    } else if (position >= Positions.BB) {
        // 後ろに0人
        return YokosawaHandRangeTier.TIER_6
    }
    // TODO TIER_7, 8はBTNのオープンに対してBBのみがCallしてよい、実装の仕方が難しい
    return YokosawaHandRangeTier.TIER_9;
}
export function JudgePreFlopAction(p: PlayerStatus, a: PlayerStatus[]): Actions {
    const position = p._position;
    const tier = p.tier;
    // 前のアクションを参照する必要がある
    // オープナーを探す
    let idx = 0;
    let rank = YokosawaHandRangeTier.NONE;
    for (; idx < a.length; idx++) {
        const element = a[idx];
        if (element.action === undefined) {
            continue;
        }
        if (element.action >= Actions.RAISE) {
            // レイズしたらこの人のポジションを基準にする
            rank = GetTierFromPosition(element.position);
            console.log('JudgePreFlopAction', getPositionsKeyName(element.position), 'open', 'hand tier is', getTierKeyName(element.tier), 'needs', getTierKeyName(rank));
            break;
        }
    }

    // 最後にアクションした人より1Tier高いならCall、2Tier以上高いならレイズ
    idx++;
    for (; idx < a.length; idx++) {
        const element = a[idx];
        if (element.action === undefined) {
            continue;
        }
        console.log('JudgePreFlopAction', getPositionsKeyName(element.position), 'need', getTierKeyName(rank - 1), 'to Call', getTierKeyName(rank - 2), 'to Raise');
        if (element.action >= Actions.RAISE) {
            // レイズしたら最後にアクションしていた人のポジションに+2Tierしたものを基準にする
            console.log('JudgePreFlopAction', getPositionsKeyName(element.position), 're-raise', 'hand tier is', getTierKeyName(element.tier), 'needs', getTierKeyName(rank));
            rank = rank - 2;
        } else if (element.action >= Actions.CALL) {
            // コールしたら最後にアクションしていた人のポジションに+1Tierしたものを基準にする
            console.log('JudgePreFlopAction', getPositionsKeyName(element.position), 'call', 'hand tier is', getTierKeyName(element.tier), 'needs', getTierKeyName(rank));
            rank = rank - 1;
        }
    }
    if (rank === YokosawaHandRangeTier.NONE) {
        // 誰もアクションしていない場合
        rank = GetTierFromPosition(position);
        if (position === Positions.BB) {
            return Actions.CHECK
        } else {
            if (tier <= rank) {
                return Actions.RAISE
            } else {
                return Actions.FOLD
            }
        }
    } else {
        if (position === Positions.BB) {
            // アクションしているのがBTN, SBだけの場合、コールレンジが広くなる
            if (isOnlyBtnActions(a)) {
                if (tier <= YokosawaHandRangeTier.TIER_7) {
                    return Actions.CALL
                }
            }
        }
        if (tier <= rank - 2) {
            return Actions.RAISE
        } else if (tier <= rank - 1) {
            return Actions.CALL
        } else {
            return Actions.FOLD
        }
    }

    return Actions.NONE
}

function isOnlyBtnActions(a: PlayerStatus[]) {
    var cnt = 0;
    var pos = Positions.NONE;
    for (let index = 0; index < a.length; index++) {
        const action = a[index];
        if (action.action === Actions.RAISE || action.action === Actions.CALL) {
            cnt++;
            pos = action.position;
            break;
        }
    }
    if (cnt === 1 && pos <= Positions.BTN) {
        return true;
    }
    return false;
}



export enum PokerHandRanking {
    ROYAL_FLUSH = 0,
    STRAIGHT_FLUSH,
    FOUR_OF_A_KIND,
    FULL_HOUSE,
    FLUSH,
    STRAIGHT,
    THREE_OF_A_KIND,
    TWO_PAIR,
    ONE_PAIR,
    HIGH_CARD,
}
export const PokerHandRankingKeys = Object.keys(PokerHandRanking).filter((v) => isNaN(Number(v)));

export function GetTierStyle(tier: YokosawaHandRangeTier) {
    switch (tier) {
        case YokosawaHandRangeTier.TIER_1:
            return { background: '#191970', foreground: '#E8E8E8' };
        case YokosawaHandRangeTier.TIER_2:
            return { background: '#FF0000', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_3:
            return { background: '#FFD700', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_4:
            return { background: '#228B22', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_5:
            return { background: '#1E90FF', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_6:
            return { background: '#FFFFFF', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_7:
            return { background: '#B3B3B3', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_8:
            return { background: '#D8BFD8', foreground: '#262626' };
        case YokosawaHandRangeTier.TIER_9:
            return { background: '#696969', foreground: '#E8E8E8' };
        default:
            return { background: '#696969', foreground: '#E8E8E8' };
    }
}

export class JudgedHand {
    key: string = '';
    flag?: boolean;
    cards?: PlayCard[];
    isBoard?: boolean[];
    isHand?: boolean[];
}

export function JudgeHand(hand?: PlayCard[], board?: PlayCard[]): JudgedHand | undefined {
    const keys = PokerHandRankingKeys;
    var res;
    if (hand != undefined && board != undefined) {
        // ハンドとボードを合わせて数字順に並べる
        // console.log('JudgeHand', hand, board);
        var cards = [...hand, ...board];
        // console.log('JudgeHand', cards);
        cards.sort((a: PlayCard, b: PlayCard) => {
            if (a.num != undefined && b.num != undefined) {
                // console.log('JudgeHand sort', parseInt(b.num.toString()), parseInt(a.num.toString()));
                return (parseInt(b.num.toString()) - parseInt(a.num.toString()))
            } else {
                // console.log('JudgeHand sort else', a, b);
                return -1;
            }
        });
        // console.log('JudgeHand sort', cards);

        var isYaku = false;
        for (let index = 0; index < keys.length; index++) {
            const key = keys[index];
            switch (index) {
                case PokerHandRanking.ROYAL_FLUSH:
                    res = JudgeFlush(cards);
                    if (res.flag) {
                        if (res.cards) {
                            res = JudgeStraight(res.cards);
                            if (res.flag) {
                                if (res.cards?.at(0)?.num === Num.NUM_ACE) {
                                    // console.log('JudgeHand ROYAL_FLUSH', res);
                                    isYaku = true;
                                }
                            }
                        }
                    }
                    break;
                case PokerHandRanking.STRAIGHT_FLUSH:
                    res = JudgeFlush(cards);
                    if (res.flag) {
                        if (res.cards) {
                            res = JudgeStraight(res.cards);
                            if (res.flag) {
                                // console.log('JudgeHand STRAIGHT_FLUSH', res);
                                isYaku = true;
                            }
                        }
                    }
                    // console.log('JudgeHand', key);
                    break;
                case PokerHandRanking.FOUR_OF_A_KIND:
                    res = JudgeNofKind(cards, 4);
                    if (res.flag) {
                        // console.log('JudgeHand FOUR_OF_A_KIND', res);
                        isYaku = true;
                    }
                    break;
                case PokerHandRanking.FULL_HOUSE:
                    res = JudgeNofKind(cards, 3);
                    if (res.flag) {
                        if (res.cards) {
                            var tmp = res.cards;
                            // スリーカードを除いた部分にペアが含まれるか
                            var remove = cards.filter(function (v) {
                                return !tmp.includes(v);
                            });
                            // console.log('PokerHandRanking.FULL_HOUSE remove', remove);
                            res = JudgeNofKind(remove, 2);
                            // console.log('PokerHandRanking.FULL_HOUSE res', res);
                            if (res.flag && res.cards != undefined) {
                                // console.log('JudgeHand FULL_HOUSE', res);
                                res = { flag: res.flag, cards: [...tmp, ...res.cards] }
                                isYaku = true;
                            }
                        }
                    }
                    break;
                case PokerHandRanking.FLUSH:
                    // console.log('JudgeHand', key);
                    res = JudgeFlush(cards);
                    if (res.flag) {
                        // console.log('JudgeHand FLUSH', res);
                        isYaku = true;
                    }
                    break;
                case PokerHandRanking.STRAIGHT:
                    // console.log('JudgeHand', key);
                    res = JudgeStraight(cards);
                    if (res.flag) {
                        // console.log('JudgeHand STRAIGHT', res);
                        isYaku = true;
                    }
                    break;
                case PokerHandRanking.THREE_OF_A_KIND:
                    res = JudgeNofKind(cards, 3);
                    if (res.flag) {
                        // console.log('JudgeHand THREE_OF_A_KIND', res);
                        // スリーカードを除いたで勝負になる可能性があるので
                        if (res.cards) {
                            var tmp = res.cards;
                            var remove = cards.filter(function (v) {
                                return !tmp.includes(v);
                            });
                            res = { flag: res.flag, cards: [...res.cards, remove[0], remove[1]] }
                        }
                        isYaku = true;
                    }
                    break;
                case PokerHandRanking.TWO_PAIR:
                    res = JudgeNofKind(cards, 2);
                    if (res.flag) {
                        if (res.cards) {
                            var tmp = res.cards;
                            // ペアを除いた部分にペアが含まれるか
                            var remove = cards.filter(function (v) {
                                return !tmp.includes(v);
                            });
                            res = JudgeNofKind(remove, 2);
                            if (res.flag && res.cards != undefined) {
                                // console.log('JudgeHand TWO_PAIR', res);
                                var tmp2 = res.cards;
                                var remove2 = remove.filter(function (v) {
                                    return !tmp2.includes(v);
                                });
                                res = { flag: res.flag, cards: [...tmp, ...res.cards, remove2[0]] }
                                isYaku = true;
                            }
                        }
                    }
                    break;
                case PokerHandRanking.ONE_PAIR:
                    res = JudgeNofKind(cards, 2);
                    if (res.flag) {
                        // console.log('JudgeHand ONE_PAIR', res);
                        // ペアを除いたで勝負になる可能性があるので
                        if (res.cards) {
                            var tmp = res.cards;
                            var remove = cards.filter(function (v) {
                                return !tmp.includes(v);
                            });
                            res = { flag: res.flag, cards: [...res.cards, remove[0], remove[1], remove[2]] }
                        }
                        isYaku = true;
                    }
                    break;
                case PokerHandRanking.HIGH_CARD:
                    res = { flag: true, cards: [cards[0], cards[1], cards[2], cards[3], cards[4]] }
                    isYaku = true;
                    break;

                default:
                    break;
            }
            if (isYaku) {
                res = { ...res, key }
                // console.log('JudgeHand', res);
                var isBoard = GetIsCommunityCards(res.cards, board);
                var isHand = GetIsCommunityCards(res.cards, hand);
                res = { ...res, isBoard, isHand };
                return res;
            }
        };
    }
    return undefined;
}

function JudgeFlush(cards: PlayCard[]): { flag: boolean, cards?: PlayCard[] } {
    var cntSpade = 0;
    var cntDia = 0;
    var cntClove = 0;
    var cntHeart = 0;

    for (let i = 0; i < cards.length; i++) {
        const element = cards[i];
        if (!element) {
            continue;
        }
        switch (element.suit) {
            case Suit.SUIT_SPADES:
                cntSpade++;
                break;
            case Suit.SUIT_DIAMONDS:
                cntDia++;
                break;
            case Suit.SUIT_CLOVERS:
                cntClove++;
                break;
            case Suit.SUIT_HEARTS:
                cntHeart++;
                break;
            default:
                break;
        }
    }
    // console.log('JudgeHand JudgeFlush', cntSpade, cntDia, cntClove, cntHeart);
    var suit;
    if (cntSpade > 4) {
        suit = Suit.SUIT_SPADES;
    }
    else if (cntDia > 4) {
        suit = Suit.SUIT_DIAMONDS;
    }
    else if (cntClove > 4) {
        suit = Suit.SUIT_CLOVERS;
    }
    else if (cntHeart > 4) {
        suit = Suit.SUIT_HEARTS;
    } else {
        // console.log('JudgeHand JudgeFlush', false);
        return { flag: false };
    }
    var cs = [];
    for (let i = 0, j = 0; i < 5; j++) {
        const element = cards[j];
        if (suit === element.suit) {
            // console.log('JudgeHand JudgeFlush', true, suit, element);
            cs.push(element);
            i++;
        }
    }
    return { flag: true, cards: cs };

}

function JudgeStraight(cards: PlayCard[]): { flag: boolean, cards?: PlayCard[] } {
    for (let i = 0; i < cards.length - 4; i++) {
        var current = cards[i];
        var count = 0;
        var res = [current];
        for (let j = i + 1; j < cards.length; j++) {
            const element = cards[j];
            if (!element) {
                continue;
            }
            if (current.num != undefined && element.num != undefined) {
                // console.log('JudgeHand JudgeStraight', count, current, element);
                if ((parseInt(current.num?.toString()) - 1) === parseInt(element.num?.toString())) {
                    current = element;
                    res.push(element);
                    count++;
                }
            }
        }
        if (count >= 4) {
            // console.log('JudgeHand JudgeStraight', { flag: true, cards: res });
            return { flag: true, cards: res };
        }
    }
    // console.log('JudgeHand JudgeStraight', { flag: false }, cards);
    return { flag: false }
}

function JudgeNofKind(cards: PlayCard[], n: number): { flag: boolean, cards?: PlayCard[] } {
    // console.log('JudgeHand JudgeNofKind', cards, n, (cards.length - (n - 1)));
    for (let i = 0; i < (cards.length - (n - 1)); i++) {
        var current = cards[i];
        var count = 0;
        var res = [current];
        for (let j = (i + 1); j < cards.length; j++) {
            const element = cards[j];
            // console.log('JudgeHand JudgeNofKind', count, current, element);
            if (!element) {
                continue;
            }
            if (current.num != undefined && element.num != undefined) {
                if ((parseInt(current.num?.toString())) === parseInt(element.num?.toString())) {
                    current = element;
                    res.push(element);
                    count++;
                }
            }
        }
        if (count >= (n - 1)) {
            // console.log('JudgeHand JudgeNofKind', { flag: true, cards: res });
            return { flag: true, cards: res };
        }
    }
    // console.log('JudgeHand JudgeNofKind', { flag: false }, cards);
    return { flag: false }
}

// // deprecated
// // FATAL TODO 共通のカードと個々のカードを分けないと正しい勝率が出ない（ボードのスリーカードがハンド込みの2ペアに対してスリーカードの勝ちになってしまっている（負け側がボードスリーカードの時は2ペア側はフルハウスになっているはず） T5 vs 34 in 7KTK?で34が勝率6%ぐらいある）
// export function JudgeOdds(
//     player1: JudgedHand[],
//     player2: JudgedHand[],
//     undefinedBoardCount?: number
// ): number[] {
//     var res = [-1, -1];
//     var p1Win = 0;
//     var p2Win = 0;
//     var draw = 0;
//     // console.log('JudgeOdds', player1, player2);
//     if (undefinedBoardCount === undefined) {
//         undefinedBoardCount = 0;
//     }

//     for (let i = 0; i < player1.length; i++) {
//         const p1 = player1[i];
//         var e1 = (PokerHandRanking as any)[p1?.key] as PokerHandRanking;
//         var cards1 = p1.cards;
//         for (let j = 0; j < player2.length; j++) {
//             const p2 = player2[j];
//             var e2 = (PokerHandRanking as any)[p2?.key] as PokerHandRanking;
//             var cards2 = p2.cards;
//             var comCards = GetCommunityCards(cards1, cards2);
//             // console.log('JudgeOdds', comCards.length, undefinedBoardCount, comCards);
//             if (e1 && e2) {
//                 if (e1 < e2) {
//                     // PokerHandRankingは小さい方が強い
//                     // console.log('JudgeOdds p1Win');
//                     p1Win++;
//                 } else if (e1 > e2) {
//                     // PokerHandRankingは小さい方が強い
//                     // console.log('JudgeOdds p2Win');
//                     p2Win++;
//                 } else if (e1 === e2) {
//                     // 同じ場合は詳細な判定が必要
//                     switch (JudgeWin(p1, p2)) {
//                         case 1:
//                             // console.log('JudgeOdds p1Win');
//                             p1Win++;
//                             break;
//                         case 2:
//                             // console.log('JudgeOdds p2Win');
//                             p2Win++;
//                             break;
//                         case 0:
//                             // console.log('JudgeOdds draw');
//                             draw++;
//                             break;
//                         default:
//                             console.log('JudgeWin ERROR');
//                             break;
//                     }
//                 } else {
//                     console.log('JudgeWin ERROR');
//                 }
//             }
//         }
//     }

//     var sum = p1Win + p2Win + draw;
//     var win1 = p1Win / (sum) * 100.0;
//     var win2 = p2Win / (sum) * 100.0;
//     // console.log('JudgeOdds', p1Win, p2Win, draw)
//     res = [win1, win2];
//     return res;
// }
export function JudgeOdds(
    player1?: PlayCard[],
    player2?: PlayCard[],
    board?: PlayCard[],
    deck?: PlayCard[],
): number[] {
    var res = [0, 0, 0];
    if (player1 != undefined && player2 != undefined && board != undefined && deck != undefined) {
        var undefCount = 0;
        for (let i = 0; i < player1.length; i++) {
            const boardC = player1[i];
            if (boardC === undefined) {
                undefCount++;
            }
        }
        for (let i = 0; i < player2.length; i++) {
            const boardC = player2[i];
            if (boardC === undefined) {
                undefCount++;
            }
        }
        for (let i = 0; i < board.length; i++) {
            const boardC = board[i];
            if (boardC === undefined) {
                undefCount++;
            }
        }
        //  BoardがundefでHandがレンジの場合の動作
        if (undefCount > 0) {
            const denominator = nPr(deck.length, undefCount);
            var p1Win = 0;
            var p2Win = 0;
            var draw = 0;
            let arr = permutation(deck, undefCount);
            // console.log('JudgeOdds', deck.length, denominator, undefCount);
            for (let i = 0; i < arr.length; i++) {
                const candidates = arr[i];
                var count = 0;
                var c1 = [];
                for (let j = 0; j < player1.length; j++) {
                    const element = player1[j];
                    if (element === undefined) {
                        c1.push(candidates[count++]);
                    } else {
                        c1.push(element);
                    }
                }
                var c2 = [];
                for (let j = 0; j < player2.length; j++) {
                    const element = player2[j];
                    if (element === undefined) {
                        c2.push(candidates[count++]);
                    } else {
                        c2.push(element);
                    }
                }
                var b = [];
                for (let j = 0; j < board.length; j++) {
                    const element = board[j];
                    if (element === undefined) {
                        b.push(candidates[count++]);
                    } else {
                        b.push(element);
                    }
                }
                // console.log('JudgeOdds', c1, c2, b);
                const judge1 = JudgeHand(c1, b);
                const judge2 = JudgeHand(c2, b);
                // console.log('JudgeOdds', judge1?.key, judge2?.key);
                if (judge1?.flag && judge2?.flag) {
                    const judge = JudgeWin(judge1, judge2);
                    // console.log('JudgeOdds judge', judge);
                    switch (judge) {
                        case 1:
                            // console.log('JudgeOdds p1Win');
                            p1Win++;
                            break;
                        case 2:
                            // console.log('JudgeOdds p2Win');
                            p2Win++;
                            break;
                        case 0:
                            // console.log('JudgeOdds draw');
                            draw++;
                            break;
                        default:
                            // console.log('JudgeOdds ERROR', judge);
                            break;
                    }
                } else {
                    // console.log('JudgeOdds ERROR', judge1, judge2);
                }
            }
            return [p1Win / denominator * 100.0, p2Win / denominator * 100.0, draw / denominator * 100.0];
        } else {
            // 未定がない場合は現状の勝ち負けをそのまま出力する
            const judge1 = JudgeHand(player1, board);
            const judge2 = JudgeHand(player2, board);
            if (judge1?.flag && judge2?.flag) {
                const judge = JudgeWin(judge1, judge2);
                // console.log('JudgeOdds judge', judge);
                switch (judge) {
                    case 1:
                        // console.log('JudgeOdds p1Win');
                        res = [100, 0, 0];
                        break;
                    case 2:
                        // console.log('JudgeOdds p2Win');
                        res = [0, 100, 0];
                        break;
                    case 0:
                        // console.log('JudgeOdds draw');
                        res = [0, 0, 100];
                        break;
                    default:
                        // console.log('JudgeOdds ERROR', judge);
                        break;
                }
                return res;
            }
        }
    }
    return res;
}
export function JudgeOddsCombination(
    comb1?: PlayCard[][],
    comb2?: PlayCard[][],
    board?: PlayCard[],
    deck?: PlayCardDeck,
): number[] {
    if (deck === undefined || comb1 === undefined || comb2 === undefined || board === undefined) {
        return [];
    }

    var result = [0, 0, 0];
    var cnt = 0;
    for (let i = 0; i < comb1.length; i++) {
        const element1 = comb1[i];
        for (let j = 0; j < comb2.length; j++) {
            const element2 = comb2[j];
            var res = JudgeOdds(element1, element2, board, deck.deck);
            // if(res[1] === 100){
            //     console.log('OddsCalculatorHome res', element2[0].num, element2[1].num);
            // }
            result[0] += res[0];
            result[1] += res[1];
            result[2] += res[2];
            cnt++;
        }
    }
    result[0] /= cnt;
    result[1] /= cnt;
    result[2] /= cnt;
    console.log('OddsCalculatorHome result', result);

    return result;
}
export function JudgeOddsRange(
    range1?: Map<string, boolean>,
    range2?: Map<string, boolean>,
    player1?: PlayCard[],
    player2?: PlayCard[],
    board?: PlayCard[],
    enables?: PlayCard[],
): { comb1: PlayCard[][], comb2: PlayCard[][], result: number[] } | undefined {
    if (enables === undefined || player1 === undefined || player2 === undefined || board === undefined) {
        return undefined;
    }

    // var enables = deck.get_enables();
    var comb1;
    var comb2;
    if (range1 != undefined && enables != undefined) {
        comb1 = GetCombination(range1, enables);
    } else {
        comb1 = [player1]
    }
    if (range2 != undefined && enables != undefined) {
        comb2 = GetCombination(range2, enables);
        // console.log('OddsCalculatorHome comb2', comb2);
    } else {
        comb2 = [player2]
    }
    // console.log('JudgeOddsRange', comb1, comb2, enables);
    var result = [0, 0, 0];
    var cnt = 0;
    for (let i = 0; i < comb1.length; i++) {
        const element1 = comb1[i];
        for (let j = 0; j < comb2.length; j++) {
            const element2 = comb2[j];
            var res = JudgeOdds(element1, element2, board, enables);
            // if(res[1] === 100){
            //     console.log('OddsCalculatorHome res', element2[0].num, element2[1].num);
            // }
            result[0] += res[0];
            result[1] += res[1];
            result[2] += res[2];
            cnt++;
        }
    }
    result[0] /= cnt;
    result[1] /= cnt;
    result[2] /= cnt;
    // console.log('OddsCalculatorHome result', result);

    return { comb1: comb1, comb2: comb2, result: result };
}

function JudgeWin(
    player1: JudgedHand,
    player2: JudgedHand
) {
    var e1 = (PokerHandRanking as any)[player1?.key] as PokerHandRanking;
    var e2 = (PokerHandRanking as any)[player2?.key] as PokerHandRanking;
    if (e1 != undefined && e2 != undefined) {
        if (e1 < e2) {
            // PokerHandRankingは小さい方が強い
            return 1;
        } else if (e1 > e2) {
            // PokerHandRankingは小さい方が強い
            return 2;
        } else if (e1 === e2) {
            // 同じ場合は詳細な判定が必要
            switch (e1) {
                case PokerHandRanking.ROYAL_FLUSH:
                    // ROYAL_FLUSH同士はチョップ
                    return 0;

                case PokerHandRanking.STRAIGHT_FLUSH:
                    // STRAIGHT_FLUSH同士は数字が強い方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        }
                    }
                    // 同じならチョップ
                    return 0;
                case PokerHandRanking.FOUR_OF_A_KIND:
                    // FOUR_OF_A_KIND同士は数字がでかい方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        }
                    }
                    // チョップにはならない
                    break;
                case PokerHandRanking.FULL_HOUSE:
                    // FULL_HOUSE同士はスリーカードの数字がでかい方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        } else {
                            // 同じならペアが強い方が勝ち
                            n1 = player1?.cards?.at(3)?.num;
                            n2 = player2?.cards?.at(3)?.num;
                            if (n1 != undefined && n2 != undefined) {
                                if (n1 < n2) {
                                    // numは数字がでかい方が強い
                                    return 2;
                                } else if (n2 < n1) {
                                    // numは数字がでかい方が強い
                                    return 1;
                                } else {
                                    // 全く同じならチョップ
                                    return 0;
                                }
                            }
                        }
                    }
                    break;
                case PokerHandRanking.FLUSH:
                    // FLUSH同士は数字がでかい方が勝ち
                    for (let i = 0; i < 5; i++) {
                        var n1 = player1?.cards?.at(i)?.num;
                        var n2 = player2?.cards?.at(i)?.num;
                        if (n1 != undefined && n2 != undefined) {
                            if (n1 < n2) {
                                // numは数字がでかい方が強い
                                return 2;
                            } else if (n2 < n1) {
                                // numは数字がでかい方が強い
                                return 1;
                            }
                            // 同じ場合は次の数字へ
                        }
                    }
                    // チョップにはならない
                    break;
                case PokerHandRanking.STRAIGHT:
                    // STRAIGHT同士は数字が強い方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        }
                    }
                    // 同じならチョップ
                    return 0;
                case PokerHandRanking.THREE_OF_A_KIND:
                    // THREE_OF_A_KIND同士は数字が強い方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        } else {
                            // 同じなら残りのハイカード勝負
                            for (let i = 3; i < 5; i++) {
                                var n1 = player1?.cards?.at(i)?.num;
                                var n2 = player2?.cards?.at(i)?.num;
                                if (n1 != undefined && n2 != undefined) {
                                    if (n1 < n2) {
                                        // numは数字がでかい方が強い
                                        return 2;
                                    } else if (n2 < n1) {
                                        // numは数字がでかい方が強い
                                        return 1;
                                    }
                                    // 同じ場合は次の数字へ
                                }
                            }
                        }
                    }
                    // ハイカードまで同じならチョップ
                    return 0;
                case PokerHandRanking.TWO_PAIR:
                    // TWO_PAIR同士はデカいペアの数字がでかい方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        } else {
                            // 同じなら低いペアが強い方が勝ち
                            n1 = player1?.cards?.at(2)?.num;
                            n2 = player2?.cards?.at(2)?.num;
                            if (n1 != undefined && n2 != undefined) {
                                if (n1 < n2) {
                                    // numは数字がでかい方が強い
                                    return 2;
                                } else if (n2 < n1) {
                                    // numは数字がでかい方が強い
                                    return 1;
                                } else {
                                    // 同じならハイカード勝負
                                    n1 = player1?.cards?.at(4)?.num;
                                    n2 = player2?.cards?.at(4)?.num;
                                    // console.log('JudgeWin PokerHandRanking.TWO_PAIR', n1, n2);
                                    if (n1 != undefined && n2 != undefined) {
                                        if (n1 < n2) {
                                            // numは数字がでかい方が強い
                                            return 2;
                                        } else if (n2 < n1) {
                                            // numは数字がでかい方が強い
                                            return 1;
                                        } else {
                                            // 全く同じならチョップ
                                            return 0;
                                        }
                                    }

                                }
                            }
                        }
                    }
                    break;
                case PokerHandRanking.ONE_PAIR:
                    // ONE_PAIR同士はペアがでかい方が勝ち
                    var n1 = player1?.cards?.at(0)?.num;
                    var n2 = player2?.cards?.at(0)?.num;
                    if (n1 != undefined && n2 != undefined) {
                        if (n1 < n2) {
                            // numは数字がでかい方が強い
                            return 2;
                        } else if (n2 < n1) {
                            // numは数字がでかい方が強い
                            return 1;
                        } else {
                            // 同じなら残りのハイカード勝負
                            for (let i = 2; i < 5; i++) {
                                var n1 = player1?.cards?.at(i)?.num;
                                var n2 = player2?.cards?.at(i)?.num;
                                if (n1 != undefined && n2 != undefined) {
                                    if (n1 < n2) {
                                        // numは数字がでかい方が強い
                                        return 2;
                                    } else if (n2 < n1) {
                                        // numは数字がでかい方が強い
                                        return 1;
                                    }
                                    // 同じ場合は次の数字へ
                                }
                            }
                        }
                    }
                    // ハイカードまで同じならチョップ
                    return 0;
                case PokerHandRanking.HIGH_CARD:
                    // HIGH_CARD同士はハイカード勝負
                    for (let i = 0; i < 5; i++) {
                        var n1 = player1?.cards?.at(i)?.num;
                        var n2 = player2?.cards?.at(i)?.num;
                        if (n1 != undefined && n2 != undefined) {
                            if (n1 < n2) {
                                // numは数字がでかい方が強い
                                return 2;
                            } else if (n2 < n1) {
                                // numは数字がでかい方が強い
                                return 1;
                            }
                            // 同じ場合は次の数字へ
                        }
                    }
                    return 0;
                default:
                    break;
            }

        }
    }
    return -1;
}

export function GetCombination(range: Map<string, boolean>, enables: PlayCard[]) {
    // console.log('GetCombination', range, enables);
    var res: PlayCard[][] = [];
    try {
        range.forEach((value, key, map) => {
            if (value) {
                var keys = key.split('');
                var n1 = GetNUMfromString(keys[0]);
                var n2 = GetNUMfromString(keys[1]);
                var isSuited = false;
                if (keys.length === 3) {
                    if (keys[2] === 's') {
                        isSuited = true;
                    }
                }
                // console.log('GetCombination', keys, n1, n2, isSuited);
                if (isSuited) {
                    for (let i = 0; i < SuitKeys.length; i++) {
                        const element: any = SuitKeys[i];
                        const strA: keyof typeof Suit = element;
                        const suit = Suit[strA];
                        const c1 = new PlayCard(suit, n1, true);
                        const c2 = new PlayCard(suit, n2, true);
                        // console.log('GetCombination', c1, c2, enables.includes(c1), enables.includes(c2));
                        // const resCom = PlayCardCompare(enables, c1);
                        // console.log('GetCombination resCom', resCom);
                        if (PlayCardCompare(enables, c1) && PlayCardCompare(enables, c2)) {
                            res.push([c1, c2]);
                        }
                    }
                } else {
                    for (let i = 0; i < SuitKeys.length; i++) {
                        const element: any = SuitKeys[i];
                        const str1: keyof typeof Suit = element;
                        const suit1 = Suit[str1];
                        const c1 = new PlayCard(suit1, n1, true);
                        for (let j = 0; j < SuitKeys.length; j++) {
                            const element2: any = SuitKeys[j];
                            const str2: keyof typeof Suit = element2;
                            const suit2 = Suit[str2];
                            const c2 = new PlayCard(suit2, n2, true);
                            // console.log('GetCombination', c1, c2, enables.includes(c1), enables.includes(c2));
                            if (PlayCardCompare(enables, c1) && PlayCardCompare(enables, c2) && (suit1 != suit2)) {
                                res.push([c1, c2]);
                            }
                        }
                    }
                }
            }
        });
    } catch (error) {
        // console.log('GetCombination', range, error);
    }
    return res;
}

export function GetTierFromString(str: string): YokosawaHandRangeTier | undefined {
    for (let i = 0; i < PorkerHands.length; i++) {
        const elementI = PorkerHands[i];
        for (let j = 0; j < elementI.length; j++) {
            const elementJ = elementI[j];
            if (str === elementJ.HandStr) {
                return elementJ.YokosawaTier;
            }
        }
    }

    return undefined;
}
export function GetTierFromHand(hand: PlayCard[]): YokosawaHandRangeTier | undefined {
    const str = GetHandStrFromHand(hand);
    for (let i = 0; i < PorkerHands.length; i++) {
        const elementI = PorkerHands[i];
        for (let j = 0; j < elementI.length; j++) {
            const elementJ = elementI[j];
            if (str === elementJ.HandStr) {
                return elementJ.YokosawaTier;
            }
        }
    }

    return undefined;
}
export function GetHandStrFromHand(hand: PlayCard[]): string | undefined {
    if (hand.length !== 2) {
        return undefined;
    }
    if (hand[0].num === undefined || hand[1].num === undefined) {
        return undefined;
    }
    var str = ''
    // ポケットペア
    if (hand[0].num === hand[1].num) {
        str = GetStringFromNUM(hand[0].num) + GetStringFromNUM(hand[1].num);
    } else {
        // スーテッド
        if (hand[0].suit === hand[1].suit) {
            if (hand[0].num > hand[1].num) {
                str = GetStringFromNUM(hand[0].num) + GetStringFromNUM(hand[1].num) + 's';
            } else {
                str = GetStringFromNUM(hand[1].num) + GetStringFromNUM(hand[0].num) + 's';
            }
        }
        // オフ
        else {
            if (hand[0].num > hand[1].num) {
                str = GetStringFromNUM(hand[0].num) + GetStringFromNUM(hand[1].num) + 'o';
            } else {
                str = GetStringFromNUM(hand[1].num) + GetStringFromNUM(hand[0].num) + 'o';
            }
        }
    }

    return str;
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
        new PorkerHand(4, YokosawaHandRangeTier.TIER_9, "T2s"),
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
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "94s"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "93s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "92s"),
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
        new PorkerHand(5, YokosawaHandRangeTier.TIER_9, "84s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "83s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "82s"),
    ],
    [
        new PorkerHand(22, YokosawaHandRangeTier.TIER_6, "A7o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "K7o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "Q7o"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_9, "J7o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_9, "T7o"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_8, "97o"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_8, "87o"),
        new PorkerHand(58, YokosawaHandRangeTier.TIER_3, "77"),
        new PorkerHand(15, YokosawaHandRangeTier.TIER_6, "76s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "75s"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "74s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "73s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "72s"),
    ],
    [
        new PorkerHand(18, YokosawaHandRangeTier.TIER_7, "A6o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "K6o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_9, "Q6o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_9, "J6o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "T6o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "96o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_9, "86o"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_9, "76o"),
        new PorkerHand(51, YokosawaHandRangeTier.TIER_4, "66"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_6, "65s"),
        new PorkerHand(10, YokosawaHandRangeTier.TIER_7, "64s"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_8, "63s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "62s"),
    ],
    [
        new PorkerHand(21, YokosawaHandRangeTier.TIER_8, "A5o"),
        new PorkerHand(9, YokosawaHandRangeTier.TIER_8, "K5o"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_9, "Q5o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_9, "J5o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "T5o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "95o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "85o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "75o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "65o"),
        new PorkerHand(44, YokosawaHandRangeTier.TIER_4, "55"),
        new PorkerHand(11, YokosawaHandRangeTier.TIER_7, "54s"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_8, "53s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "52s"),
    ],
    [
        new PorkerHand(18, YokosawaHandRangeTier.TIER_8, "A4o"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_9, "K4o"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_9, "Q4o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "J4o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "T4o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "94o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "84o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "74o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "64o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "54o"),
        new PorkerHand(39, YokosawaHandRangeTier.TIER_5, "44"),
        new PorkerHand(6, YokosawaHandRangeTier.TIER_8, "43s"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "42s"),
    ],
    [
        new PorkerHand(16, YokosawaHandRangeTier.TIER_8, "A3o"),
        new PorkerHand(8, YokosawaHandRangeTier.TIER_9, "K3o"),
        new PorkerHand(5, YokosawaHandRangeTier.TIER_9, "Q3o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "J3o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "T3o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "93o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "83o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "73o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "63o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "53o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "43o"),
        new PorkerHand(33, YokosawaHandRangeTier.TIER_5, "33"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "32s"),
    ],
    [
        new PorkerHand(15, YokosawaHandRangeTier.TIER_8, "A2o"),
        new PorkerHand(7, YokosawaHandRangeTier.TIER_9, "K2o"),
        new PorkerHand(4, YokosawaHandRangeTier.TIER_9, "Q2o"),
        new PorkerHand(3, YokosawaHandRangeTier.TIER_9, "J2o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "T2o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "92o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "82o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "72o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "62o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "52o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "42o"),
        new PorkerHand(-1, YokosawaHandRangeTier.TIER_9, "32o"),
        new PorkerHand(28, YokosawaHandRangeTier.TIER_5, "22"),
    ],
]

// 2枚のカードリストから共通のカードを抽出する
function GetCommunityCards(cards1: PlayCard[] | undefined, cards2: PlayCard[] | undefined) {
    var res = [];
    if (cards1 != undefined && cards2 != undefined) {
        for (let i = 0; i < cards1.length; i++) {
            const c1 = cards1[i];
            for (let j = 0; j < cards2.length; j++) {
                const c2 = cards2[j];
                if (c1.num === c2.num && c1.suit === c2.suit) {
                    res.push(c2);
                }
            }
        }
    }
    return res;
}
// cards1にcards2が含まれるかどうか判定する
function GetIsCommunityCards(cards1: PlayCard[] | undefined, cards2: PlayCard[] | undefined) {
    var res = [];
    if (cards1 != undefined && cards2 != undefined) {
        for (let i = 0; i < cards1.length; i++) {
            const c1 = cards1[i];
            var flag = false;
            if (c1 === undefined) {
                res.push(false);
                continue;
            }
            for (let j = 0; j < cards2.length; j++) {
                const c2 = cards2[j];
                if (c2 === undefined) {
                    continue;
                }
                if (c1.num === c2.num && c1.suit === c2.suit) {
                    res.push(true);
                    flag = true;
                    break;
                }
            }
            if (!flag) {
                res.push(false);
            }
        }
    }
    return res;
}


