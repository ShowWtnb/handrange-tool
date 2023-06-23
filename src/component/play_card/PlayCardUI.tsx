import { PlayCard } from "@/const/const_playCard";
import { Button, Card, Grid, Typography } from "@mui/material";
import SuitUI from "./SuitUI";
import NumberUI from "./NumberUI";
import { useEffect, useState } from "react";

interface PlayCardUIProps {
    card?: PlayCard;
    onClicked?: any;
    enabled?: boolean;
}

export default function PlayCardUI(prop: PlayCardUIProps) {
    const [enabled, setEnabled] = useState(true);
    useEffect(() => {
        setEnabled(prop.enabled ?? true);
    }, [prop.enabled]);
    const c = prop.card;

    const onCardClicked = (event: any) => {
        if (prop.onClicked != undefined) {
            prop.onClicked(event, c);
        }
    }
    if (c === undefined) {
        return (
            <Button onClick={onCardClicked}>
                <Card style={{ backgroundColor: "#DCDCDC" }}>
                    <Grid container spacing={0.5} alignItems="center" justifyContent="center">
                        <Grid container spacing={0} alignItems="center" justifyContent="center">
                            <Grid item xs={6}>
                                <Typography sx={{ fontWeight: 'bold' }} fontSize={'5em'} align="center" color="black">{'?'}</Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Typography sx={{ fontWeight: 'bold' }} fontSize={'5em'} align="center" color="black">{'?'}</Typography>
                            </Grid>
                        </Grid>
                    </Grid>
                </Card>
            </Button>
        );
    } else {
        if (enabled) {
            return (
                <Button onClick={onCardClicked}>
                    <Card style={{ backgroundColor: "#DCDCDC" }}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={5}>
                                <SuitUI suit={c.suit} />
                            </Grid>
                            <Grid item xs={5}>
                                <NumberUI card={c} />
                            </Grid>
                        </Grid>
                    </Card>
                </Button>
            );
        } else {
            return (
                <Button disabled>
                    <Card style={{ backgroundColor: "#696969" }}>
                        <Grid container spacing={2} alignItems="center" justifyContent="center">
                            <Grid item xs={5}>
                                <SuitUI suit={c.suit} />
                            </Grid>
                            <Grid item xs={5}>
                                <NumberUI card={c} />
                            </Grid>
                        </Grid>
                    </Card>
                </Button>
            );

        }
    }
}
