import licenseFile from '../../licenses.json'
import { Box, Button, Card, CardActions, CardContent, CardHeader, Collapse, Divider, Grid, IconButton, IconButtonProps, Modal, Tooltip, Typography } from '@mui/material'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { MoreVert, Terminal } from '@mui/icons-material';
import { theme } from '@/const/theme/theme';
import { ReactMarkdown } from 'react-markdown/lib/react-markdown';
const markdownString = `
# Poker Tools

## Overview
このツールは[ヨコサワポーカーチャンネル](https://www.youtube.com/@yokosawa_poker)の解説動画をもとに動画の内容を解釈し、個人的な利用を目的に作成したものです

THIS TOOL IS ONLY BASED ON THE CONTENT OF THE [ヨコサワポーカーチャンネル](https://www.youtube.com/@yokosawa_poker)'s VIDEO.

## Notice
ゲーム理論およびGTOなどの理論に基づいた計算は行っておりません

ツールの出力結果の正確性は保証されません。また、このツールを利用したことによって生じたいかなる損害についても補償されません

 THIS TOOL IS NOT BASED ON GAME THEORY OR ANY OTHER MATHEMATICAL THEORY.
 
THE SOFTWARE IS MADE BY INDIVIDUAL AUTHORS, WHO ARE IN NO WAY AFFILIATED WITH 世界のヨコサワ(Masato "World Wide" Yokosawa) or 株式会社POKER ROOM(POKER ROOM Inc.).

THE SOFTWARE IS PROVIDED “AS IS”, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
`;
// https://chaika.hatenablog.com/entry/2020/07/12/083000
const backN2br = (msg?: string) => {
    if (msg) {
        const texts = msg.split("\n").map((item, index) => {
            // <></> は key を設定できないので、<React.Fragment /> を使う
            return (
                <React.Fragment key={index}>{item}<br /></React.Fragment>
            );
        });
        return <div>{texts}</div>;
    }
}

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
    overflow: 'auto',
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
    private?: boolean
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

interface LicenseScreenProps {
    readme?: boolean
    handleClose: any
    open: boolean
}

export const LicenseScreen = (prop: LicenseScreenProps) => {
    const [expanded, setExpanded] = useState(false);
    const [readme, setReadMe] = useState(false);
    useEffect(() => {
        if (prop.readme) {
            setReadMe(prop.readme);
        }
    }, [prop.readme])
    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const licenseKeys = Object.keys(licenseFile);
    // const licenseVal = licenseFile.toString();
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

    const GetThisAppLicense = () => {
        const value = 'handrange-tool@0.1.0';
        const licenseObj: License = licenseFile[value as keyof typeof licenseFile];

        const license = licenseObj.licenses;
        const publisher = licenseObj.publisher;
        const licenseText = licenseObj.licenseText;
        const copyright = licenseObj.copyright;
        const repository = licenseObj.repository;
        const url = licenseObj.url;
        const color = theme.palette.primary;
        // console.log('LicenseScreen', color);
        return (
            <Grid item margin={0.5} xs={12}>
                <Card sx={{ maxWidth: style.width }} style={{ backgroundColor: color.dark }}>
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="div">
                            {'Poker Tools @0.1.0'}
                        </Typography>
                        {GetLinkButton(url, copyright)}
                    </CardContent>
                    <CardActions disableSpacing>
                        <Tooltip title="Open repository">
                            <IconButton aria-label="open repository" onClick={() => { window.open('https://github.com/ShowWtnb/handrange-tool.git', '_blank'); }}>
                                <Terminal />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="body2" color="text.secondary">MIT License</Typography>
                        <ExpandMore expand={expanded} onClick={handleExpandClick} aria-expanded={expanded} aria-label="show more"                                            >
                            <ExpandMoreIcon />
                        </ExpandMore>
                    </CardActions>
                    <Collapse in={expanded} timeout="auto" unmountOnExit>
                        <CardContent>
                            <Typography paragraph>{backN2br(licenseText)}</Typography>
                            <Typography paragraph>{copyright}</Typography>
                        </CardContent>
                    </Collapse>
                </Card>
            </Grid>
        );
    }
    // console.log('LicenseScreen', readme)
    if (readme) {
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
                            <div>
                                <Grid item margin={0.5} xs={12}>
                                    <ReactMarkdown >
                                        {markdownString}
                                    </ReactMarkdown>
                                </Grid>
                                {GetThisAppLicense()}
                            </div>
                        </Grid>
                    </div>
                </Box>
            </Modal>
        );

    } else {
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
                            <div>
                                {licenseKeys.map((value) => {
                                    // https://qiita.com/hisashisatake@github/items/0ed17b1f6b2c0108be59
                                    const licenseObj: License = licenseFile[value as keyof typeof licenseFile];
                                    // console.log('LicenseScreen licenseVal', licenseObj);
                                    // if(!licenseObj){
                                    //     continue;
                                    // }
                                    if (licenseObj.private) {
                                        // console.log('LicenseScreen', value, licenseObj);
                                        return (<div key={value} />);
                                    }
                                    const license = licenseObj.licenses;
                                    const publisher = licenseObj.publisher;
                                    const licenseText = licenseObj.licenseText;
                                    const copyright = licenseObj.copyright;
                                    const repository = licenseObj.repository;
                                    const url = licenseObj.url;
                                    return (
                                        <Grid item key={value} margin={0.5} xs={12}>
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
                                                        <Typography paragraph>{backN2br(licenseText)}</Typography>
                                                        <Typography paragraph>{copyright}</Typography>
                                                    </CardContent>
                                                </Collapse>
                                            </Card>
                                            {/* <Divider /> */}
                                        </Grid>
                                    )
                                })}
                            </div>
                        </Grid>
                    </div>
                </Box>
            </Modal>
        );
    }
}
