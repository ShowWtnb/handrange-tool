import { getRandomInt } from "@/component/utils/utils";

export enum Suit {
    SUIT_SPADES = 0,
    SUIT_DIAMONDS,
    SUIT_CLOVERS,
    SUIT_HEARTS,
}
export const SuitKeys = Object.keys(Suit).filter((v) => isNaN(Number(v)));
export enum Num {
    NUM_2 = 0,
    NUM_3,
    NUM_4,
    NUM_5,
    NUM_6,
    NUM_7,
    NUM_8,
    NUM_9,
    NUM_10,
    NUM_JACK,
    NUM_QUEEN,
    NUM_KING,
    NUM_ACE,
}
export const NumKeys = Object.keys(Num).filter((v) => isNaN(Number(v)));
export function GetNUMfromString(str: string): Num | undefined {
    switch (str) {
        case 'A':
            return Num.NUM_ACE;
        case 'K':
            return Num.NUM_KING;
        case 'Q':
            return Num.NUM_QUEEN;
        case 'J':
            return Num.NUM_JACK;
        case 'T':
            return Num.NUM_10;
        case '9':
            return Num.NUM_9;
        case '8':
            return Num.NUM_8;
        case '7':
            return Num.NUM_7;
        case '6':
            return Num.NUM_6;
        case '5':
            return Num.NUM_5;
        case '4':
            return Num.NUM_4;
        case '3':
            return Num.NUM_3;
        case '2':
            return Num.NUM_2;
        default:
            break;
    }
    return undefined;
}
export function GetStringFromNUM(num?: Num): string {
    switch (num) {
        case Num.NUM_ACE:
            return 'A';
        case Num.NUM_KING:
            return 'K';
        case Num.NUM_QUEEN:
            return 'Q';
        case Num.NUM_JACK:
            return 'J';
        case Num.NUM_10:
            return 'T';
        case Num.NUM_9:
            return '9';
        case Num.NUM_8:
            return '8';
        case Num.NUM_7:
            return '7';
        case Num.NUM_6:
            return '6';
        case Num.NUM_5:
            return '5';
        case Num.NUM_4:
            return '4';
        case Num.NUM_3:
            return '3';
        case Num.NUM_2:
            return '2';

        default:
            break;
    }
    return '';
}

export class PlayCard {
    suit?: Suit;
    num?: Num;
    enable?: boolean = true;
    constructor(s?: Suit, n?: Num, e?: boolean) {
        this.suit = s;
        this.num = n;
        this.enable = e ?? true;
    }
}
export function PlayCardCompare(array: PlayCard[], val: PlayCard) {
    return array.some((arrVal) => (arrVal.num === val.num && arrVal.suit === val.suit));
}
export class PlayCardDeck {
    deck: Array<PlayCard>;
    // deckEnable: Array<boolean>;
    constructor() {
        const keysNum = NumKeys;
        const keysSuit = SuitKeys;

        this.deck = new Array<PlayCard>();
        // this.deckEnable = new Array<boolean>();

        keysNum.forEach((keyN, indexN) => {
            keysSuit.forEach((keyS, indexS) => {
                // console.log(indexN, keyN, indexS, keyS);
                this.deck?.push(new PlayCard(indexS, indexN, true));
                // this.deckEnable?.push(true);
            });
        });
    }
    /// ランダムにカードを一枚ドローする
    draw(): PlayCard | undefined {
        var idx = 0;
        while (idx < 52) {
            var rand = getRandomInt(0, 51);
            // var flag = this.deckEnable?.at(rand);
            var flag = this.deck?.at(rand)?.enable;
            // console.log(rand, flag);
            if (flag && this.deck) {
                this.deck[rand].enable = false;
                idx++;
                return this.deck?.at(rand);
            }
        }
        return undefined;
    }
    /// 指定のカード1枚を無効にする
    pick(card: PlayCard): boolean {
        if (this.deck && this.deck && card) {
            for (let i = 0; i < this.deck.length; i++) {
                const deckCard = this.deck[i];
                if (deckCard.num === card.num && deckCard.suit === card.suit && this.deck[i]) {
                    this.deck[i].enable = false;
                    return true;
                }
            }
        }
        // 既にピックされている場合
        return false;
    }
    /// 指定のカード1枚を有効にする
    put_back(card?: PlayCard): boolean {
        if (this.deck && card) {
            for (let i = 0; i < this.deck.length; i++) {
                const deckCard = this.deck[i];
                if (deckCard.num === card.num && deckCard.suit === card.suit && this.deck[i]) {
                    this.deck[i].enable = true;
                    return true;
                }
            }
        }
        // 既に有効な場合
        return false;
    }
    /// 全てのカードを有効にする
    reset(): void {
        if (this.deck) {
            for (let i = 0; i < this.deck.length; i++) {
                this.deck[i].enable = true;
            }
        }
    }
    // 有効なカードの一覧を取得する
    get_enables(): PlayCard[] {
        var res: PlayCard[] = [];
        for (let i = 0; i < this.deck.length; i++) {
            const element = this.deck[i];
            if (element.enable) {
                res.push(element);
            }
        }
        return res;
    }

}