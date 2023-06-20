// import { createStyles, makeStyles } from "@mui/styles";

import { Suit } from "./const_playCard";
import { Num, PlayCard } from "./const_playCard";

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
export function JudgeHand(hand?: PlayCard[], board?: PlayCard[]): {
    key: string;
    flag?: boolean | undefined;
    cards?: PlayCard[] | undefined;
} | undefined {
    const keys = Object.keys(PokerHandRanking).filter((v) => isNaN(Number(v)));
    var res;
    if (hand && board) {
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
                            res = JudgeNofKind(remove, 2);
                            if (res.flag && res.cards) {
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
                            if (res.flag && res.cards) {
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
            if (current.num && element.num) {
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
    for (let i = 0; i < cards.length - (n - 1); i++) {
        var current = cards[i];
        var count = 0;
        var res = [current];
        for (let j = i + 1; j < cards.length; j++) {
            const element = cards[j];
            if (!element) {
                continue;
            }
            if (current.num && element.num) {
                // console.log('JudgeHand JudgeStraight', count, current, element);
                if ((parseInt(current.num?.toString())) === parseInt(element.num?.toString())) {
                    current = element;
                    res.push(element);
                    count++;
                }
            }
        }
        if (count >= (n - 1)) {
            // console.log('JudgeHand JudgeStraight', { flag: true, cards: res });
            return { flag: true, cards: res };
        }
    }
    // console.log('JudgeHand JudgeStraight', { flag: false }, cards);
    return { flag: false }
}

export function JudgeOdds(
    player1: {
        key: string;
        flag?: boolean | undefined;
        cards?: PlayCard[] | undefined;
    }[],
    player2: {
        key: string;
        flag?: boolean | undefined;
        cards?: PlayCard[] | undefined;
    }[]
): number[] {
    var res = [-1, -1];
    var p1Win = 0;
    var p2Win = 0;
    var draw = 0;
    // console.log('JudgeOdds', player1, player2);

    for (let i = 0; i < player1.length; i++) {
        const p1 = player1[i];
        var e1 = (PokerHandRanking as any)[p1?.key] as PokerHandRanking;
        for (let j = 0; j < player2.length; j++) {
            const p2 = player2[j];
            var e2 = (PokerHandRanking as any)[p2?.key] as PokerHandRanking;
            if (e1 && e2) {
                if (e1 < e2) {
                    // PokerHandRankingは小さい方が強い
                    // console.log('JudgeOdds p1Win');
                    p1Win++;
                } else if (e1 > e2) {
                    // PokerHandRankingは小さい方が強い
                    // console.log('JudgeOdds p2Win');
                    p2Win++;
                } else if (e1 === e2) {
                    // 同じ場合は詳細な判定が必要
                    switch (JudgeWin(p1, p2)) {
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
                            console.log('JudgeWin ERROR');
                            break;
                    }
                } else {
                    console.log('JudgeWin ERROR');
                }
            }
        }
    }

    var sum = p1Win + p2Win + draw;
    var win1 = p1Win / (sum) * 100.0;
    var win2 = p2Win / (sum) * 100.0;
    console.log('JudgeOdds', p1Win, p2Win, draw)
    res = [win1, win2];
    return res;
}

function JudgeWin(
    player1: {
        key: string;
        flag?: boolean | undefined;
        cards?: PlayCard[] | undefined;
    },
    player2: {
        key: string;
        flag?: boolean | undefined;
        cards?: PlayCard[] | undefined;
    }
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


