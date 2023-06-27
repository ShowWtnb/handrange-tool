import { PlayCard, PlayCardDeck } from "@/const/const_playCard";
import { JudgeHand, PokerHandRanking, PokerHandRankingKeys } from "@/const/const_poker";
import { Box, CircularProgress, Grid, LinearProgress, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { nCr, combinations } from "../utils";

interface HandProbabilityProps {
    deck?: PlayCardDeck;
    hand?: PlayCard[];
    board?: PlayCard[];
    // onCombinationChanged?: (combinations: any) => {};
    winOdds?: number;
    isRangeEnable?: boolean;
    handCombination?: PlayCard[][];
}

export default function HandProbability(prop: HandProbabilityProps) {
    const [deck, setDeck] = useState<PlayCardDeck>();
    const [cardBoard, setCardBoard] = useState<PlayCard[]>();
    const [cardHand, setCardHand] = useState<PlayCard[]>();
    const [probability, setProbability] = useState<number[]>([]);
    const [PokerHandRankings, setPokerHandRankings] = useState<string[]>([]);
    const [isProbability, setIsProbability] = useState<boolean>(false);
    const [isCalculating, setIsCalculating] = useState<boolean>(false);
    const [winOdds, setWinOdds] = useState(prop.winOdds);
    const [isRangeEnable, setIsRangeEnable] = useState(prop.isRangeEnable);
    const [handCombination, setHandCombination] = useState(prop.handCombination);

    useEffect(() => {
        setIsRangeEnable(prop.isRangeEnable);
    }, [prop.isRangeEnable]);
    useEffect(() => {
        setHandCombination(prop.handCombination);
    }, [prop.handCombination]);
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
        setCardHand(prop.hand);
    }, [prop.hand]);
    useEffect(() => {
        setPokerHandRankings(PokerHandRankingKeys);
    }, []);
    useEffect(() => {
        setIsCalculating(true);
        if (isRangeEnable) {
            // // Promiseを利用する処理
            // AsyncGetProbabilityHandFromRange(1000)
            //     .then((result) => {
            //         setIsCalculating(false);
            //     })
            //     .catch((error) => {
            //         console.log(`AsyncGetProbabilityHandFromRange Error: ${error}`);
            //     });
        } else {
            // Promiseを利用する処理
            AsyncGetProbabilityHand(1000)
                .then((result) => {
                    setIsCalculating(false);
                })
                .catch((error) => {
                    setIsCalculating(false);
                    // console.log(`Error: ${error}`);
                });
        }
    }, [deck, cardBoard, cardHand]);
    useEffect(() => {
        setIsCalculating(true);
        if (isRangeEnable) {
            // Promiseを利用する処理
            AsyncGetProbabilityHandFromRange(1000)
                .then((result) => {
                    setIsCalculating(false);
                })
                .catch((error) => {
                    console.log(`AsyncGetProbabilityHandFromRange Error: ${error}`);
                    setIsCalculating(false);
                });
        }
    }, [deck, cardBoard, cardHand, handCombination]);

    function AsyncGetProbabilityHandFromRange(timeout: number = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // TODO Combinationを渡されてレンジで実現可能な役の確立を求める
                setIsProbability(false);
                if (cardBoard == undefined || deck == undefined || handCombination == undefined) {
                    // console.log('HandProbability AsyncGetProbabilityHandFromRange', cardBoard, deck, handCombination);
                    reject('cardBoard or deck is undefined');
                    return;
                }

                // 未定のボードの枚数をカウントする
                var undefCount = 0;
                var board = [];
                for (let i = 0; i < cardBoard.length; i++) {
                    const element = cardBoard[i];
                    if (element === undefined) {
                        undefCount++;
                    } else {
                        board.push(element);
                    }
                }
                // deckから有効牌のみを取り出す
                var effective = [];
                for (let i = 0; i < deck?.deck.length; i++) {
                    const element = deck?.deck?.at(i);
                    if (element && element.enable) {
                        effective.push(element);
                    }
                }

                var counter = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
                const boardUndefCount = nCr(effective.length, undefCount);
                var combCount = boardUndefCount * handCombination.length;
                // console.log('HandProbability AsyncGetProbabilityHandFromRange', undefCount, effective.length, boardUndefCount, combCount, handCombination);
                if (undefCount > 0) {
                    // handCombination
                    const combination = combinations(effective, undefCount);
                    for (let i = 0; i < combination.length; i++) {
                        const element = combination[i];
                        var bTmp = [...board, ...element];
                        for (let j = 0; j < handCombination.length; j++) {
                            const handComb = handCombination[j];
                            // elementもhandCombそれぞれenablesから抽出しているので重複する可能性がある
                            var isDuplicate = false;
                            for (let k = 0; k < handComb.length; k++) {
                                const c1 = handComb[k];
                                for (let l = 0; l < bTmp.length; l++) {
                                    const c2 = bTmp[l];
                                    if (c1.num === c2.num && c1.suit === c2.suit) {
                                        isDuplicate = true;
                                    }
                                }
                            }
                            if (isDuplicate) {
                                // console.log('HandProbability AsyncGetProbabilityHandFromRange isDuplicate', isDuplicate);
                                combCount--;
                                continue;
                            }
                            var judge = JudgeHand(handComb, bTmp);
                            if (judge?.flag) {
                                var yaku: any = judge?.key;
                                const str: keyof typeof PokerHandRanking = yaku;
                                var rank = PokerHandRanking[str];
                                counter[rank] += 1;
                            }
                        }
                    }
                } else {
                    for (let j = 0; j < handCombination.length; j++) {
                        const handComb = handCombination[j];
                        var judge = JudgeHand(handComb, board);
                        if (judge?.flag) {
                            var yaku: any = judge?.key;
                            const str: keyof typeof PokerHandRanking = yaku;
                            var rank = PokerHandRanking[str];
                            counter[rank] += 1;
                        }
                    }
                }

                for (let i = 0; i < counter.length; i++) {
                    // const element = counter[i];
                    counter[i] = counter[i] * 100 / combCount;
                }
                // console.log('HandProbability AsyncGetProbabilityHandFromRange', combCount, counter);

                setProbability([...counter]);
                setIsProbability(true);
                resolve(counter);

                reject('EOF');
            }, timeout);
        });

    }

    // スレッド処理
    // https://zenn.dev/airiswim/articles/14d8a9e87503b6    
    function AsyncGetProbabilityHand(timeout: number = 1000) {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                setIsProbability(false);
                if (!cardBoard || !deck) {
                    reject('cardBoard or deck is undefined');
                    return;
                }

                // 未定のボードの枚数をカウントする
                var undefCount = 0;
                for (let i = 0; i < cardBoard.length; i++) {
                    const boardC = cardBoard[i];
                    if (boardC === undefined) {
                        undefCount++;
                    }
                }

                // hand側のundefCountもカウントする
                if (cardHand) {
                    for (let i = 0; i < cardHand.length; i++) {
                        const boardC = cardHand[i];
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
                    if (cardHand) {
                        for (let i = 0; i < cardHand.length; i++) {
                            const element = cardHand[i];
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
                    // if (prop.onCombinationChanged) {
                    //     prop.onCombinationChanged(comb);
                    // }
                    for (let i = 0; i < counter.length; i++) {
                        // const element = counter[i];
                        counter[i] = counter[i] * 100 / cc;
                    }
                    // console.log('GetProbabilityHand', cc, counter);
                    setProbability([...counter]);
                    setIsProbability(true);
                    resolve([...counter]);
                }
                reject('EOF');
            }, timeout);
        });
    }

    const GetCurrentHand = () => {
        var res = JudgeHand(cardHand, cardBoard);
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
                    <Typography margin={1} align="left">{'Winning %'}</Typography>
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