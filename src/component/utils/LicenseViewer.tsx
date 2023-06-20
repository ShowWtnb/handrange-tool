import licenseFile from '../../licenses.json'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, IconButtonProps, Modal, Tooltip, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useState } from 'react';
import { styled } from '@mui/material/styles';
import { MoreVert, Terminal } from '@mui/icons-material';
// import node from '../../../node_modules/@babel/code-frame/LICENSE'

const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 450,
    height: 600,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    overflow: 'scroll',
};

interface ExpandMoreProps extends IconButtonProps {
    expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', {
        duration: theme.transitions.duration.shortest,
    }),
}));

type License = {
    licenses?: string[] | string
    repository?: string
    publisher?: string
    url?: string
    errno?: number
    syscall?: string
    code?: string
    path?: string
    licenseFile?: string
    licenseText?: string
    copyright?: string
}

type LicenseInfos = {
    licenses: Map<string, License>
}

export const LicenseScreen = (prop: any) => {
    const [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const licenseKeys = Object.keys(licenseFile);
    const licenseVal = licenseFile.toString();
    // console.log('LicenseScreen licenseVal', licenseVal);

    function handleClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void {
        // event
        prop.handleClose(event, reason);
    }

    const GetLinkButton = (link?: string, str?: string) => {
        if (link != undefined) {
            return (<Button target="_blank" href={link}>{str}</Button>);
        } else {
            return (str);
        }
    }
    const GetLicenseFile = (path?: string) => {
        // var reader = require('any-text');
    
        // reader.getText('../../licenses.json')
        // .then(function (data:any) {
        //     console.log('LicenseScreen GetLicenseFile', data);
        // });
        if (path != undefined) {
            return (
            <Typography variant="body2" color="text.secondary">
                {path}
            </Typography>);
        } else {
            return (<div />);
        }
    }
    // https://mui.com/material-ui/react-card/
    return (
        <Modal
            open={prop.open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
        >
            <Box sx={style}>
                <div>
                    <Grid margin={0} container spacing={0} alignItems="center" justifyContent="center">
                        {licenseKeys.map((value) => {
                            // https://qiita.com/hisashisatake@github/items/0ed17b1f6b2c0108be59
                            const licenseObj: License = licenseFile[value as keyof typeof licenseFile];
                            // console.log('LicenseScreen licenseVal', licenseObj);
                            // if(!licenseObj){
                            //     continue;
                            // }
                            const license = licenseObj.licenses;
                            const publisher = licenseObj.publisher;
                            const licenseText = licenseObj.licenseText;
                            const copyright = licenseObj.copyright;
                            const repository = licenseObj.repository;
                            const url = licenseObj.url;
                            return (
                                <Grid item xs={12}>
                                    <Card sx={{ maxWidth: style.width }}>
                                        {/* <CardHeader
                                            // avatar={
                                            //   <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
                                            //     R
                                            //   </Avatar>
                                            // }
                                            action={
                                                <IconButton aria-label="settings">
                                                    <MoreVert />
                                                </IconButton>
                                            }
                                            title={value}
                                            subheader={GetLinkButton(url, publisher)}
                                        /> */}
                                        {/* <CardMedia
                                    component="img"
                                    height="194"
                                    image="/static/images/cards/paella.jpg"
                                    alt="Paella dish"
                                  /> */}
                                        <CardContent>
                                            <Typography gutterBottom variant="h5" component="div">
                                                {value}
                                            </Typography>
                                            {GetLinkButton(url, publisher)}
                                            {/* {GetLinkButton(repository, 'repository')} */}
                                            {/* {GetLinkButton(url, 'URL')} */}
                                        </CardContent>
                                        <CardActions disableSpacing>
                                            <Tooltip title="Open repository">
                                                <IconButton aria-label="open repository" onClick={() => { window.open(repository, '_blank'); }}>
                                                    <Terminal />
                                                </IconButton>
                                            </Tooltip>
                                            {/* TODO licenseは配列の場合と単体の場合がある。配列の場合だけスペース区切りにしたい */}
                                            <Typography variant="body2" color="text.secondary">{license} License</Typography>
                                            {/* <IconButton aria-label="share">
                                                    <ShareIcon />
                                                </IconButton> */}
                                            <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more"                                            >
                                                <ExpandMoreIcon />
                                            </ExpandMore>
                                        </CardActions>
                                        <Collapse in={expanded} timeout="auto" unmountOnExit>
                                            <CardContent>
                                                {/* {GetLicenseFile(licenseObj.licenseFile)} */}
                                                <Typography paragraph>{licenseText}</Typography>
                                                <Typography paragraph>{copyright}</Typography>
                                            </CardContent>
                                        </Collapse>
                                    </Card>
                                    {/* <Divider /> */}
                                </Grid>
                            )
                        })}
                    </Grid>
                </div>
            </Box>
        </Modal>
    )
}
