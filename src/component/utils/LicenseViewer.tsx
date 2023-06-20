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

export const LicenseScreen = (prop: any) => {
    const licenseKeys = Object.keys(licenseFile);

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
                            const license = licenseFile[value].licenses
                            const publisher = licenseFile[value].publisher
                            const licenseText = licenseFile[value].licenseText
                            const copyright = licenseFile[value].copyright
                            return (
                                <div>
                                    <Grid container spacing={0} alignItems="center" justifyContent="center">
                                        <Grid item xs={4}>
                                            <Typography>{value} published by {publisher}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
                                            <Typography>{licenseText}</Typography>
                                        </Grid>
                                        <Grid item xs={4}>
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
