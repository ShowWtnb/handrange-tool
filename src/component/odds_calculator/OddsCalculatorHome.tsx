import { Button, Box, Grid, TextField, ToggleButton, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton } from "@mui/material";
import { Cached, Clear, RemoveCircleOutline, Shuffle } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";
import HandSelector from "../utils/Poker/HandSelector";
import BoardSelector from "../utils/Poker/BoardSelector";
import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import HandProbability from "../utils/Poker/HandProbability";
import { JudgeOdds } from "@/const/const_poker";

export default function OddsCalculatorHome() {
    //#region オッズ関連
    const [pot, setPot] = useState('100');
    const [bet, setBet] = useState('50');
    const [need2call, setNeed2Call] = useState('');
    const [totalPot, setTotalPot] = useState('');
    // const [playerCount, setPlayerCount] = useState('3');
    const [odds, setOdds] = useState('');
    const [equity, setEquity] = useState('');
    const [selectorVal, setSelectorVal] = useState('0');

    const onPotValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setPot(event.target.value);
        calc();
    }
    const onBetValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBet(event.target.value);
        calc();
    }
    const onSelectorChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        setSelectorVal(event.target.value);
        calc();
    }

    const calc = () => {
        var potTotal = parseFloat(pot);
        var betSize = 0;
        // console.log('OddsCalculatorHome default', typeof (selectorVal), selectorVal)
        switch (parseInt(selectorVal)) {
            case 0:
                betSize = potTotal * parseFloat(bet) * 0.01;
                break;
            case 1:
                betSize = parseFloat(bet);
                break;
            default:
                break;
        }
        setNeed2Call(betSize.toString());
        potTotal += 2.0 * betSize;
        setTotalPot(potTotal.toString());
        var o = potTotal / betSize;
        setOdds(o.toString());
        var eq = 100.0 / o;
        setEquity(eq.toString());
        // console.log('OddsCalculatorHome', pot, potTotal, bet, need2call, odds, equity)
    }
    //#endregion

    const [deck, setDeck] = useState<PlayCardDeck>();
    const [cardBoard, setCardBoard] = useState<PlayCard[]>([]);
    const [cardP1, setCardP1] = useState<PlayCard[]>([]);
    const [cardP2, setCardP2] = useState<PlayCard[]>([]);
    const [winOdds, setWinOdds] = useState<number[]>([-1, -1]);

    const onSelected = (selectedCard: PlayCard, pre: PlayCard) => {
        // console.log('OddsCalculatorHome onSelected', selectedCard, pre);
        deck?.put_back(pre);
        deck?.pick(selectedCard);
        setDeck(deck);
        // console.log('OddsCalculatorHome onSelected', selectedCard, pre);
    }
    const onBoardSelected = (selectedCard: PlayCard, pre: PlayCard) => {
        onSelected(selectedCard, pre);
        // console.log('OddsCalculatorHome onBoardSelected', selectedCard, pre, cardBoard);
        for (let i = 0; i < cardBoard.length; i++) {
            const card = cardBoard[i];
            if (pre === undefined && card === undefined) {
                cardBoard[i] = selectedCard;
                break;
            } else {
                if (card && pre) {
                    if (card.num === pre.num && card.suit === pre.suit) {
                        // console.log('OddsCalculatorHome onBoardSelected', cardBoard[i], selectedCard);
                        cardBoard[i] = selectedCard;
                        break;
                    }
                }
            }
        }
        setCardBoard([...cardBoard]);
        // setCardBoard((prev) => cardBoard.map((c) => (c.num === pre.num && c.suit === pre.suit) ? selectedCard : c))
        // console.log('OddsCalculatorHome onBoardSelected', cardBoard);
    }
    const onP1Selected = (selectedCard: PlayCard, pre: PlayCard) => {
        onSelected(selectedCard, pre);

        for (let i = 0; i < cardP1.length; i++) {
            const card = cardP1[i];
            if (pre === undefined && card === undefined) {
                cardP1[i] = selectedCard;
                // console.log('OddsCalculatorHome onP2Selected', selectedCard, pre, cardP1);
                break;
            } else {
                if (card && pre) {
                    if (card.num === pre.num && card.suit === pre.suit) {
                        // console.log('OddsCalculatorHome onP2Selected', cardBoard[i], selectedCard);
                        cardP1[i] = selectedCard;
                        break;
                    }
                } else {
                    // console.log('OddsCalculatorHome onP2Selected else', cardBoard[i], selectedCard);
                }
            }
        }
        setCardP1([...cardP1]);
    }
    const onP2Selected = (selectedCard: PlayCard, pre: PlayCard) => {
        onSelected(selectedCard, pre);
        // console.log('OddsCalculatorHome onP2Selected', selectedCard, pre, cardP2);

        for (let i = 0; i < cardP2.length; i++) {
            const card = cardP2[i];
            if (pre === undefined && card === undefined) {
                cardP2[i] = selectedCard;
                // console.log('OddsCalculatorHome onP2Selected', selectedCard, pre, cardP2);
                break;
            } else {
                if (card && pre) {
                    if (card.num === pre.num && card.suit === pre.suit) {
                        // console.log('OddsCalculatorHome onP2Selected', cardBoard[i], selectedCard);
                        cardP2[i] = selectedCard;
                        break;
                    }
                } else {
                    // console.log('OddsCalculatorHome onP2Selected else', cardBoard[i], selectedCard);
                }
            }
        }
        setCardP2([...cardP2]);
    }

    useEffect(() => {
        // オッズの計算
        calc();

        var d = new PlayCardDeck();
        // console.log('OddsCalculatorHome', d.deck);
        if (d) {
            var cb: PlayCard[] = [];
            var c = d.draw();
            if (c) {
                cb = ([...cb, c]);
            }
            // console.log('OddsCalculatorHome cb', c, cb);
            c = d.draw();
            if (c) {
                cb = ([...cb, c]);
            }
            // console.log('OddsCalculatorHome cb', c, cb);
            c = d.draw();
            if (c) {
                cb = ([...cb, c]);
            }
            // console.log('OddsCalculatorHome cb', c, cb);
            c = d.draw();
            if (c) {
                cb = ([...cb, c]);
            }
            // console.log('OddsCalculatorHome cb', c, cb);
            c = d.draw();
            if (c) {
                cb = ([...cb, c]);
            }
            // console.log('OddsCalculatorHome cb', c, cb);
            setCardBoard([...cb]);
            // shuffleBoard();

            var c1: PlayCard[] = [];
            var c = d.draw();
            if (c) {
                c1 = ([...c1, c]);
            }
            // console.log('OddsCalculatorHome c1 1', c, c1);
            c = d.draw();
            if (c) {
                c1 = ([...c1, c]);
            }
            // console.log('OddsCalculatorHome c1 2', c, c1);
            setCardP1([...c1]);

            var c2: PlayCard[] = [];
            c = d.draw();
            if (c) {
                c2 = ([...c2, c]);
            }
            // console.log('OddsCalculatorHome c2', c, c2);
            c = d.draw();
            if (c) {
                c2 = ([...c2, c]);
            }
            // console.log('OddsCalculatorHome c2', c, c2);
            setCardP2([...c2]);
        }
        // console.log('OddsCalculatorHome cardBoard', cardBoard, cardP1, cardP2);
        setDeck(d);
    }, []);

    const [combinations1, setCombinations1] = useState<[]>([]);
    const [combinations2, setCombinations2] = useState<[]>([]);
    function onP1CombinationChanged(combinations: []): any {
        setCombinations1(combinations);
    }
    function onP2CombinationChanged(combinations: []): any {
        setCombinations2(combinations);
    }
    useEffect(() => {
        // console.log('OddsCalculatorHome onCombinationChanged');
        var res = JudgeOdds(combinations1, combinations2);
        console.log('OddsCalculatorHome onCombinationChanged', res);
        setWinOdds([...res]);
    }, [combinations1, combinations2]);

    return (
        <div>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-number"
                                        label="Pot(BB)"
                                        type="number"
                                        value={pot}
                                        InputProps={{
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                        onChange={onPotValueChanged}
                                    />
                                </Grid>
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-number"
                                        label="Bet"
                                        type="number"
                                        value={bet}
                                        InputProps={{
                                            sx: {
                                                "& input": {
                                                    textAlign: "center"
                                                }
                                            }
                                        }}
                                        onChange={onBetValueChanged}
                                    />
                                </Grid>
                                <Grid item xs={1}>
                                    <FormControl fullWidth>
                                        <InputLabel id="demo-simple-select-label">unit</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-label"
                                            id="demo-simple-select"
                                            value={selectorVal}
                                            label="unit"
                                            onChange={onSelectorChange}
                                        >
                                            <MenuItem value={0} sx={{}}>{'%'}</MenuItem>
                                            <MenuItem value={1} sx={{}}>{'BB'}</MenuItem>
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="to CALL(BB)"
                                        type="number"
                                        value={need2call}
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
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="Total(BB)"
                                        type="number"
                                        value={totalPot}
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
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="odds"
                                        type="number"
                                        value={odds}
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
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="Equity(%)"
                                        type="number"
                                        value={equity}
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
                                    <IconButton aria-label="reload" onClick={() => { console.log('OddsCalculatorHome IconButton', deck); calc(); }}>
                                        <Cached />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item xs={12}>
                                    <BoardSelector deck={deck} cards={cardBoard} onSelected={onBoardSelected} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 1 }}>
                                        <HandSelector title="Player1" deck={deck} onSelected={onP1Selected} cards={cardP1} />
                                        <HandProbability deck={deck} hand={cardP1} board={cardBoard} onCombinationChanged={onP1CombinationChanged} winOdds={winOdds[0]}/>
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 1 }}>
                                        <HandSelector title="Player2" deck={deck} onSelected={onP2Selected} cards={cardP2} />
                                        <HandProbability deck={deck} hand={cardP2} board={cardBoard} onCombinationChanged={onP2CombinationChanged} winOdds={winOdds[1]}/>
                                    </Box>
                                </Grid>
                            </Grid>
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
                    <Button target="_blank" href="https://youtu.be/U6tDqfkb9-s">【もう迷わない】これって降りるべき？必要勝率＝オッズをマスターして正しくコールしよう！</Button>
                </Grid>
            </Grid>

        </div>
    );
}