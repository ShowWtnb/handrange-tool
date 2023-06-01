import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import { Actions, YokosawaHandRangeTier } from '@/const/const';
import { createStyles, makeStyles } from "@mui/styles";

class PropActionSelector {
    eventHandler: ((event: propsEventHandler) => void) | undefined;
}
class propsEventHandler {
    tier: YokosawaHandRangeTier;
    action: Actions;
    constructor(tier: YokosawaHandRangeTier, action: Actions) {
        this.tier = tier;
        this.action = action;
    }
}

// スタイルを定義
const handCellStyles = makeStyles(() =>
    createStyles({
        tier1Cell: {
            justifyContent: "center",
            backgroundColor: '#191970'
        },
        tier2Cell: {
            justifyContent: "center",
            backgroundColor: '#FF0000'
        },
        tier3Cell: {
            justifyContent: "center",
            color: '#000000',
            backgroundColor: '#FFD700'
        },
        tier4Cell: {
            justifyContent: "center",
            backgroundColor: '#228B22'
        },
        tier5Cell: {
            justifyContent: "center",
            color: '#000000',
            backgroundColor: '#1E90FF'
        },
        tier6Cell: {
            justifyContent: "center",
            color: '#000000',
            backgroundColor: '#FFFFFF'
        },
        tier7Cell: {
            justifyContent: "center",
            color: '#000000',
            backgroundColor: '#D8BFD8'
        },
        tier8Cell: {
            justifyContent: "center",
            color: '#000000',
            backgroundColor: '#696969'
        },
        select: {
            justifyContent: "center",
        },
    }),
);

export default function ActionSelector(prop: PropActionSelector) {
    const styles = handCellStyles();
    const [tier, setTier] = useState<YokosawaHandRangeTier>(YokosawaHandRangeTier.TIER_7);
    const [action, setAction] = useState<Actions>(Actions.CALL);
    const [selectStyle, setSelectStyle] = useState('');
    const [selectActionStyle, setSelectActionStyle] = useState('');

    const callback = (t:any, a:any) => {
        const strT: keyof typeof YokosawaHandRangeTier = t;
        t = YokosawaHandRangeTier[strT];
        const strA: keyof typeof Actions = a;
        a = Actions[strA];

        var arg:propsEventHandler =  new propsEventHandler(t, a);
        // console.log('ActionSelector callback', arg);
        if (prop.eventHandler != undefined) {
            prop.eventHandler(arg);
        }
    }

    const handleChange = (event: any) => {
        // console.log(event.target);
        const str: keyof typeof YokosawaHandRangeTier = event.target.value;
        setTier(event.target.value);
        // console.log('ActionSelector handleChange', tier);
        switch (YokosawaHandRangeTier[str]) {
            case YokosawaHandRangeTier.TIER_1:
                setSelectStyle(styles.tier1Cell);
                break;
            case YokosawaHandRangeTier.TIER_2:
                setSelectStyle(styles.tier2Cell);
                break;
            case YokosawaHandRangeTier.TIER_3:
                setSelectStyle(styles.tier3Cell);
                break;
            case YokosawaHandRangeTier.TIER_4:
                setSelectStyle(styles.tier4Cell);
                break;
            case YokosawaHandRangeTier.TIER_5:
                setSelectStyle(styles.tier5Cell);
                break;
            case YokosawaHandRangeTier.TIER_6:
                setSelectStyle(styles.tier6Cell);
                break;
            case YokosawaHandRangeTier.TIER_7:
                setSelectStyle(styles.tier7Cell);
                break;
            case YokosawaHandRangeTier.TIER_8:
                setSelectStyle(styles.tier8Cell);
                break;
            default:
                setSelectStyle(styles.tier8Cell);
                break;
        }
        callback(str, action);
        // callback(YokosawaHandRangeTier[str], action);
    };

    const handleActionChange = (event: any) => {
        // console.log(event.target);
        setAction(event.target.value);
        const str: keyof typeof Actions = event.target.value;
        callback(tier, str);
        // callback(tier, Actions[str]);
        // switch (event.target.value) {
        //     case 'CALL':
        //         // setSelectActionStyle();
        //         // prop.eventHandler({ tier: tier, action: Actions.CALL });
        //         callback(new propsEventHandler(tier, Actions.CALL));
        //         break;
        //     case 'RERAISE':
        //         // setSelectActionStyle();
        //         // prop.eventHandler({ tier: tier, action: Actions.RERAISE });
        //         callback(new propsEventHandler(tier, Actions.RERAISE));
        //         break;
        //     default:
        //         break;
        // }
    }
    const keys = Object.keys(YokosawaHandRangeTier).filter((v) => isNaN(Number(v)));
    const actions = Object.keys(Actions).filter((v) => isNaN(Number(v)));
    // console.log(keys);  // [A,B,C]

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
                                        return <MenuItem value={c} className={styles.tier1Cell}>{c}</MenuItem>
                                    case 'TIER_2':
                                        return <MenuItem value={c} className={styles.tier2Cell}>{c}</MenuItem>
                                    case 'TIER_3':
                                        return <MenuItem value={c} className={styles.tier3Cell}>{c}</MenuItem>
                                    case 'TIER_4':
                                        return <MenuItem value={c} className={styles.tier4Cell}>{c}</MenuItem>
                                    case 'TIER_5':
                                        return <MenuItem value={c} className={styles.tier5Cell}>{c}</MenuItem>
                                    case 'TIER_6':
                                        return <MenuItem value={c} className={styles.tier6Cell}>{c}</MenuItem>
                                    case 'TIER_7':
                                        return <MenuItem value={c} className={styles.tier7Cell}>{c}</MenuItem>
                                    case 'TIER_8':
                                        return <MenuItem value={c} className={styles.tier8Cell}>{c}</MenuItem>
                                    default:
                                        return <MenuItem value={c} className={styles.tier8Cell}>{c}</MenuItem>
                                }
                            })}
                        </Select>
                    </FormControl>

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
                                return <MenuItem value={c} className={styles.select}>{c}</MenuItem>
                            })}
                        </Select>
                    </FormControl>
                </Grid>
            </Grid>
        </div>
    );
}