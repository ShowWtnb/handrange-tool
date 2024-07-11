import { Card, Paper, Stack, Typography } from "@mui/material";
import PlayerStatus from "./PlayerStatus";
import { useEffect, useState } from "react";
import { GetHandStrFromHand, GetTierFromHand, getPositionsKeyName } from "@/const/const_poker";


class PropActionGrid {
    status?: PlayerStatus
}

export default function ActionGrid(prop: PropActionGrid) {
    const [status, setStatus] = useState(prop.status)
    useEffect(() => {
        setStatus(prop.status);
        // console.log('ActionGrid', status);
    }, [prop.status])
    return (
        <>
            <Paper elevation={3}>
                <Stack direction="column" spacing={0} margin={0.5}>
                    <Typography>{getPositionsKeyName(status?.position)}</Typography>
                    <Typography>Stack</Typography>
                    <Typography>Action</Typography>
                    {/* (if(status?.hand !== undefined){
                        <>
                            <Typography>{status?.hand[0].suit}</Typography>
                            <Typography>{status?.hand[0].num}</Typography>
                            <Typography>{status?.hand[1].suit}</Typography>
                            <Typography>{status?.hand[1].num}</Typography>
                        </>
                    }) */}
                    <Typography>{GetHandStrFromHand(status?.hand!)}</Typography>
                    <Typography>{GetTierFromHand(status?.hand!)}</Typography>
                </Stack>
            </Paper >
        </>
    )
}