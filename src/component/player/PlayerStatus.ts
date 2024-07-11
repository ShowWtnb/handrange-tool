import { PlayCard } from "@/const/const_playCard";
import { Actions, GetTierFromHand, Positions, YokosawaHandRangeTier } from "@/const/const_poker";

export default class PlayerStatus {
    constructor(max: number, n: number, hand: PlayCard[], isYou: boolean, action?: Actions) {
        this._position = n;
        if (max == n) {
            // console.log('PlayerStatus constructor', '入ってる？');
            this.position = Positions.UTG;
        } else if (n < Positions.UTG) {
            this.position = n;
        } else {
            this.position = Positions.NONE;
        }
        // console.log('PlayerStatus constructor', max, n, this.position);
        this.hand = hand;
        this.isYou = isYou;
        const t = GetTierFromHand(hand);
        if (t !== undefined) {
            this.tier = t;
        }
        this.action = action;

    }
    _position!: number;
    position!: Positions;
    stack!: number;
    action?: Actions;
    hand!: PlayCard[];
    tier!: YokosawaHandRangeTier;
    isYou: boolean = false;
}