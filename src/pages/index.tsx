import Head from 'next/head'
import HandRangeToolHome from '@/component/HandRangeToolHome'
import { AppBar, BottomNavigation, BottomNavigationAction, Button, Drawer, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, Paper, Tab, Tabs, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react';
import { a11yProps as allyProps } from '@/component/utils/a11yProps';
import { TabPanel } from '@/component/utils/TabPanel';
import PowerNumberChartHome from '@/component/power_number/PowerNumberChartHome';
import OddsCalculatorHome from '@/component/odds_calculator/OddsCalculatorHome';
import { ContentPaste, Copyright, Favorite, FormatListBulleted, GppMaybe, Info, Lightbulb, LocationOn, Menu, MenuOpen, Policy, PrivacyTip, Restore, Shuffle } from '@mui/icons-material';
import { LicenseScreen } from '@/component/utils/LicenseViewer';

export default function Home() {
  const [value, setValue] = useState(0);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [LicenseScreenOpened, setLicenseScreenOpened] = useState(false);
  const [ReadMeScreenOpened, setReadMeScreenOpened] = useState(false);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  function onHamburgerClicked(event: any): void {
    setDrawerOpened(!drawerOpened);
  }
  function onLicenseClicked(event: any): void {
    // setDrawerOpened(!drawerOpened);
    setLicenseScreenOpened(true);
  }
  function onLicenseClose(): void {
    // setDrawerOpened(!drawerOpened);
    setLicenseScreenOpened(false);
  }
  function onReadMeClicked(event: any): void {
    // setDrawerOpened(!drawerOpened);
    setReadMeScreenOpened(true);
  }
  function onReadMeClose(): void {
    // setDrawerOpened(!drawerOpened);
    setReadMeScreenOpened(false);
  }
  function onDisclaimerClicked(event: any): void {
    // setDrawerOpened(!drawerOpened);
    setLicenseScreenOpened(true);
  }
  function onDisclaimerClose(): void {
    // setDrawerOpened(!drawerOpened);
    setLicenseScreenOpened(false);
  }

  return (
    <div>
      <Head>
        <title>Poker Tools</title>
        <meta name="description" content="Simplified hand range chart of no-limit hold'em" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Grid container spacing={0.5} alignItems="center" justifyContent="left">
          <Grid item >
            <IconButton aria-label="shuffleBoard" onClick={onHamburgerClicked}>
              <Menu />
            </IconButton>
          </Grid>
          <Grid item>
            <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Hand Range chart" {...allyProps(0)} />
              <Tab label="Power Number chart" {...allyProps(1)} />
              <Tab label="Odds calculator" {...allyProps(2)} />
            </Tabs>
          </Grid>
        </Grid>
      </AppBar>
      <TabPanel value={value} index={0}>
        <HandRangeToolHome />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PowerNumberChartHome />
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OddsCalculatorHome />
      </TabPanel>

      {/* ハンバーガーメニュー */}
      <Drawer
        anchor={'left'}
        open={drawerOpened}
        onClose={() => setDrawerOpened(false)}>
        <AppBar position="static">
          <IconButton aria-label="shuffleBoard" onClick={onHamburgerClicked}>
            <MenuOpen />
          </IconButton>
        </AppBar>
        {/* <MenuItem onClick={onDisclaimerClicked}>
          <ListItemIcon>
            <Policy fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Disclaimer</ListItemText>
          <Typography variant="body2" color="text.secondary">{''}</Typography>
        </MenuItem> */}
        <MenuItem onClick={onReadMeClicked}>
          <ListItemIcon>
            <Lightbulb fontSize="medium" />
          </ListItemIcon>
          <ListItemText>About Tool</ListItemText>
          <Typography variant="body2" color="text.secondary">{''}</Typography>
        </MenuItem>
        <MenuItem onClick={onLicenseClicked}>
          <ListItemIcon>
            <PrivacyTip fontSize="medium" />
          </ListItemIcon>
          <ListItemText>Licenses</ListItemText>
          <Typography variant="body2" color="text.secondary">{''}</Typography>
        </MenuItem>
      </Drawer>
      <LicenseScreen readme={true} open={ReadMeScreenOpened} handleClose={onReadMeClose} />
      <LicenseScreen open={LicenseScreenOpened} handleClose={onLicenseClose} />
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <Typography align='center' variant="body2" color="text.secondary">Copyright (c) 2023 ShowWtnb</Typography>
        <Typography align='center' variant="body2" color="text.secondary">This Software is in no way affiliated with 世界のヨコサワ or 株式会社POKER ROOM.</Typography>
      </Paper>
    </div>
  )
}
