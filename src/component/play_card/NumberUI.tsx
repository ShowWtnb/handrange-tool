import { Num, PlayCard, Suit } from "@/const/const_playCard";
import { Typography } from "@mui/material";

export class NumberUIProps {
    card?: PlayCard
    fontsize?:string = '100%';
}

export default function NumberUI(props: NumberUIProps) {
    const fontsize = props.fontsize;
    var suit = props.card?.suit;
    var color = 'black';
    if (suit != undefined) {
        switch (suit) {
            case Suit.SUIT_SPADES:
                color = 'black';
                break;
            case Suit.SUIT_CLOVERS:
                color = 'green';
                break;
            case Suit.SUIT_DIAMONDS:
                color = 'blue';
                break;
            case Suit.SUIT_HEARTS:
                color = 'red';
                break;
            default:
                color = 'black';
                break;
        }
    }
    var num = props.card?.num;
    var numStr = '';
    if (num != undefined) {
        switch (num) {
            case Num.NUM_10:
                numStr = 'T';
                break;
            case Num.NUM_ACE:
                numStr = 'A';
                break;
            case Num.NUM_JACK:
                numStr = 'J';
                break;
            case Num.NUM_QUEEN:
                numStr = 'Q';
                break;
            case Num.NUM_KING:
                numStr = 'K';
                break;
            default:
                numStr = (num + 2).toString();
                break;
        }
    }
    return (
        <div>
            <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color={color}>{numStr}</Typography>
        </div>
    );
}