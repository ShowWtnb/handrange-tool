import PlayCardSelector from "@/component/play_card/PlayCardSelector";
import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import { OpenInNew, RemoveCircleOutline, Shuffle } from "@mui/icons-material";
import { Box, FormControl, Grid, IconButton, InputLabel, MenuItem, Select, SelectChangeEvent, Typography } from "@mui/material";
import { ReactNode, useEffect, useState } from "react";
import { RangeSelectModal } from "./RangeSelectModal";
import { GetTierFromString, GetTierStyle, YokosawaHandRangeTier } from "@/const/const_poker";

interface HandSelectorProps {
    title?: string;
    deck?: PlayCardDeck;
    cards?: PlayCard[];
    onSelected?: any;
}

export default function HandRangeSelector(prop: HandSelectorProps) {
    const [deck, setDeck] = useState(prop.deck);
    const [openModal, setOpenModal] = useState(false);
    const [tier1, setTier1] = useState<any>('TIER_6');
    const [tier2, setTier2] = useState<any>('TIER_1');
    const [tierRange, setTierRange] = useState<YokosawaHandRangeTier[]>([]);
    const [selectedList, setSelectedList] = useState<Map<string, boolean>>();
    useEffect(() => {
    }, []);
    useEffect(() => {
        const strT1: keyof typeof YokosawaHandRangeTier = tier1;
        var t1 = YokosawaHandRangeTier[strT1];
        const strT2: keyof typeof YokosawaHandRangeTier = tier2;
        var t2 = YokosawaHandRangeTier[strT2];
        setTierRange([t1, t2]);
        // console.log('HandRangeSelector useEffect tier1, tier2', [t1, t2]);
    }, [tier1, tier2]);

    function openSelectRange(event: any): void {
        // console.log('HandRangeSelector', event);
        setOpenModal(true);
    }
    function onCloseModal(event: any): void {
        // console.log('HandRangeSelector onCloseModal', event);
        if (prop.onSelected) {
            setSelectedList(event);
            prop.onSelected(event);
        }
        setOpenModal(false);
    }
    const keys = Object.keys(YokosawaHandRangeTier).filter((v) => isNaN(Number(v)));

    function handleTier1Change(event: SelectChangeEvent<string>, child: ReactNode): void {
        setTier1(event.target.value);
    }
    function handleTier2Change(event: SelectChangeEvent<string>, child: ReactNode): void {
        setTier2(event.target.value);
    }

    const GetItem = (str: string) => {
        var t = GetTierFromString(str);
        var style = GetTierStyle(YokosawaHandRangeTier.TIER_9);
        if (t != undefined) {
            style = GetTierStyle(t);
        }
        return (
            <Grid item key={str}>
                <Box margin={0} sx={{ border: 1, background: style.background, borderColor: 'transparent', borderRadius: 1.5 }}>
                    <Typography variant="body2" sx={{  color: style.foreground, fontWeight:'bold' }}>{str}</Typography>
                </Box>
            </Grid>
        );
    }

    const GetList = () => {
        // console.log('HandRangeSelector GetList', selectedList);
        if (selectedList != undefined) {
            var keys = Array.from(selectedList.keys());

            // var str = '';
            // // console.log('HandRangeSelector GetList', keys);
            // keys.map((key: string) => {
            //     const c = selectedList.get(key);
            //     // console.log('HandRangeSelector GetList', key, c);
            //     if (c) {
            //         str += key.toString() + ' ';
            //     }
            // });
            // // console.log('HandRangeSelector GetList', str);

            return (
                <Grid container spacing={0.1} alignItems="center" justifyContent="center">
                    {
                        keys.map((key: string) => {
                            const c = selectedList.get(key);
                            if (c) {
                                return GetItem(key)
                            }
                        })
                    }
                </Grid>
            );

            // return (<Typography variant="body2">{str}</Typography>)
        } else {
            return (<div />);
        }
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={5}>
                    <Box margin={0}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant="standard"
                                value={tier1}
                                label="Open"
                                onChange={handleTier1Change}
                            >
                                {keys.map((c: any) => {
                                    const strT: keyof typeof YokosawaHandRangeTier = c;
                                    var t = YokosawaHandRangeTier[strT];
                                    var s = GetTierStyle(t);
                                    return <MenuItem key={c} value={c} sx={{ background: s.background, color: s.foreground }}>{c}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item xs={1}>
                    <Typography>～</Typography>
                </Grid>
                <Grid item xs={5}>
                    <Box margin={0}>
                        <FormControl fullWidth>
                            <InputLabel id="demo-simple-select-label"></InputLabel>
                            <Select
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                variant="standard"
                                value={tier2}
                                label="Open"
                                onChange={handleTier2Change}
                            >
                                {keys.map((c: any) => {
                                    const strT: keyof typeof YokosawaHandRangeTier = c;
                                    var t = YokosawaHandRangeTier[strT];
                                    var s = GetTierStyle(t);
                                    return <MenuItem key={c} value={c} sx={{ background: s.background, color: s.foreground }}>{c}</MenuItem>
                                })}
                            </Select>
                        </FormControl>
                    </Box>
                </Grid>
                <Grid item >
                    <IconButton aria-label="SelectRange" onClick={openSelectRange}>
                        <Typography>{'Select Range'}</Typography>
                        <OpenInNew />
                    </IconButton>
                </Grid>
            </Grid>

            <Box margin={1} sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 2 }}>
                <Grid container spacing={1} alignItems="center" justifyContent="center">
                    <Grid item >
                        {GetList()}
                    </Grid>
                </Grid>
            </Box>
            <RangeSelectModal open={openModal} onClose={onCloseModal} tierRange={tierRange} />
        </div>
    );
}