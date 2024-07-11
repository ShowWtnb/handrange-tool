import { PorkerHands, YokosawaHandRangeTier } from "@/const/const_poker";
import { GetTurboColor } from "@/const/theme/TurboColor";
import { AttachMoney, MoneyOff } from "@mui/icons-material";
import { Button, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableRow, TextField, ToggleButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useWindowSize } from '../utils/useWindowSize'
import styles from './style.module.css'


const fontsize: number = 10.5;

class PropPowerNumberChartHome {
    // tierRange: YokosawaHandRangeTier[] = [YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_1];
}

export default function PowerNumberChartHome(prop: PropPowerNumberChartHome) {
    const [selected, setSelected] = useState(false);
    const [width, height] = useWindowSize();


    function GetCell(tier: YokosawaHandRangeTier, str: string, pow: number) {
        if (selected) {
            if (pow < parseFloat(powNum)) {
                return (
                    // <div className={styles.cell}>
                        <TableCell className={styles.cell} key={str} align="center" sx={{ background: '#696969' }}  >{str}<br />{pow}</TableCell>
                    // </div>
                );
            } else {
                var color = GetTurboColor(pow, 140);
                return (
                    // <div className={styles.cell}>
                        <TableCell className={styles.cell} key={str} align="center" sx={{ background: color }}  >{str}<br />{pow}</TableCell>
                    // </div>
                );
            }
        } else {
            if (pow == -1) {
                return (
                    // <div className={styles.cell}>
                        <TableCell className={styles.cell} key={str} align="center" sx={{  background: '#696969' }}  >{str}<br />{pow}</TableCell>
                    // </div>
                );
            } else {
                var color = GetTurboColor(pow, 140);
                return (
                    // <div className={styles.cell}>
                        <TableCell className={styles.cell} key={str} align="center" sx={{  background: color }}  >{str}<br />{pow}</TableCell>
                    // </div >
                );
            }
        }

    }
    const GetHandRange = () => {
        return (
            <TableBody className={styles.tableBody}>
                {PorkerHands.map((row, i = 0) => (
                    // <div className={styles.row}>
                        <TableRow key={i++} className={styles.row}
                            // style={{
                            //     height: 50,
                            // }}
                            sx={{ '&:last-child td, &:last-child th': { border: 0 }, }}
                        >
                            {row.map((c) => {
                                return GetCell(c.YokosawaTier, c.HandStr, c.PowerNumber)
                            })}
                        </TableRow>
                    // </div>
                ))}
            </TableBody>
        )
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
        calc(undefined, parseFloat(event.target.value), undefined);
        // calc();
    }
    const onAnteValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setAnte(event.target.value);
        calc(parseFloat(event.target.value), undefined, undefined);
        // calc();
    }
    const onPlayerCountValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPlayerCount(event.target.value);
        calc(undefined, undefined, parseFloat(event.target.value));
    }

    const calc = (a_ante?: number, a_stack?: number, a_playerCount?: number) => {
        if (a_ante === undefined) {
            a_ante = parseFloat(ante);
        }
        if (a_stack === undefined) {
            a_stack = parseFloat(stack);
        }
        if (a_playerCount === undefined) {
            a_playerCount = parseFloat(playerCount);
        }
        var bbCnt = 1.0 + 0.5 + a_ante;
        var m = a_stack / bbCnt;
        setMVal(m.toString());
        var pow = m * a_playerCount;
        setPowNum(pow.toString());
    }
    const GetIcon = () => {
        if (selected) {
            return (<AttachMoney color="primary" fontSize="medium" />);
        } else {
            return (<MoneyOff color="disabled" />);
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
                                        variant="standard"
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
                                        variant="standard"
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
                                        variant="standard"
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
                                        color="primary"
                                        focused
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
                        <Grid item xs={12} alignItems="center" justifyContent="center">
                            {/* <div >
                                <div className={styles.home}> */}
                                    <TableContainer component={Paper} className={styles.home}>
                                        <Table className={styles.table} sx={{ minWidth: 100 }} aria-label="simple table">
                                            {GetHandRange()}
                                        </Table>
                                    </TableContainer>
                                {/* </div>
                            </div> */}
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs='auto' >
                    <Typography >
                        {'参考動画：'}
                    </Typography>
                </Grid>
                <Grid item xs='auto' alignItems='left' textAlign='left'>
                    <Button target="_blank" href="https://youtu.be/VtdTuVJEXLU">トーナメントに勝つために必要なたった４つのこと。</Button>
                </Grid>
            </Grid>
        </div>
    );
}