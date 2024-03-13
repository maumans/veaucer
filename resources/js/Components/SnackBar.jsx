import * as React from 'react';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import {router} from "@inertiajs/react";


const Alert = React.forwardRef(function Alert(props, ref) {
    return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});

export default function SnackBar(props) {
    const [open, setOpen] = React.useState(true);

    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
        router.reload({preserveState:false})
    };

    return (
        <>
            {
                props.success &&
                <Snackbar color={"success"} open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="success" sx={{ width: '100%' }}>
                        {props.success}
                    </Alert>
                </Snackbar>

            }

            {
                props.error &&
                <Snackbar color={"error"} open={open} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="error" sx={{ width: '100%' }}>{props.error}</Alert>
                </Snackbar>

            }

            {
                props.warning &&
                <Snackbar color={"warning"} open={open} autoHideDuration={3000} onClose={handleClose}>
                   <Alert onClose={handleClose} severity="warning" sx={{ width: '100%' }}>{props.warning}</Alert>
                </Snackbar>

            }

            {
                props.info &&
                <Snackbar color={"info"} open={open} autoHideDuration={3000} onClose={handleClose}>
                    <Alert onClose={handleClose} severity="info" sx={{ width: '100%' }}>{props.info}</Alert>
                </Snackbar>
            }

        </>

    );
}
