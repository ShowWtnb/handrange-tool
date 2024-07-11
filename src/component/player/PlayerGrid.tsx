import { Box, Card, Paper, Stack, Typography } from "@mui/material";
import PlayerStatus from "./PlayerStatus";
import { useEffect, useState } from "react";
import { GetActionStyle, GetHandStrFromHand, GetTierFromHand, GetTierStyle, getActionsKeyName, getPositionsKeyName, getTierKeyName } from "@/const/const_poker";
import PlayCardUI from "../play_card/PlayCardUI";


class PropPlayerGrid {
    status?: PlayerStatus
    isCorrect?: boolean
}

export default function PlayerGrid(prop: PropPlayerGrid) {
    const [status, setStatus] = useState(prop.status)
    const [elev, setElev] = useState(3)
    const [isYou, setIsYou] = useState<boolean | undefined>(undefined)
    const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined)
    const [borderStyle, setBorderStyle] = useState('2px solid grey')
    useEffect(() => {
        setStatus(prop.status);
        // console.log('PlayerGrid', status);
        setIsYou(prop.status?.isYou);
    }, [prop.status])
    useEffect(() => {
        setIsCorrect(prop.isCorrect);
        if (prop.isCorrect === undefined) {
            setBorderStyle('2px solid grey')
        } else if (prop.isCorrect === true) {
            setBorderStyle('2px solid green')
        } else if (prop.isCorrect === false) {
            setBorderStyle('2px solid red')
        }
    }, [prop.isCorrect])
    useEffect(() => {
        setStatus(prop.status);
        // console.log('PlayerGrid', status);
        setIsYou(prop.status?.isYou);
        if (prop.status?.isYou) {
            setElev(24);
        } else {
            setElev(3);
        }
    }, [isYou])
    return (
        <>
            {isYou ? (
                <Paper elevation={elev}
                    sx={{
                        // borderRadius: 1,
                        border: borderStyle
                    }}
                >
                    <Stack direction="column" spacing={0} margin={0.5} >
                        <Typography>{getPositionsKeyName(status?.position)}</Typography>
                        {/* <Typography>Stack</Typography> */}
                        {/* <Typography>{getActionsKeyName(status?.action)}</Typography> */}
                        {/* (if(status?.hand !== undefined){
                            <>
                                <Typography>{status?.hand[0].suit}</Typography>
                                <Typography>{status?.hand[0].num}</Typography>
                                <Typography>{status?.hand[1].suit}</Typography>
                                <Typography>{status?.hand[1].num}</Typography>
                            </>
                        }) */}
                        <Typography>{GetHandStrFromHand(status?.hand!)}</Typography>
                        <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                            <PlayCardUI card={status?.hand[0]}>

                            </PlayCardUI>
                            <PlayCardUI card={status?.hand[1]}>

                            </PlayCardUI>
                        </Stack>
                        {/* <Box
                            sx={{
                                bgcolor: GetTierStyle(GetTierFromHand(status?.hand!)!).background,
                                color: GetTierStyle(GetTierFromHand(status?.hand!)!).foreground,
                            }}
                        >
                            <Typography>{getTierKeyName(GetTierFromHand(status?.hand!))}</Typography>

                        </Box> */}
                        {/* <div color={GetTierStyle(GetTierFromHand(status?.hand!)!).background}>
                            <Typography>{getTierKeyName(GetTierFromHand(status?.hand!))}</Typography>
                        </div>
                        <Typography>{getTierKeyName(GetTierFromHand(status?.hand!))}</Typography> */}
                    </Stack>
                </Paper >
            ) : (
                <Paper elevation={elev}>
                    <Stack direction="column" spacing={0} margin={0.5} >
                        <Typography>{getPositionsKeyName(status?.position)}</Typography>
                        {/* <Typography>Stack</Typography> */}
                        <Box
                            sx={{
                                bgcolor: GetActionStyle(status?.action!).background,
                                color: GetActionStyle(status?.action!).foreground,
                            }}
                        >
                            <Typography>{getActionsKeyName(status?.action)}</Typography>
                        </Box>
                        {/* (if(status?.hand !== undefined){
                        <>
                            <Typography>{status?.hand[0].suit}</Typography>
                            <Typography>{status?.hand[0].num}</Typography>
                            <Typography>{status?.hand[1].suit}</Typography>
                            <Typography>{status?.hand[1].num}</Typography>
                        </>
                    }) */}
                        {/* <Typography>{GetHandStrFromHand(status?.hand!)}</Typography>
                        <Box
                            sx={{
                                bgcolor: GetTierStyle(GetTierFromHand(status?.hand!)!).background,
                                color: GetTierStyle(GetTierFromHand(status?.hand!)!).foreground,
                            }}
                        >
                            <Typography>{getTierKeyName(GetTierFromHand(status?.hand!))}</Typography>

                        </Box> */}
                        {/* <div color={GetTierStyle(GetTierFromHand(status?.hand!)!).background}>
                        <Typography>{getTierKeyName(GetTierFromHand(status?.hand!))}</Typography>
                    </div>
                    <Typography>{getTierKeyName(GetTierFromHand(status?.hand!))}</Typography> */}
                    </Stack>
                </Paper >
            )}
        </>
    )
}