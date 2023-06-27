import { Button, Box, Grid, TextField, ToggleButton, Typography, FormControl, InputLabel, Select, MenuItem, SelectChangeEvent, IconButton, CircularProgress } from "@mui/material";
import { Cached, Clear, RemoveCircleOutline, Shuffle } from "@mui/icons-material";
import { ReactNode, useEffect, useState } from "react";
import HandSelector from "../utils/Poker/HandSelector";
import BoardSelector from "../utils/Poker/BoardSelector";
import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import HandProbability from "../utils/Poker/HandProbability";
import { GetCombination, JudgeOdds, JudgeOddsRange } from "@/const/const_poker";

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
        calc(parseFloat(event.target.value), undefined, undefined);
    }
    const onBetValueChanged = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setBet(event.target.value);
        calc(undefined, parseFloat(event.target.value), undefined);
    }
    const onSelectorChange = (event: SelectChangeEvent<string>, child: ReactNode) => {
        setSelectorVal(event.target.value);
        calc(undefined, undefined, parseInt(event.target.value));
    }


    const calc = (a_pot?: number, a_bet?: number, a_selectorVal?: number) => {
        if (a_pot === undefined) {
            a_pot = parseFloat(pot);
        }
        if (a_bet === undefined) {
            a_bet = parseFloat(bet);
        }
        if (a_selectorVal === undefined) {
            a_selectorVal = parseInt(selectorVal);
        }
        var potTotal = a_pot;
        var betSize = 0;
        // console.log('OddsCalculatorHome default', typeof (selectorVal), selectorVal)
        switch (a_selectorVal) {
            case 0:
                betSize = potTotal * a_bet * 0.01;
                break;
            case 1:
                betSize = a_bet;
                break;
            default:
                break;
        }
        setNeed2Call(betSize.toString());
        potTotal += 2.0 * betSize;
        setTotalPot(potTotal.toString());
        var o = potTotal / betSize;
        setOdds(o.toFixed(2).toString());
        var eq = 100.0 / o;
        setEquity(eq.toFixed(2).toString());
        // console.log('OddsCalculatorHome', pot, potTotal, bet, need2call, odds, equity)
    }
    //#endregion

    const [deck, setDeck] = useState<PlayCardDeck>();
    const [cardBoard, setCardBoard] = useState<PlayCard[]>([]);
    const [cardP1, setCardP1] = useState<PlayCard[]>([]);
    const [cardP2, setCardP2] = useState<PlayCard[]>([]);
    const [winOdds, setWinOdds] = useState<number[]>([-1, -1]);
    const [undefinedBoardCount, setUndefinedBoardCount] = useState(0);

    // 初回はランダムにカードを引く
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

    //#region カードの選択が変更された時
    // カードの選択が変更された時
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

    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    function AsyncJudgeOdds(timeout: number = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var res = JudgeOdds(cardP1, cardP2, cardBoard, deck?.get_enables());
                if (res != undefined) {
                    setWinOdds([...res]);
                    resolve(res);
                }

                reject('EOF');
            }, timeout);
        });

    }
    useEffect(() => {
        // console.log('OddsCalculatorHome onCombinationChanged');
        if (!isRange1 && !isRange2) {
            setIsCalculating(true);
            AsyncJudgeOdds(1000)
                .then((result) => {
                    setIsCalculating(false);
                })
                .catch((error) => {
                    // console.log(`Error: ${error}`);
                });
        }
    }, [cardP1, cardP2, cardBoard]);
    useEffect(() => {
        // 未定のボードの枚数をカウントする
        var undefCount = 0;
        for (let i = 0; i < cardBoard.length; i++) {
            const card = cardBoard[i];
            // console.log('OddsCalculatorHome onBoardSelected', card);
            if (card === undefined) {
                // console.log('OddsCalculatorHome onBoardSelected', undefCount, card);
                undefCount++;
            }
        }
        // console.log('OddsCalculatorHome onBoardSelected', undefCount);
        setUndefinedBoardCount(undefCount);
    }, [cardBoard]);
    // #endregion カードの選択が変更された時

    // #region レンジが選択された時    
    const [isRange1, setIsRange1] = useState<boolean>();
    const [isRange2, setIsRange2] = useState<boolean>();
    const [range1, setRange1] = useState<Map<string, boolean>>();
    const [range2, setRange2] = useState<Map<string, boolean>>();
    const [combinations1, setCombinations1] = useState<PlayCard[][]>([]);
    const [combinations2, setCombinations2] = useState<PlayCard[][]>([]);
    const onP1RangeSelected = (selectedCard: any) => {
        // console.log('OddsCalculatorHome onP1RangeSelected', selectedCard);
        if (selectedCard.isRange) {
            setRange1(selectedCard.list);
            setIsRange1(true);
        } else {
            setIsRange1(false);
        }
    }
    const onP2RangeSelected = (selectedCard: any) => {
        // console.log('OddsCalculatorHome onP2RangeSelected', selectedCard);
        if (selectedCard.isRange) {
            setRange2(selectedCard.list);
            setIsRange2(true);
        } else {
            setIsRange2(false);
        }
    }
    // レンジが有効になったとき持っていたハンドをデッキに戻す
    useEffect(() => {
        //
        var arr: any[] = [undefined, undefined];
        if (isRange1) {
            deck?.put_back(cardP1[0]);
            deck?.put_back(cardP1[1]);
            setCardP1(arr);
        } else {
            // var c1: PlayCard[] = [];
            // var c = deck?.draw();
            // if (c) {
            //     c1 = ([...c1, c]);
            // }
            // c = deck?.draw();
            // if (c) {
            //     c1 = ([...c1, c]);
            // }
            // setCardP1([...c1]);
        }
        if (isRange2) {
            deck?.put_back(cardP2[0]);
            deck?.put_back(cardP2[1]);
            setCardP2(arr);
            // console.log('OddsCalculatorHome isRange2', isRange2, arr);
        } else {
            // var c2: PlayCard[] = [];
            // var c = deck?.draw();
            // if (c) {
            //     c2 = ([...c2, c]);
            // }
            // c = deck?.draw();
            // if (c) {
            //     c2 = ([...c2, c]);
            // }
            // setCardP2([...c2]);            
        }
    }, [isRange1, isRange2]);
    // 
    function AsyncJudgeOddsRange(timeout: number = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                var enables = deck?.get_enables();
                // console.log('AsyncJudgeOddsRange', range1, range2, cardP1, cardP2, cardBoard, enables);
                var res = JudgeOddsRange(range1, range2, cardP1, cardP2, cardBoard, enables);
                if (res != undefined) {
                    // setWinOdds([...res]);
                    resolve(res);
                }

                reject('EOF');
            }, timeout);
        });
    }
    useEffect(() => {
        setIsCalculating(true);
        AsyncJudgeOddsRange(1000)
            .then((result: any) => {
                setIsCalculating(false);
                if (result != undefined) {
                    // console.log('AsyncJudgeOddsRange', result);
                    setCombinations1(result.comb1);
                    setCombinations2(result.comb2);
                    setWinOdds([result.result[0], result.result[1]]);
                } else {
                    console.log('AsyncJudgeOddsRange', result);
                }
            })
            .catch((error) => {
                console.log(`AsyncJudgeOddsRange Error: ${error}`);
            });
    }, [range1, range2, cardBoard, deck]);
    // #endregion レンジが選択された時    

    return (
        <div>
            <Grid container spacing={1} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        {/* Equity関連 */}
                        <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item xs={1.5}>
                                    <TextField
                                        id="filled-number"
                                        label="Pot(BB)"
                                        type="number"
                                        variant="standard"
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
                                        variant="standard"
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
                                            variant="standard"
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
                                <Grid item xs={2}>
                                    <TextField
                                        id="filled-read-only-input"
                                        label="Equity(%)"
                                        type="number"
                                        value={equity}
                                        color="primary"
                                        focused
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
                                <Grid item xs={0.5}>
                                    <IconButton aria-label="reload" onClick={() => { console.log('OddsCalculatorHome IconButton', deck); calc(); }}>
                                        <Cached />
                                    </IconButton>
                                </Grid>
                            </Grid>
                        </Grid>
                        {/* 勝率関連 */}
                        <Grid item xs={12}>
                            <Grid container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item xs={12}>
                                    <BoardSelector deck={deck} cards={cardBoard} onSelected={onBoardSelected} />
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 1 }}>
                                        <HandSelector title="Player1" deck={deck} onSelected={onP1Selected} onRangeSelected={onP1RangeSelected} cards={cardP1} />
                                        {isCalculating ? <div><CircularProgress /></div> : <HandProbability handCombination={combinations1} isRangeEnable={isRange1} deck={deck} hand={cardP1} board={cardBoard} winOdds={winOdds[0]} />}
                                    </Box>
                                </Grid>
                                <Grid item xs={6}>
                                    <Box sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 1 }}>
                                        <HandSelector title="Player2" deck={deck} onSelected={onP2Selected} onRangeSelected={onP2RangeSelected} cards={cardP2} />
                                        {isCalculating ? <div><CircularProgress /></div> : <HandProbability handCombination={combinations2} isRangeEnable={isRange2} deck={deck} hand={cardP2} board={cardBoard} winOdds={winOdds[1]} />}
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