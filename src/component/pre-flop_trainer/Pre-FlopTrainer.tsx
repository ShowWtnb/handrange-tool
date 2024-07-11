import { Button, IconButton, Paper, Stack, Typography } from "@mui/material";
import PlayerGrid from "../player/PlayerGrid";
import { useEffect, useState } from "react";
import PlayerStatus from "../player/PlayerStatus";
import { PlayCardDeck } from "@/const/const_playCard";
import { Actions, ActionsKeys, JudgePreFlopAction, getPositionsKeyName, getTierKeyName } from "@/const/const_poker";
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import VerticalAlignBottomIcon from '@mui/icons-material/VerticalAlignBottom';
import TrendingFlatIcon from '@mui/icons-material/TrendingFlat';

const base_elevation = 1;

export default function Pre_FlopTrainer() {
    const [playerCnt, setPlayerCnt] = useState(6)
    const [players, setPlayers] = useState<PlayerStatus[]>([])
    const [actions, setActions] = useState<PlayerStatus[]>([])
    const [deck, setDeck] = useState<PlayCardDeck>()


    function onChangePlayerCnt(e: React.FormEvent<HTMLInputElement>) {
        const newValue = e.currentTarget.value;
        // console.log('Pre_FlopTrainer', 'onChangePlayerCnt', newValue);
        const n = parseInt(newValue);
        setPlayerCnt(n);
    }
    useEffect(() => {
        const p = new Array<PlayerStatus>(playerCnt);
        const d = new PlayCardDeck();

        const rand = Math.floor(Math.random() * (playerCnt - 0) + 0); // 上限は除き、下限は含む
        // console.log('Pre_FlopTrainer', 'playerCnt', rand);

        for (let index = 0; index < p.length; index++) {
            const c1 = d.draw();
            const c2 = d.draw();
            if (c1 === undefined || c2 === undefined) {
                return;
            }
            const isYou = (rand === index)
            p[index] = new PlayerStatus((playerCnt - 1), index, [c1, c2], isYou);
            // console.log('Pre_FlopTrainer', 'playerCnt', index, p[index]);
        }
        setPlayers([...p]);

        setDeck(d);
    }, [playerCnt])
    function PlayerQue() {
        return (
            <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                {players.map((val) => {
                    return <PlayerGrid status={val} />
                })}
            </Stack>
        )
    }
    useEffect(() => {
        if (players.length < 1) {
            return;
        }
        const a = new Array<PlayerStatus>();
        for (let index = 0; index < playerCnt; index++) {
            const p = players[playerCnt - 1 - index];
            // console.log('Pre_FlopTrainer', 'players', getPositionsKeyName(p.position), getTierKeyName(p.tier));

            const action = JudgePreFlopAction(p, a);

            a.push(new PlayerStatus((playerCnt - 1), p._position, [p.hand[0], p.hand[1]], p.isYou, action))
        }

        setIsCorrect(undefined);
        setActions([...a]);
    }, [players])
    const [you, setYou] = useState<PlayerStatus>()
    function ActionQue() {
        var isYou = false;
        return (
            <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                {actions.map((val) => {
                    if (val.isYou) {
                        isYou = true;
                        return <PlayerGrid status={val} isCorrect={isCorrect} />
                    }
                    if (!isYou) {
                        return <PlayerGrid status={val} />
                    }
                })}
            </Stack>
        )
    }
    function AfterAction() {
        if (isCorrect === undefined || isCorrect === false) {
            return;
        } else {
            var isYou = false;
            return (
                <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                    {actions.map((val) => {
                        if (val.isYou) {
                            isYou = true;
                            // return <PlayerGrid status={val} isCorrect={isCorrect} />
                            return;
                        }
                        if (isYou) {
                            return <PlayerGrid status={val} />
                        }
                    })}
                </Stack>
            )
        }
    }
    function ActionSelector() {
        return (
            <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                {/* {ActionsKeys.map((val) => {
                    return <Button> {val}</Button>
                })} */}
                <IconButton aria-label="reload" onClick={() => { JudgeAction(Actions.FOLD); }}>
                    <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                        <VerticalAlignBottomIcon />
                        <Typography>Fold</Typography>
                    </Stack>
                </IconButton>
                <IconButton aria-label="reload" onClick={() => { JudgeAction(Actions.CHECK); }}>
                    <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                        <CheckCircleOutlineIcon />
                        <Typography>Check</Typography>
                    </Stack>
                </IconButton>
                <IconButton aria-label="reload" onClick={() => { JudgeAction(Actions.CALL); }}>
                    <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                        <TrendingFlatIcon />
                        <Typography>Call</Typography>
                    </Stack>
                </IconButton>
                <IconButton aria-label="reload" onClick={() => { JudgeAction(Actions.RAISE); }}>
                    <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                        <TrendingUpIcon />
                        <Typography>Raise</Typography>
                    </Stack>
                </IconButton>
            </Stack>
        )
    }
    const [isCorrect, setIsCorrect] = useState<boolean | undefined>(undefined);
    function JudgeAction(action: Actions) {
        for (let index = 0; index < actions.length; index++) {
            const element = actions[index];
            if (element.isYou) {
                var tCorrect = undefined;
                if (element.action === action) {
                    tCorrect = true;
                } else {
                    tCorrect = false;
                }
                console.log('Pre_FlopTrainer', 'JudgeAction', tCorrect);
                setIsCorrect(tCorrect);
                break;
            }
        }
    }

    return (
        <>
            <h1>Pre_FlopTrainer</h1>
            <input type="number" font-size={20} value={playerCnt} min={4} max={9} onChange={onChangePlayerCnt}></input>
            <Stack overflow={'auto'} spacing={1} padding={1}>
                {/* <Paper elevation={base_elevation} >
                    {PlayerQue()}
                </Paper > */}
                <Paper elevation={base_elevation} >
                    <Stack overflow={'auto'} direction="row" spacing={1} padding={1}>
                        {ActionQue()}
                        {AfterAction()}
                    </Stack>
                </Paper >
                <Paper elevation={base_elevation} >
                    {ActionSelector()}
                </Paper >
            </Stack>

        </>
    )
}
