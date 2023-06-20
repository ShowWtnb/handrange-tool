import { PorkerHands, YokosawaHandRangeTier } from "@/const/const_poker";
import { GetTurboColor } from "@/const/theme/TurboColor";
import { AttachMoney, MoneyOff } from "@mui/icons-material";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, ToggleButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

const fontsize: number = 10.5;

class PropPowerNumberChartHome {
    // tierRange: YokosawaHandRangeTier[] = [YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_1];
}

export default function PowerNumberChartHome(prop: PropPowerNumberChartHome) {
    const [selected, setSelected] = useState(false);

    function GetCell(tier: YokosawaHandRangeTier, str: string, pow: number) {
        if (selected) {
            if (pow < parseFloat(powNum)) {
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#696969' }}  >{str}<br />{pow}</TableCell>;
            } else {
                var color = GetTurboColor(pow, 140);
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: color }}  >{str}<br />{pow}</TableCell>;
            }
        } else {
            if (pow == -1) {
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: '#696969' }}  >{str}<br />{pow}</TableCell>;
            } else {
                var color = GetTurboColor(pow, 140);
                return <TableCell key={str} align="center" sx={{ fontSize: fontsize, width: 5, background: color }}  >{str}<br />{pow}</TableCell>;
            }
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
                            return GetCell(c.YokosawaTier, c.HandStr, c.PowerNumber);
                        })}
                    </TableRow>
                ))}
            </TableBody>
        );
    }

    const [stack, setStack] = useState('100');
    const [ante, setAnte] = useState('1.5');
    const [mVal, setMVal] = useState('');
    const [playerCount, setPlayerCount] = useState('3');
    const [powNum, setPowNum] = useState('');
    useEffect(() => {
        calc();
    }, [])
    const onStackValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setStack(event.target.value);
        calc();
    }
    const onAnteValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAnte(event.target.value);
        calc();
    }
    const onPlayerCountValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPlayerCount(event.target.value);
        calc();
    }

    const calc = () => {
        var bbCnt = 1.0 + 0.5 + parseFloat(ante);
        var m = parseFloat(stack) / bbCnt;
        setMVal(m.toString());
        var pow = m * parseFloat(playerCount);
        setPowNum(pow.toString());
    }
    const GetIcon = () => {
        if (selected) {
            return (<AttachMoney />);
        } else {
            return (<MoneyOff />);
        }
    }

    return (
        <div>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item xs={2.5}>
                                    <TextField
                                        id="filled-number"
                                        label="Your stack(BB)"
                                        type="number"
                                        value={stack}
                                        InputProps={{
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                        onChange={onStackValueChanged}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-number"
                                        label="Ante(BB)"
                                        type="number"
                                        value={ante}
                                        InputProps={{
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                        onChange={onAnteValueChanged}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="M value"
                                        type="number"
                                        value={mVal}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="filled-number"
                                        label="Player behind count"
                                        type="number"
                                        value={playerCount}
                                        InputProps={{
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                        onChange={onPlayerCountValueChanged}
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="Power Number"
                                        type="number"
                                        value={powNum}
                                        InputProps={{
                                            readOnly: true,
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <ToggleButton
                                        value="check"
                                        selected={selected}
                                        onChange={() => {
                                            calc();
                                            setSelected(!selected);
                                        }}
                                    >
                                        {GetIcon()}
                                    </ToggleButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <TableContainer component={Paper}>
                                <Table sx={{ minWidth: 100 }} aria-label="simple table">
                                    {GetHandRange()}
                                </Table>
                            </TableContainer>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2} >
                    <Typography >
                        {'参考動画：'}
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/7vudIk1J_g0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
                    <Button target="_blank" href="https://youtu.be/VtdTuVJEXLU">トーナメントに勝つために必要なたった４つのこと。</Button>
                </Grid>
            </Grid>
        </div>
    );
}