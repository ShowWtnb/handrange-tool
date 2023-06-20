import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import { JudgeHand, PokerHandRanking } from "@/const/const_poker";
import { Box, CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { nCr, combinations } from "../utils";

interface HandProbabilityProps {
    deck?: PlayCardDeck;
    hand?: PlayCard[];
    board?: PlayCard[];
    onCombinationChanged?: (combinations: any) => {};
    winOdds?: number;
}

export default function HandProbability(prop: HandProbabilityProps) {
    const [deck, setDeck] = useState<PlayCardDeck>();
    const [cardBoard, setCardBoard] = useState<PlayCard[]>();
    const [cardP1, setCardP1] = useState<PlayCard[]>();
    const [probability, setProbability] = useState<number[]>([]);
    const [PokerHandRankings, setPokerHandRankings] = useState<string[]>([]);
    const [isProbability, setIsProbability] = useState<boolean>(false);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [winOdds, setWinOdds] = useState(prop.winOdds);

    useEffect(() => {
        setWinOdds(prop.winOdds);
    }, [prop.winOdds]);
    useEffect(() => {
        setDeck(prop.deck);
    }, [prop.deck]);
    useEffect(() => {
        setCardBoard(prop.board);
    }, [prop.board]);
    useEffect(() => {
        setCardP1(prop.hand);
    }, [prop.hand]);
    useEffect(() => {
        setPokerHandRankings(Object.keys(PokerHandRanking).filter((v) => isNaN(Number(v))));
    }, []);
    useEffect(() => {
        setIsCalculating(true);
        // Promiseを利用する処理
        AsyncGetProbabilityHand(1000)
            .then((result) => {
                setIsCalculating(false);
            })
            .catch((error) => {
                console.error(`Error: ${error.message}`);
            });

    }, [deck, cardBoard, cardP1]);

    // スレッド処理
    // https://zenn.dev/airiswim/articles/14d8a9e87503b6    
    function AsyncGetProbabilityHand(timeout: number = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setIsProbability(false);
                if (!cardBoard || !deck) {
                    return;
                }

                var undefCount = 0;
                for (let i = 0; i < cardBoard.length; i++) {
                    const boardC = cardBoard[i];
                    if (boardC === undefined) {
                        undefCount++;
                    }
                }

                // hand側のundefCountもカウントする
                if (cardP1) {
                    for (let i = 0; i < cardP1.length; i++) {
                        const boardC = cardP1[i];
                        if (boardC === undefined) {
                            undefCount++;   // ボードが未定でもハンドが未定でも結果は同じなのでボードの未定を増やせばよい
                        }
                    }
                }

                if (undefCount > 0) {
                    // deckから有効牌のみを取り出す
                    var effective = [];
                    for (let i = 0; i < deck?.deck.length; i++) {
                        const element = deck?.deck?.at(i);
                        if (element && element.enable) {
                            effective.push(element);
                        }
                    }

                    // console.log('GetProbabilityHand', effective.length, undefCount);
                    var cc = nCr(effective.length, undefCount);
                    // console.log('GetProbabilityHand', cc);


                    var resC = combinations(effective, undefCount);
                    // console.log('GetProbabilityHand', undefCount, resC);

                    var counter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                    // boardからundefを取り除く
                    var boardNotUndef = [];
                    for (let i = 0; i < cardBoard.length; i++) {
                        const element = cardBoard[i];
                        if (element) {
                            boardNotUndef.push(element);
                        }
                    }
                    // handからundefを取り除く
                    var handNotUndef = [];
                    if (cardP1) {
                        for (let i = 0; i < cardP1.length; i++) {
                            const element = cardP1[i];
                            if (element) {
                                handNotUndef.push(element);
                            }
                        }
                    }
                    var comb = [];
                    for (let i = 0; i < resC.length; i++) {
                        const element = resC[i];
                        var b = [...boardNotUndef, ...element];
                        var res = JudgeHand(handNotUndef, b);
                        comb.push(res);
                        if (res?.flag) {
                            var e = (PokerHandRanking as any)[res?.key] as PokerHandRanking;
                            // console.log('GetProbabilityHand', res, e);
                            counter[e] += 1;
                        }
                    }
                    if (prop.onCombinationChanged) {
                        prop.onCombinationChanged(comb);
                    }
                    for (let i = 0; i < counter.length; i++) {
                        // const element = counter[i];
                        counter[i] = counter[i] * 100 / cc;
                    }
                    // console.log('GetProbabilityHand', cc, counter);
                    setProbability([...counter]);
                    setIsProbability(true);
                    resolve([...counter]);
                }
                reject('EOF')
            }, timeout);
        });
    }

    const GetCurrentHand = () => {
        var res = JudgeHand(cardP1, cardBoard);
        var str = 'something';
        if (res) {
            if (res.flag) {
                // console.log('HandProbability GetCurrentHand', res);
                str = res.key;
            }
        } else {
            // console.log('HandProbability GetCurrentHand', res);
        }

        return (
            <div>
                <Typography align="center">{str}</Typography>
            </div>
        );
    }

    const GetProbabilityHand = () => {
        if (!cardBoard || !deck) {
            return (<div />);
        }

        if (isCalculating && isProbability) {
            return (
                <div>
                    <LinearProgress />
                </div>
            );
        }

        return (
            isProbability ?
                <div>
                    {PokerHandRankings.map((v: any, i = 0) => {
                        return (
                            <Grid key={v} container spacing={1} alignItems="center" justifyContent="center">
                                <Grid item xs={6} >
                                    <Typography align="center">{v}</Typography>
                                </Grid>
                                <Grid item xs={4} >
                                    <div style={{ flexGrow: 1 }}></div>
                                    <Typography align="right">{probability?.at(i++)?.toFixed(2)}</Typography>
                                </Grid>
                                <Grid item xs={2}>
                                    <Typography align="left">{'%'}</Typography>
                                </Grid>
                            </Grid>
                        );
                    })}
                </div>
                : <div />
        );
    }

    const GetWinOdds = () => {
        return (
            <Grid container spacing={0} alignItems="center" justifyContent="center">
                <Grid item xs={6} >
                    <Typography margin={1} align="left">{'Possibility'}</Typography>
                </Grid>
                <Grid item xs={4} >
                    <div style={{ flexGrow: 1 }}></div>
                    <Typography align="right">{winOdds?.toFixed(2)}</Typography>
                </Grid>
                <Grid item xs={2}>
                    <Typography align="left">{'%'}</Typography>
                </Grid>
            </Grid>
        );
    }

    return (
        <div>
            {GetCurrentHand()}
            {GetWinOdds()}
            <Box margin={1} sx={{ border: 1, borderColor: 'ButtonShadow', borderRadius: 1 }}>
                <Grid container spacing={1} alignItems="center" justifyContent="center">
                    <Grid item xs={12} >
                        {GetProbabilityHand()}
                    </Grid>
                </Grid>
            </Box>
        </div>
    );
}