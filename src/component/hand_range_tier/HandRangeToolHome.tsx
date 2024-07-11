import HandTable from '@/component/hand_range_tier/HandTable'
import ActionSelector from '@/component/hand_range_tier/ActionSelector'
import { Button, Grid, Typography } from '@mui/material'
import { useEffect, useState } from 'react'
import { Actions, YokosawaHandRangeTier } from '@/const/const_poker'
import { useWindowSize } from '../utils/useWindowSize'
import { KuhnPoker } from '@/utils/counterfactual_regret_minimization/cfr'
import styles from './style.module.css'
const thresholdWidth = 1.5;

export default function HandRangeToolHome() {
    const [tierRange1, setTierRange1] = useState([YokosawaHandRangeTier.TIER_9, YokosawaHandRangeTier.TIER_1]);
    const [tierRange2, setTierRange2] = useState([YokosawaHandRangeTier.TIER_9, YokosawaHandRangeTier.TIER_2]);
    const [widthHandTable, setWidthHandTable] = useState(6);
    const [width, height] = useWindowSize();
    const [widthRatio, setWidthRatio] = useState(0.0);
    const [isVertical, setIsVertical] = useState(false);

    useEffect(() => {
        // console.log('HandRangeToolHome', width);
        if (width > 1400) {
            setWidthHandTable(6);
        } else {
            setWidthHandTable(12);
        }
        // const ratio = width / height;
        setWidthRatio(width / height)
        if (thresholdWidth < width / height) {
            setIsVertical(false);
        } else {
            setIsVertical(true);
        }
    }, [width, height])

    useEffect(() => {
        var kuhnPoker = new KuhnPoker();
        console.log('KuhnPoker', kuhnPoker.information_sets)
    }, [])

    const handleActionChange = (event: any) => {
        // console.log('Home handleActionChange', event);
        if (event.tier != undefined) {
            // 左はOpenしたTier以上全部
            var t: YokosawaHandRangeTier = event.tier;
            var isBB: boolean = event.isBB;
            if (isBB) {
                setTierRange1([t, YokosawaHandRangeTier.TIER_1]);
                if (event.action != undefined) {
                    // 右はOpenしたTierに対して
                    var t2: YokosawaHandRangeTier = t - 1 < 0 ? 0 : t - 1;
                    switch (event.action) {
                        case Actions.CALL:
                            if (t == YokosawaHandRangeTier.TIER_6) {
                                // BTN(TIER_6)からのレイズに対してはTIER_7以上でコールできる
                                setTierRange2([YokosawaHandRangeTier.TIER_7, YokosawaHandRangeTier.TIER_5]);
                            } else if (t == YokosawaHandRangeTier.TIER_5) {
                                // CO(TIER_5)からのレイズに対してはTIER_6以上でコールできる
                                setTierRange2([YokosawaHandRangeTier.TIER_6, YokosawaHandRangeTier.TIER_4]);
                            } else {
                                // どこからのレイズでもTIER_5以上でコールできる
                                setTierRange2([YokosawaHandRangeTier.TIER_5, t2]);
                            }
                            break;
                        case Actions.RERAISE:
                            // Raiseなら2つ上のTier以上全部
                            t2 = t2 - 1 < 0 ? 0 : t2 - 1;
                            // console.log('set range 2', [t2, YokosawaHandRangeTier.TIER_1]);
                            setTierRange2([t2, YokosawaHandRangeTier.TIER_1]);
                            break;
                        default:
                            break;
                    }
                }

            } else {
                setTierRange1([t, YokosawaHandRangeTier.TIER_1]);
                if (event.action != undefined) {
                    // 右はOpenしたTierに対して
                    var t2: YokosawaHandRangeTier = t - 1 < 0 ? 0 : t - 1;
                    switch (event.action) {
                        case Actions.CALL:
                            // Callならひとつ上のTier
                            // console.log('set range 2', [t2, t2]);
                            setTierRange2([t2, t2]);
                            break;
                        case Actions.RERAISE:
                            // Raiseなら2つ上のTier以上全部
                            t2 = t2 - 1 < 0 ? 0 : t2 - 1;
                            // console.log('set range 2', [t2, YokosawaHandRangeTier.TIER_1]);
                            setTierRange2([t2, YokosawaHandRangeTier.TIER_1]);
                            break;
                        default:
                            break;
                    }
                }
            }
        }
    }
    return (
        <div>
            {/* {widthRatio} */}
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} />
                        <Grid item xs={12}>
                            <ActionSelector eventHandler={handleActionChange} />
                        </Grid>
                        <Grid item xs={12}>
                            {isVertical ? (
                                <div className={styles.homeVertical} >
                                    {/* {widthRatio} */}
                                    <div className={styles.open}>
                                        <HandTable tierRange={tierRange1} title={'Opener'} />
                                    </div>
                                    <div className={styles.caller}>
                                        <HandTable tierRange={tierRange2} title={'Caller'} />
                                    </div>
                                </div>
                            ) : (
                                <div className={styles.homeHorizontal}>
                                    <div className={styles.open}>
                                        <HandTable tierRange={tierRange1} title={'Opener'} />
                                    </div>
                                    <div className={styles.caller}>
                                        <HandTable tierRange={tierRange2} title={'Caller'} />
                                    </div>
                                </div>
                            )}
                        </Grid>

                    </Grid>
                </Grid>
                <Grid item xs='auto' >
                    <Typography >
                        {'参考動画：'}
                    </Typography>
                </Grid>
                <Grid item xs='auto' alignItems='left' textAlign='left'>
                    <Button target="_blank" href="https://youtu.be/7vudIk1J_g0">【初公開】ヨコサワが実際に使っているハンドランキングがこちらです。</Button>
                </Grid>
            </Grid>
        </div>
    );
}