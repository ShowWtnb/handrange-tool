import { Suit } from "@/const/const_playCard";
import { Typography } from "@mui/material";

export class SuitUIProps{
    suit?: Suit
}

export default function SuitUI(props: SuitUIProps) {
    var suit = props.suit;
    const fontsize = '5em';
    if (suit != undefined) {
        switch (suit) {
            case Suit.SUIT_SPADES:
                // console.log('SuitUI', Suit.SUIT_SPADES);
                return (
                    <div>
                        <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color="black">{'♠'}</Typography>
                    </div>
                );
            case Suit.SUIT_CLOVERS:
                // console.log('SuitUI', Suit.SUIT_CLOVERS);
                return (
                    <div>
                        <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color="green">{'♣'}</Typography>
                    </div>
                );
            case Suit.SUIT_DIAMONDS:
                // console.log('SuitUI', Suit.SUIT_DIAMONDS);
                return (
                    <div>
                        <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color="blue">{'♦'}</Typography>
                    </div>
                );
            case Suit.SUIT_HEARTS:
                // console.log('SuitUI', Suit.SUIT_HEARTS);
                return (
                    <div>
                        <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color="red">{'♥'}</Typography>
                    </div>
                );
            default:
                // console.log('SuitUI', 'default', typeof(suit), suit);
                return (
                    <div>
                        <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color="black">{'?'}</Typography>
                    </div>
                );
        }
    }
    return (
        <div>
            <Typography sx={{ fontWeight: 'bold' }} fontSize={fontsize} align="center" color="black">{'?'}</Typography>
        </div>
    );
}