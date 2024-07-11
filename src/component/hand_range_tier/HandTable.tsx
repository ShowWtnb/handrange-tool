import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { GetTierStyle, PorkerHands, YokosawaHandRangeTier } from "@/const/const_poker";
import { Grid, ToggleButton, Typography } from "@mui/material";
import { theme } from "@/const/theme/theme";

const fontsize: number = 10.5;

class PropHandTable {
    tierRange: YokosawaHandRangeTier[] = [YokosawaHandRangeTier.TIER_9, YokosawaHandRangeTier.TIER_1];
    title?: string;
    mode?: string;
    onRangeChange?: any;
    flags?: Map<string, boolean>;
}

export default function HandTable(prop: PropHandTable) {
    const [tierRange, setTierRange] = useState(prop.tierRange);
    const [mode, setMode] = useState(prop.mode);
    const [flags, setFlags] = useState<Map<string, boolean>>(new Map<string, boolean>);

    useEffect(() => {
        // console.log('HandTable useEffect prop.tierRange')
        const tierR = prop.tierRange;

        // 上からflagsが与えられていないときだけ初期化する
        if (prop.flags == undefined) {
            // console.log('HandTable useEffect prop.tierRange', flags);
            var fs = new Map<string, boolean>();
            for (let i = 0; i < PorkerHands.length; i++) {
                const element = PorkerHands[i];
                for (let j = 0; j < element.length; j++) {
                    const card = element[j];
                    const cTier = card.YokosawaTier;
                    if (cTier <= tierR[0] && cTier >= tierR[1]) {
                        fs.set(card.HandStr, true);
                    } else {
                        fs.set(card.HandStr, false);
                    }
                }
            }
            // console.log('HandTable useEffect prop.tierRange', fs);
            setFlags(fs);
            if (prop.onRangeChange) {
                prop.onRangeChange(fs);
            }
        }
        setTierRange(tierR);
    }, [prop.tierRange]);

    useEffect(() => {
        if (prop.flags) {
            setFlags(prop.flags);
        }
    }, [prop.flags]);
    useEffect(() => {
        setMode(prop.mode);
    }, [prop.mode]);
    function GetCell(tier: YokosawaHandRangeTier, str: string) {
        // console.log(styles);
        // console.log(tier, str);
        const style = GetTierStyle(tier);
        return <TableCell key={str} align="center" sx={{ fontSize: fontsize, fontWeight: 'bold', width: 5, background: style.background, color: style.foreground }}  >{str}</TableCell>;

        switch (tier) {
            case YokosawaHandRangeTier.TIER_1:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#191970' }}  >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_2:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#FF0000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_3:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#FFD700', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_4:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#228B22' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_5:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#1E90FF' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_6:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#FFFFFF', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_7:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#D8BFD8', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_9:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#696969', color: '#000000' }}   >{str}</TableCell>;
            default:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#696969', color: '#000000' }}   >{str}</TableCell>;
        }

    }
    function GetDisabledCell(tier: YokosawaHandRangeTier, str: string) {
        // console.log(styles);
        // console.log(tier, str);
        return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}  >{str}</TableCell>;

        switch (tier) {
            case YokosawaHandRangeTier.TIER_1:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}  >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_2:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_3:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_4:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_5:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_6:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_7:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            case YokosawaHandRangeTier.TIER_9:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
            default:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#A9A9A9', color: '#000000' }}   >{str}</TableCell>;
        }

    }
    const GetEnabledHandRange = (tier: YokosawaHandRangeTier, str: string, a_tierRange: YokosawaHandRangeTier[]) => {
        if (a_tierRange[0] >= tier && a_tierRange[1] <= tier) {
            // console.log('GetEnabledHandRange0', tier, str, a_tierRange)
            return GetCell(tier, str);
        } else {
            // console.log('GetEnabledHandRange1', tier, str, a_tierRange)
            return GetDisabledCell(tier, str);
        }
    }
    const GetHandRange = () => {
        return (
            <TableBody>
                {PorkerHands.map((row, i = 0) => (
                    <TableRow key={i++}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 30 }}
                    >
                        {row.map((c) => {
                            return GetEnabledHandRange(c.YokosawaTier, c.HandStr, tierRange);
                        })}
                    </TableRow>
                ))}
            </TableBody>
        );
    }

    const UpdateFlags = (key: string, val: boolean) => {
        // console.log('HandTable GetHandToggleButton', key, flags.get(key));
        // flags.set(key, val);
        // setFlags(flags);
        setFlags(map => new Map(map.set(key, val)));
        if (prop.onRangeChange) {
            prop.onRangeChange(flags);
        }
        // console.log('HandTable GetHandToggleButton', key, flags.get(key));
    }

    const GetHandToggleButton = (cTier: YokosawaHandRangeTier, str: string, range: YokosawaHandRangeTier[]) => {
        const width = 12.0 / 13.0;
        // console.log('HandTable GetHandToggleButton', cTier, range, flags.get(str));
        const tierStyle = GetTierStyle(cTier);
        if (flags.get(str)) {
            return (
                <Grid item key={str} xs={width} alignContent='center' alignItems='center'>
                    <ToggleButton
                        value="check"
                        selected={flags.get(str)}
                        onChange={() => {
                            UpdateFlags(str, false);
                        }}
                        style={{ textTransform: 'none', fontSize: '0.8em', color: tierStyle.foreground, fontWeight: 'bold', background: tierStyle.background }}
                    >
                        {str}
                    </ToggleButton>
                </Grid>
            );
        } else {
            return (
                <Grid item key={str} xs={width} alignContent='center' alignItems='center'>
                    <ToggleButton
                        value="check"
                        selected={flags.get(str)}
                        onChange={() => {
                            UpdateFlags(str, true);
                        }}
                        style={{ textTransform: 'none', fontSize: '0.8em' }}
                    >
                        {str}
                    </ToggleButton>
                </Grid>
            );
        }
    }
    const GetHandToggles = () => {
        return (
            <div>
                {PorkerHands.map((row, i = 0) => {
                    return (
                        <Grid container spacing={0} alignItems="center" justifyContent="center">
                            {row.map((c, j = 0) => {
                                return GetHandToggleButton(c.YokosawaTier, c.HandStr, tierRange);
                            })}
                        </Grid>
                    )
                })}
            </div>
        );
    }
    if (mode) {
        // console.log('HandTable', mode);
        switch (mode) {
            case 'toggle':
                return (
                    <div>
                        <Grid container width={650} spacing={0} alignItems="center" justifyContent="center">
                            <Grid item xs={6}>
                            </Grid>
                            <Grid item xs={6}>
                            </Grid>
                            <Grid item xs={12}>
                                {GetHandToggles()}
                            </Grid>
                        </Grid>
                    </div>
                );
            default:
                return (<div />);
        }
    } else {
        return (
            <div>
                {prop.title ? (<Typography >{prop.title}</Typography>) : <div />}
                <TableContainer component={Paper}>
                    <Table sx={{ minWidth: 100 }} aria-label="simple table">
                        {/* <TableHead>
                        </TableHead> */}
                        {GetHandRange()}
                    </Table>
                </TableContainer>
            </div>
        );
    }

}