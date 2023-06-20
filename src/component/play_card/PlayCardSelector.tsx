import { PlayCard, PlayCardDeck, Suit } from "@/const/const_playCard";
import { Card, Typography, Grid, Button } from "@mui/material";
import SuitUI from "./SuitUI";
import NumberUI from "./NumberUI";
import CardSelectModal from "./CardSelectModal";
import { useEffect, useState } from "react";

interface PlayCardProps {
    card?: PlayCard;
    deck?: PlayCardDeck;
    onSelected?: any;
}
export default function card(prop: PlayCardProps) {
    const [openModal, setOpenModal] = useState(false);
    const [card, setCard] = useState(prop.card);
    const [deck, setDeck] = useState(prop.deck);
    const onCardClicked = () => {
        // console.log('PlayCardSelector onCardClicked');
        setOpenModal(true);
    }

    const handleClose = (event: {}, reason: "backdropClick" | "escapeKeyDown" | 'selected') => {
        if (reason === 'selected') {
            // console.log('PlayCardSelector handleClose', reason, event);
            // console.log('PlayCardSelector', event);
            var pre = card;
            setCard(event);
            if (prop.onSelected) {
                prop.onSelected(event, pre);
            }
        }
        setOpenModal(false);
    }

    useEffect(()=>{
        setCard(prop.card);
    },[prop.card])
    useEffect(()=>{
        setDeck(prop.deck);
    },[prop.deck])

    if (card === undefined) {
        // console.log('PlayCardSelector', card);
        return (
            <div>
                <Grid container spacing={0} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <Button onClick={onCardClicked}>
                            <Card style={{ backgroundColor: "#696969" }}>
                                <Grid container spacing={0.5} alignItems="center" justifyContent="center">
                                    <Grid item xs={1} />
                                    <Grid item xs={4}>
                                        <Typography sx={{ fontWeight: 'bold' }} fontSize={'5em'} align="center" color="black">{'? '}</Typography>
                                    </Grid>
                                    <Grid item xs={1} />
                                    <Grid item xs={4}>
                                        <Typography sx={{ fontWeight: 'bold' }} fontSize={'5em'} align="center" color="black">{'?'}</Typography>
                                    </Grid>
                                    <Grid item xs={1} />
                                </Grid>
                            </Card>
                        </Button>
                    </Grid>
                </Grid>
                <CardSelectModal open={openModal} handleClose={handleClose} deck={deck} />
            </div>
        );
    } else {
        // console.log('PlayCardSelector', card);
        return (
            <div>
                <Grid container spacing={0} alignItems="center" justifyContent="center">
                    <Grid item xs={12}>
                        <Button onClick={onCardClicked}>
                            <Card style={{ backgroundColor: "#696969" }}>
                                <Grid container spacing={2} alignItems="center" justifyContent="center">
                                    <Grid item xs={5}>
                                        <SuitUI suit={card.suit} />
                                    </Grid>
                                    <Grid item xs={5}>
                                        <NumberUI card={card} />
                                    </Grid>
                                </Grid>
                            </Card>
                        </Button>
                    </Grid>
                </Grid>
                <CardSelectModal open={openModal} handleClose={handleClose} deck={deck} />
            </div>
        );
    }
}