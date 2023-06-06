import Head from 'next/head'
import HandRangeToolHome from '@/component/HandRangeToolHome'
import { Button, Grid, Typography } from '@mui/material'

export default function Home() {
  return (
    <div>
      <Head>
        <title>Hand Range</title>
        <meta name="description" content="Simplified hand range chart of no-limit hold'em" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        <Grid item xs={12}>
          <HandRangeToolHome />
        </Grid>
        <Grid item xs={2} >
          <Typography >
            {'参考動画：'}
          </Typography>
        </Grid>
        <Grid item xs={8}>
          {/* <iframe width="560" height="315" src="https://www.youtube.com/embed/7vudIk1J_g0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe> */}
        <Button target="_blank" href="https://youtu.be/7vudIk1J_g0">【初公開】ヨコサワが実際に使っているハンドランキングがこちらです。</Button>
        </Grid>
        <Grid item xs={2}/>
      </Grid>
    </div>
  )
}
