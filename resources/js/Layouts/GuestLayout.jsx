import ApplicationLogo from '@/Components/ApplicationLogo';
import { Link } from '@inertiajs/react';
import {createTheme, ThemeProvider} from "@mui/material/styles";
import {frFR} from "@mui/material/locale";

export default function Guest({ children }) {

    const theme = createTheme(
        {
            typography: {
                "fontFamily": `"BioRhyme", sans-serif`,
                "fontSize": 14,
                "fontWeightLight": 300,
                "fontWeightRegular": 400,
                "fontWeightMedium": 500
            },
            palette: {
                primary: {main: '#f97316'},
            },
        },
        frFR
    );

    return (
        <ThemeProvider theme={theme}>
            <div className="min-h-screen flex flex-col sm:justify-center items-center pt-6 sm:pt-0 bg-gray-100">
                <div>
                    <Link href="/">
                        <ApplicationLogo className="w-20 h-20 fill-current text-gray-500" />
                    </Link>
                </div>

                <div className="w-full sm:max-w-md mt-6 px-6 py-4 bg-white shadow-md overflow-hidden sm:rounded-lg border border-orange-500">
                    {children}
                </div>
            </div>
        </ThemeProvider>
    );
}
