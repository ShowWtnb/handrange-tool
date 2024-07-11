import Head from 'next/head'
import HandRangeToolHome from '@/component/hand_range_tier/HandRangeToolHome'
import { AppBar, BottomNavigation, BottomNavigationAction, Button, Drawer, Grid, IconButton, ListItemIcon, ListItemText, MenuItem, Paper, Tab, Tabs, Typography } from '@mui/material'
import { MouseEvent, useState } from 'react';
import { a11yProps as allyProps } from '@/component/utils/a11yProps';
import { TabPanel } from '@/component/utils/TabPanel';
import PowerNumberChartHome from '@/component/power_number/PowerNumberChartHome';
import OddsCalculatorHome from '@/component/odds_calculator/OddsCalculatorHome';
import { ContentPaste, Copyright, Favorite, FormatListBulleted, GppMaybe, Info, Lightbulb, LocationOn, Menu, MenuOpen, Policy, PrivacyTip, Restore, Shuffle } from '@mui/icons-material';
import { LicenseScreen } from '@/component/utils/LicenseViewer';
import PokerTable from './poker_table/PokerTable';
import Pre_FlopTrainer from './pre-flop_trainer/Pre-FlopTrainer';

export default function HomeComponent() {
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
      <AppBar position="static">
        <Grid container spacing={0} alignItems="center" justifyContent="left">
          <Grid item xs={1}>
            <IconButton aria-label="shuffleBoard" onClick={onHamburgerClicked}>
              <Menu />
            </IconButton>
          </Grid>
          <Grid item xs={11}>
            <Tabs variant="scrollable" scrollButtons allowScrollButtonsMobile value={value} onChange={handleChange} aria-label="simple tabs example">
              <Tab label="Hand Range chart" {...allyProps(0)} />
              <Tab label="Power Number chart" {...allyProps(1)} />
              <Tab label="Odds calculator" {...allyProps(2)} />
              <Tab label="Poker Table" {...allyProps(3)} />
              <Tab label="Pre-Flop Trainer" {...allyProps(4)} />
            </Tabs>
          </Grid>
        </Grid>
      </AppBar>
      <TabPanel value={value} index={0}>
        <HandRangeToolHome />
        {/* <div style={{ height: 20 }}></div> */}
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PowerNumberChartHome />
        {/* <div style={{ height: 20 }}></div> */}
      </TabPanel>
      <TabPanel value={value} index={2}>
        <OddsCalculatorHome />
        {/* <div style={{ height: 20 }}></div> */}
      </TabPanel>
      <TabPanel value={value} index={3}>
        {/* <PokerTable styles={{ 'fontColor': 'red' }} /> */}
        {/* <div style={{ height: 20 }}></div> */}
      </TabPanel>
      <TabPanel value={value} index={4}>
        <Pre_FlopTrainer />
        {/* <div style={{ height: 20 }}></div> */}
      </TabPanel>
      <div style={{ height: 20 }}></div>

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
      {/* <AppBar component="footer" position="static" sx={{ backgroundColor: '#000000' }}> */}
      <Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0 }} elevation={3}>
        <Typography align='center' variant="body2" color="text.secondary">Copyright (c) 2023 ShowWtnb</Typography>
        <Typography align='center' variant="body2" color="text.secondary">This Software is in no way affiliated with 世界のヨコサワ or 株式会社POKER ROOM.</Typography>
      </Paper>
      {/* </AppBar> */}

    </div>
  )
}
