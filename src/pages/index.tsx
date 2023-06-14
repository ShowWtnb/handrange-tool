import Head from 'next/head'
import HandRangeToolHome from '@/component/HandRangeToolHome'
import { AppBar, Button, Grid, Tab, Tabs, Typography } from '@mui/material'
import { useState } from 'react';
import { a11yProps } from '@/component/utils/a11yProps';
import { TabPanel } from '@/component/utils/TabPanel';
import PowerNumberChartHome from '@/component/power_number/PowerNumberChartHome';

export default function Home() {
  const [value, setValue] = useState(0);
  const handleChange = (event: any, newValue: any) => {
    setValue(newValue);
  };

  return (
    <div>
      <Head>
        <title>Hand Range</title>
        <meta name="description" content="Simplified hand range chart of no-limit hold'em" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>
      <AppBar position="static">
        <Tabs value={value} onChange={handleChange} aria-label="simple tabs example">
          <Tab label="Hand Range chart" {...a11yProps(0)} />
          <Tab label="Power Number chart" {...a11yProps(1)} />
          <Tab label="Item Three" {...a11yProps(2)} />
        </Tabs>
      </AppBar>
      <TabPanel value={value} index={0}>
        <HandRangeToolHome />
      </TabPanel>
      <TabPanel value={value} index={1}>
        <PowerNumberChartHome />
      </TabPanel>
      {/* <TabPanel value={value} index={2}>
        Item Three
      </TabPanel> */}

    </div>
  )
}
