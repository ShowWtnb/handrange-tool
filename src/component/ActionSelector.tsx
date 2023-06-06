import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { Actions, YokosawaHandRangeTier } from '@/const/const';
import { Box, Checkbox, FormControlLabel } from '@mui/material';
import { alignProperty } from '@mui/material/styles/cssUtils';
// import { createStyles, makeStyles } from "@mui/styles";

class PropActionSelector {
    eventHandler: ((event: propsEventHandler) => void) | undefined;
}
class propsEventHandler {
    tier: YokosawaHandRangeTier;
    action: Actions;
    isBB: boolean;
    // constructor(tier: YokosawaHandRangeTier, action: Actions) {
    //     this.tier = tier;
    //     this.action = action;
    // }
    constructor(tier: YokosawaHandRangeTier, action: Actions, isBB: boolean) {
        this.tier = tier;
        this.action = action;
        this.isBB = isBB;
    }
}

// // スタイルを定義
// const handCellStyles = makeStyles(() =>
//     createStyles({
//         tier1Cell: {
//             justifyContent: "center",
//             backgroundColor: '#191970'
//         },
//         tier2Cell: {
//             justifyContent: "center",
//             backgroundColor: '#FF0000'
//         },
//         tier3Cell: {
//             justifyContent: "center",
//             color: '#000000',
//             backgroundColor: '#FFD700'
//         },
//         tier4Cell: {
//             justifyContent: "center",
//             backgroundColor: '#228B22'
//         },
//         tier5Cell: {
//             justifyContent: "center",
//             color: '#000000',
//             backgroundColor: '#1E90FF'
//         },
//         tier6Cell: {
//             justifyContent: "center",
//             color: '#000000',
//             backgroundColor: '#FFFFFF'
//         },
//         tier7Cell: {
//             justifyContent: "center",
//             color: '#000000',
//             backgroundColor: '#D8BFD8'
//         },
//         tier8Cell: {
//             justifyContent: "center",
//             color: '#000000',
//             backgroundColor: '#696969'
//         },
//         select: {
//             justifyContent: "center",
//         },
//     }),
// );

export default function ActionSelector(prop: PropActionSelector) {
    // const styles = handCellStyles();
    const [tier, setTier] = useState<YokosawaHandRangeTier>(YokosawaHandRangeTier.TIER_7);
    const [action, setAction] = useState<Actions>(Actions.CALL);
    const [selectStyle, setSelectStyle] = useState('');
    const [selectActionStyle, setSelectActionStyle] = useState('');
    const [isBB, setIsBB] = useState(false);

    const callback = (t: any, a: any, b?: boolean) => {
        const strT: keyof typeof YokosawaHandRangeTier = t;
        t = YokosawaHandRangeTier[strT];
        const strA: keyof typeof Actions = a;
        a = Actions[strA];

        if (b == undefined) {
            b = isBB;
        }

        var arg: propsEventHandler = new propsEventHandler(t, a, b);
        // console.log('ActionSelector callback', arg);
        if (prop.eventHandler != undefined) {
            prop.eventHandler(arg);
        }
    }

    const handleChange = (event: any) => {
        // console.log(event.target);
        const str: keyof typeof YokosawaHandRangeTier = event.target.value;
        setTier(event.target.value);
        callback(str, action);
        // callback(YokosawaHandRangeTier[str], action);
    };

    const handleActionChange = (event: any) => {
        // console.log(event.target);
        setAction(event.target.value);
        const str: keyof typeof Actions = event.target.value;
        callback(tier, str);
    }

    const onBBCheckBoxChanged = (event: any) => {
        // console.log(event.target.checked);
        setIsBB((event.target.checked as boolean));
        callback(tier, action, (event.target.checked as boolean));
    }

    const keys = Object.keys(YokosawaHandRangeTier).filter((v) => isNaN(Number(v)));
    const actions = Object.keys(Actions).filter((v) => isNaN(Number(v)));
    // console.log(keys);  // [A,B,C]
    const red = '#FF0000';
    const label = { inputProps: { 'aria-label': 'BB' } };
    return (
        <div>
            <Grid container spacing={1}>
                <Grid item xs={6}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Open</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={tier}
                            label="Open"
                            className={selectStyle}
                            onChange={handleChange}
                        >
                            {keys.map((c: string) => {
                                switch (c) {
                                    case 'TIER_1':
                                        return <MenuItem value={c} sx={{ background: '#191970' }}>{c}</MenuItem>
                                    case 'TIER_2':
                                        return <MenuItem value={c} sx={{ background: '#FF0000' }}>{c}</MenuItem>
                                    case 'TIER_3':
                                        return <MenuItem value={c} sx={{ background: '#FFD700', color: '#000000' }}>{c}</MenuItem>
                                    case 'TIER_4':
                                        return <MenuItem value={c} sx={{ background: '#228B22' }}>{c}</MenuItem>
                                    case 'TIER_5':
                                        return <MenuItem value={c} sx={{ background: '#1E90FF' }}>{c}</MenuItem>
                                    case 'TIER_6':
                                        return <MenuItem value={c} sx={{ background: '#FFFFFF', color: '#000000' }}>{c}</MenuItem>
                                    case 'TIER_7':
                                        return <MenuItem value={c} sx={{ background: '#D8BFD8', color: '#000000' }}>{c}</MenuItem>
                                    case 'TIER_8':
                                        return <MenuItem value={c} sx={{ background: '#696969', color: '#000000' }}>{c}</MenuItem>
                                    default:
                                        return <MenuItem value={c} sx={{ background: '#696969', color: '#000000' }}>{c}</MenuItem>
                                }
                            })}
                        </Select>
                    </FormControl>

                </Grid>
                <Grid item xs={6}>
                    <Grid container spacing={1} alignItems="center" justifyContent="center">
                        <Grid item xs={6}>
                            <Box >
                                <FormControlLabel
                                    label="BB"
                                    control={
                                        <Checkbox checked={isBB} onChange={onBBCheckBoxChanged} />
                                    }
                                />
                            </Box>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <InputLabel id="demo-simple-select-label">Action</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={action}
                                    label="Open"
                                    className={selectActionStyle}
                                    onChange={handleActionChange}
                                >
                                    {actions.map((c: string) => {
                                        return <MenuItem value={c} >{c}</MenuItem>
                                    })}
                                </Select>
                            </FormControl>
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    );
}