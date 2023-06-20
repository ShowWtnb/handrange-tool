import PlayCardSelector from "@/component/play_card/PlayCardSelector";
import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import { RemoveCircleOutline, Shuffle } from "@mui/icons-material";
import { Box, Grid, IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

interface BoardSelectorProps {
    deck?: PlayCardDeck;
    cards?: PlayCard[];
    onSelected?: any;
}

export default function BoardSelector(prop: BoardSelectorProps) {
    const [deck, setDeck] = useState(prop.deck);
    const [card1, setCard1] = useState<PlayCard>();
    const [card2, setCard2] = useState<PlayCard>();
    const [card3, setCard3] = useState<PlayCard>();
    const [card4, setCard4] = useState<PlayCard>();
    const [card5, setCard5] = useState<PlayCard>();
    useEffect(() => {
        if (prop.cards) {
            setCard1(prop.cards[0]);
            setCard2(prop.cards[1]);
            setCard3(prop.cards[2]);
            setCard4(prop.cards[3]);
            setCard5(prop.cards[4]);
        }
    }, [prop.cards])
    useEffect(() => {
        //   console.log('BoardSelector useEffect', card1, card2, card3, card4, card5, deck) // 更新後のstateをコンソールに表示したい
    }, [card1, card2, card3, card4, card5, deck]);
    useEffect(() => {
        setDeck(prop.deck);
    }, [prop.deck]);

    const onSelected = (selectedCard?: PlayCard, pre?: PlayCard) => {
        // console.log('HandSelector onSelected', selectedCard);
        prop.onSelected(selectedCard, pre);
    }

    const GetCard = (card?: PlayCard) => {
        // console.log('BoardSelector GetCard', card);
        return (<PlayCardSelector card={card} deck={deck} onSelected={onSelected} />);
    }

    const resetBoard = () => {
        deck?.put_back(card1);
        onSelected(undefined, card1);
        setCard1(undefined);
        deck?.put_back(card2);
        onSelected(undefined, card2);
        setCard2(undefined);
        deck?.put_back(card3);
        onSelected(undefined, card3);
        setCard3(undefined);
        deck?.put_back(card4);
        onSelected(undefined, card4);
        setCard4(undefined);
        deck?.put_back(card5);
        onSelected(undefined, card5);
        setCard5(undefined);
    }
    const shuffleBoard = () => {
        // resetBoard();

        var c = deck?.draw();
        if (c) {
            // if (card1) {
            onSelected(c, card1);
            // }
            setCard1(c);
        }
        c = deck?.draw();
        if (c) {
            // if (card2) {
            onSelected(c, card2);
            // }
            setCard2(c);
        }
        c = deck?.draw();
        if (c) {
            // if (card3) {
            onSelected(c, card3);
            // }
            setCard3(c);
        }
        c = deck?.draw();
        if (c) {
            // if (card4) {
            onSelected(c, card4);
            // }
            setCard4(c);
        }
        c = deck?.draw();
        if (c) {
            // if (card5) {
            onSelected(c, card5);
            // }
            setCard5(c);
        }
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={1.5}>
                    <Typography>{'Board'}</Typography>
                </Grid>
                <Grid item xs={1}>
                    <IconButton aria-label="resetBoard" onClick={resetBoard}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Grid>
                <Grid item xs={1}>
                    <IconButton aria-label="shuffleBoard" onClick={shuffleBoard}>
                        <Shuffle />
                    </IconButton>
                </Grid>
            </Grid>
            <Box sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 2 }}>
                <Grid margin={0.5} container spacing={1} alignItems="center" justifyContent="center">
                    <Grid item xs={6}>
                        <Typography>Flop</Typography>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={2}>
                        <Typography>Turn</Typography>
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={2}>
                        <Typography>River</Typography>
                    </Grid>
                </Grid>
                <Grid container spacing={1} alignItems="center" justifyContent="center">
                    <Grid item xs={2}>
                        {GetCard(card1)}
                    </Grid>
                    <Grid item xs={2}>
                        {GetCard(card2)}
                        {/* <PlayCardSelector card={card2} /> */}
                    </Grid>
                    <Grid item xs={2}>
                        {GetCard(card3)}
                        {/* <PlayCardSelector card={card3} /> */}
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={2}>
                        {GetCard(card4)}
                        {/* <PlayCardSelector card={card4} /> */}
                    </Grid>
                    <Grid item xs={1} />
                    <Grid item xs={2}>
                        {GetCard(card5)}
                        {/* <PlayCardSelector card={card5} /> */}
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}