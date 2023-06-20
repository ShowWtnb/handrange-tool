import HandTable from '@/component/HandTable'
import ActionSelector from '@/component/ActionSelector'
import { Button, Grid, Typography } from '@mui/material'
import { useState } from 'react'
import { Actions, YokosawaHandRangeTier } from '@/const/const_poker'

export default function HandRangeToolHome() {
    const [tierRange1, setTierRange1] = useState([YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_1]);
    const [tierRange2, setTierRange2] = useState([YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_2]);
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
            <Grid container spacing={2} alignItems="center" justifyContent="center">
                <Grid item xs={12}>
                    <Grid container spacing={1}>
                        <Grid item xs={12} />
                        <Grid item xs={12}>
                            <ActionSelector eventHandler={handleActionChange} />
                        </Grid>
                        <Grid item xs={6}>
                            <HandTable tierRange={tierRange1} />
                        </Grid>
                        <Grid item xs={6}>
                            <HandTable tierRange={tierRange2} />
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item xs={2} >
                    <Typography >
                        {'参考動画：'}
                    </Typography>
                </Grid>
                <Grid item xs={10}>
                    <Button target="_blank" href="https://youtu.be/7vudIk1J_g0">【初公開】ヨコサワが実際に使っているハンドランキングがこちらです。</Button>
                </Grid>
            </Grid>
        </div>
    );
}