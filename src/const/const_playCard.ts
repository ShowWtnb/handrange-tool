import { getRandomInt } from "@/component/utils/utils";

export enum Suit {
    SUIT_SPADES = 0,
    SUIT_DIAMONDS,
    SUIT_CLOVERS,
    SUIT_HEARTS,
}
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
export class PlayCardDeck {
    deck: Array<PlayCard>;
    // deckEnable: Array<boolean>;
    constructor() {
        const keysNum = Object.keys(Num).filter((v) => isNaN(Number(v)));
        const keysSuit = Object.keys(Suit).filter((v) => isNaN(Number(v)));

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

}