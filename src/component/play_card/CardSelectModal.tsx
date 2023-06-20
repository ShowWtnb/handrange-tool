import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import { Box, Button, Card, Grid, Modal, Typography } from "@mui/material";
import SuitUI from "./SuitUI";
import NumberUI from "./NumberUI";
import PlayCardUI from "./PlayCardUI";
import { useEffect, useState } from "react";

interface CardSelectModalProps {
    open: boolean;
    deck?: PlayCardDeck;
    handleClose?: any;
}

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
};

export default function CardSelectModal(prop: CardSelectModalProps) {

    function handleClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void {
        // event
        prop.handleClose(event, reason);
    }

    const [deck, setDeck] = useState(prop.deck);
    useEffect(() => {
        setDeck(prop.deck);
    }, [prop.deck]);

    if (deck === undefined) {
        setDeck(new PlayCardDeck());
    }

    const onCardClicked = (event: any, c: PlayCard) => {
        // console.log(event.target)
        // console.log('CardSelectModal onCardClicked', c);
        // deck?.put_back(c);
        prop.handleClose(c, "selected");
    }
    const GetCard = (c: PlayCard) => {
        return (
            <Grid key={c.suit + '_' + c.num} item xs={3}>
                <PlayCardUI card={c} onClicked={onCardClicked} enabled={c.enable} />
            </Grid>
        );
    }
    if (deck != undefined) {
        if (deck.deck != undefined) {
            var d = deck.deck;
            // var dEnable = deck.deckEnable;
            return (
                <Modal
                    open={prop.open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={style}>
                        <div>
                            <Grid margin={0} container spacing={0} alignItems="center" justifyContent="center">
                                {d.map((c, i = 0) => {
                                    return GetCard(c);
                                })}
                                <Grid item xs={3}>
                                    <PlayCardUI key={'___'} card={undefined} onClicked={onCardClicked} />
                                </Grid>
                            </Grid>

                        </div>
                    </Box>
                </Modal>
            );
        } else {
            return (<div></div>);
        }
    } else {
        return (<div></div>);
    }
}
