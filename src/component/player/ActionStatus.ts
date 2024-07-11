import { PlayCard } from "@/const/const_playCard";
import { Actions, Positions, YokosawaHandRangeTier } from "@/const/const_poker";

export default class ActionStatus {
    constructor(max: number, n: number, hand: PlayCard[], isYou: boolean) {
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

    }
    _position!: number;
    position!: Positions;
    stack!: number;
    action!: Actions;
    hand!: PlayCard[];
    tier!: YokosawaHandRangeTier;
    isYou: boolean = false;
}