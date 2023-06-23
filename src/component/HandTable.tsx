import React, { useEffect, useState } from "react";
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import { PorkerHands, YokosawaHandRangeTier } from "@/const/const_poker";
import { Typography } from "@mui/material";

const fontsize: number = 10.5;

class PropHandTable {
    tierRange: YokosawaHandRangeTier[] = [YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_1];
    title?: string;
}

export default function HandTable(prop: PropHandTable) {
    const [tierRange, setTierRange] = useState(prop.tierRange);

    useEffect(() => {
        // console.log('HandTable useEffect prop.tierRange')
        setTierRange(prop.tierRange);
    }, [prop.tierRange])
    function GetCell(tier: YokosawaHandRangeTier, str: string) {
        // console.log(styles);
        // console.log(tier, str);
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
            case YokosawaHandRangeTier.TIER_8:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#696969', color: '#000000' }}   >{str}</TableCell>;
            default:
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#696969', color: '#000000' }}   >{str}</TableCell>;
        }

    }
    function GetDisabledCell(tier: YokosawaHandRangeTier, str: string) {
        // console.log(styles);
        // console.log(tier, str);
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
            case YokosawaHandRangeTier.TIER_8:
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
                            // if (tierRange[0] >= c.YokosawaTier && tierRange[1] <= c.YokosawaTier) {
                            //     return GetCell(c.YokosawaTier, c.HandStr);
                            // } else {
                            //     return GetDisabledCell(c.YokosawaTier, c.HandStr);
                            // }
                            return GetEnabledHandRange(c.YokosawaTier, c.HandStr, tierRange);
                        })}
                    </TableRow>
                ))}
            </TableBody>
        );
    }

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