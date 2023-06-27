import PlayCardSelector from "@/component/play_card/PlayCardSelector";
import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import { RemoveCircleOutline, Shuffle } from "@mui/icons-material";
import { Box, FormControlLabel, Grid, IconButton, Switch, Tooltip, Typography } from "@mui/material";
import { ChangeEvent, useEffect, useState } from "react";
import HandRangeSelector from "./HandRangeSelector";

interface HandSelectorProps {
    title?: string;
    deck?: PlayCardDeck;
    cards?: PlayCard[];
    onSelected?: any;
    onRangeSelected?: any;
}

export default function HandSelector(prop: HandSelectorProps) {
    const [deck, setDeck] = useState(prop.deck);
    const [card1, setCard1] = useState<PlayCard>();
    const [card2, setCard2] = useState<PlayCard>();
    const [isRangeMode, setIsRangeMode] = useState(false);
    useEffect(() => {
        if (prop.cards) {
            setCard1(prop.cards[0]);
            setCard2(prop.cards[1]);
            // console.log('HandSelector', prop.cards);
            // console.log('HandSelector', card1, card2, deck);
        }
    }, [prop.cards]);
    useEffect(() => {
        //   console.log('HandSelector useEffect', card1, card2, deck) // 更新後のstateをコンソールに表示したい
    }, [card1, card2, deck]);
    useEffect(() => {
        setDeck(prop.deck);
    }, [prop.deck]);

    const onSelected = (selectedCard?: PlayCard, pre?: PlayCard) => {
        // console.log('HandSelector onSelected', selectedCard);
        prop.onSelected(selectedCard, pre);
    }

    const GetCard = (card?: PlayCard, id?: number) => {
        // console.log('HandSelector GetCard', card);
        return (<PlayCardSelector key={id?.toString()} card={card} deck={deck} onSelected={onSelected} />);
    }

    const resetBoard = () => {
        deck?.put_back(card1);
        onSelected(undefined, card1);
        setCard1(undefined);
        deck?.put_back(card2);
        onSelected(undefined, card2);
        setCard2(undefined);
    }
    const shuffleBoard = () => {
        // resetBoard();
        // console.log('HandSelector shuffleBoard', deck);

        var c = deck?.draw();
        console.log('HandSelector shuffleBoard', c, card1);
        if (c) {
            // if (card1) {
            onSelected(c, card1);
            // }
            setCard1(c);
        }
        // console.log('HandSelector shuffleBoard', c, card1);
        c = deck?.draw();
        console.log('HandSelector shuffleBoard', c, card2);
        if (c) {
            // if (card2) {
            onSelected(c, card2);
            // }
            setCard2(c);
        }
        // console.log('HandSelector shuffleBoard', c, card2);
    }

    function onRangeModeChanged(event: ChangeEvent<HTMLInputElement>, checked: boolean): void {
        setIsRangeMode(checked);
        if (prop.onRangeSelected) {
            prop.onRangeSelected({ isRange: checked, list: event });
        }
    }
    function onRangeSelected(event: any): void {
        if (prop.onRangeSelected) {
            prop.onRangeSelected({ isRange: true, list: event });
        }
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center">
                <Grid item xs={3} margin={1}>
                    <Typography>{prop.title}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="resetBoard" onClick={resetBoard}>
                        <RemoveCircleOutline />
                    </IconButton>
                </Grid>
                <Grid item xs={2}>
                    <IconButton aria-label="shuffleBoard" onClick={shuffleBoard}>
                        <Shuffle />
                    </IconButton>
                </Grid>
                <Grid item xs={4} alignContent="right" alignItems="right">
                    <Grid container spacing={1} alignItems="center" justifyContent="right">
                        <Grid item alignContent="right" alignItems="right">
                            <Tooltip title="Turn on to range select mode">
                                <FormControlLabel control={<Switch size="small" checked={isRangeMode} onChange={onRangeModeChanged} />} label="" />
                            </Tooltip>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
            {isRangeMode ? (<HandRangeSelector onSelected={onRangeSelected} />) : (
                <Box margin={1} sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 2 }}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={1} />
                        <Grid item xs={4} >
                            {/* <PlayCardSelector card={card1} deck={deck} onSelected={onSelected} /> */}
                            {GetCard(card1, 0)}
                        </Grid>
                        <Grid item xs={1} />
                        <Grid item xs={4}>
                            {/* <PlayCardSelector card={card2} deck={deck} onSelected={onSelected} /> */}
                            {GetCard(card2, 1)}
                        </Grid>
                        <Grid item xs={1} />
                    </Grid>
                </Box>
            )}
        </div>
    );
}