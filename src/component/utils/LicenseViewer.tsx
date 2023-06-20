import { Box, Divider, Grid, Modal, Typography } from '@mui/material'
import licenseFile from '../../licenses.json'

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

type License = {
    licenses?: string
    repository?: string
    publisher?: string
    url?: string
    path?: string
    licenseFile?: string
    licenseText?: string
    copyright?: string
}

type LicenseInfos = {
    licenses: Map<string, License>
}

export const LicenseScreen = (prop: any) => {
    const licenseKeys = Object.keys(licenseFile);
    const licenseVal = licenseFile.toString();
    console.log('LicenseScreen licenseVal', licenseVal);

    function handleClose(event: {}, reason: "backdropClick" | "escapeKeyDown"): void {
        // event
        prop.handleClose(event, reason);
    }

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
                            const licenseObj: License = licenseFile[value as keyof typeof licenseFile];
                            console.log('LicenseScreen licenseVal', licenseObj);
                            // if(!licenseObj){
                            //     continue;
                            // }
                            const license = licenseObj.licenses
                            const publisher = licenseObj.publisher
                            const licenseText = licenseObj.licenseText
                            const copyright = licenseObj.copyright
                            return (
                                <div>
                                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                                        <Grid item xs={12}>
                                            <Typography>{value} published by {publisher}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{licenseText}</Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Typography>{copyright}</Typography>
                                        </Grid>
                                    </Grid>
                                    <Divider />
                                </div>
                            )
                        })}
                    </Grid>
                </div>
            </Box>
        </Modal>
    )
}
