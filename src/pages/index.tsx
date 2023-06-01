import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import HandTable from '@/component/HandTable'
import ActionSelector from '@/component/ActionSelector'
import { Grid } from '@mui/material'
import { useState } from 'react'
import { Actions, YokosawaHandRangeTier } from '@/const/const'

const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  const [tierRange1, setTierRange1] = useState([YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_1]);
  const [tierRange2, setTierRange2] = useState([YokosawaHandRangeTier.TIER_8, YokosawaHandRangeTier.TIER_2]);
  const handleActionChange = (event: any) => {
    // console.log('Home handleActionChange', event);
    if (event.tier != undefined) {
      // 左はOpenしたTier以上全部
      var t: YokosawaHandRangeTier = event.tier;
      // console.log('set range 1', [t, YokosawaHandRangeTier.TIER_1]);
      setTierRange1([t, YokosawaHandRangeTier.TIER_1])
      if (event.action != undefined) {
        // 右はOpenしたTierに対して
        var t2 :YokosawaHandRangeTier = t - 1 < 0 ? 0 : t - 1;
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
  return (
    <div>
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
    </div>
  )
}
