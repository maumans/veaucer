import React, {useEffect, useState,Fragment} from 'react';
import PropTypes from 'prop-types';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import {Head, Link} from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import DashboardIcon from '@mui/icons-material/Dashboard';
import LogoutIcon from '@mui/icons-material/Logout';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import SettingsIcon from '@mui/icons-material/Settings';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import {
    Dashboard,
    ExpandLess,
    ExpandMore,
    Group,
    LibraryBooks,
    ListAlt,
    Person,
    Storage,
    Widgets
} from "@mui/icons-material";
import {Breadcrumbs, Collapse} from "@mui/material";
import {createTheme, ThemeProvider} from '@mui/material/styles';
import {frFR} from '@mui/material/locale';
import 'dayjs/locale/fr';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import {router} from "@inertiajs/react";
import SnackBar from "@/Components/SnackBar.jsx";
import OrderedSideBarMenu from "@/Components/OrderedSideBarMenu.jsx";
import PaletteIcon from '@mui/icons-material/Palette';
import BusinessIcon from '@mui/icons-material/Business';
import TuneIcon from '@mui/icons-material/Tune';

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

const drawerWidth = 240;

export default function PanelLayout(props) {

    const [showingNavigationDropdown, setShowingNavigationDropdown] = useState(false);

    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);

    //const [open, setOpen] = React.useState("");

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    function handleClick(r,id1,id2,active,sousActive)
    {
        if(active==="adminSociete")
        {
            id2=props.auth.societe.id
        }

        router.get( route(r,[id1,id2],{replace:false}))
    }

    function profilSwitch(libelle)
    {
        switch(libelle)
        {
            case "admin":
                return "Administrateur"
            case "superAdmin":
                return "Super administrateur"
            default:
                return <span className="capitalize">{libelle}</span>

        }
    }

    const [open, setOpen] = React.useState("");

    useEffect(() => {
        props.active && setOpen(props.active);
    },[props.active])

    const handleClickCollapse = (active) => {
        active===open ?setOpen(""):setOpen(active)
    };

    const superAdminPermissionLinks = [
        { permission: 'display-dashboard', href: route('superAdmin.dashboard', props.auth?.user?.id), icon: <DashboardIcon/>, text: 'Tableau de bord', nom: 'superAdminDashboard', parent: false },
        { permission: 'display-users', href: route('user.index'), icon: <Person/>, text: 'Gestion des users', nom: 'user', parent: false },
        { permission: 'display-roles', href: route('role.index'), icon: <Group/>, text: 'Gestion des roles', nom: 'role', parent: false },

        // Dropdown Référentiels
        { permission: 'display-referentiels', icon: <Storage/>, text: 'Reférentiels', nom: 'referentiel', parent: true },
        { permission: 'display-societes', href: route('superAdmin.societe.index', { superAdmin: props.auth?.user?.id }), icon: <BusinessIcon/>, text: 'Sociétés', nom: 'societe', parent: "referentiel" },
        
        // Dropdown Configuration
        { permission: 'display-societe-configuration', icon: <SettingsIcon/>, text: 'Configuration', nom: 'configuration', parent: true },
        { permission: 'display-societe-configuration', href: route('superAdmin.societe.configuration.index', { user: props.auth?.user?.id }), icon: <TuneIcon/>, text: 'Gestion des sociétés', nom: 'societeConfiguration', parent: "configuration" },
    ];

    const drawer = (
        <div className={"z-0"}>
            <Toolbar className="bg-black text-white text-2xl font-bold p-0 m-0 z-0">
                <div>
                    <Link href={"/"}>
                        {
                            props.auth?.societe?.nom || "Veaucer"
                        }
                    </Link>
                </div>
            </Toolbar>

            { props.auth.superAdmin &&
                <OrderedSideBarMenu auth={props.auth} permissions={props.auth?.permissions} permissionLinks={superAdminPermissionLinks} active={props.active}/>
            }

            <List className={"p-0 m-0"}>

                { props.auth.admin &&
                    [
                        {routeLink:"admin.dashboard",text:'Tableau de bord',active:"adminDashboard",icon:<DashboardIcon/>,collapse:false},
                         {
                             routeLinks:[
                                {
                                    sousActive:"produit",
                                    route:"admin.produit.index",
                                    text:'Produit'
                                },
                                {
                                    sousActive:"entreeSortie",
                                    route:"admin.entreeSortie.index",
                                    text:'Entree/Sortie'
                                },
                                 {
                                     sousActive:"inventaire",
                                     route:"admin.stockInventaire.index",
                                     text:'Inventaire'
                                 },
                             ],
                             active:'stock',text:'Stocks',icon:<Widgets/>,collapse:true
                         },

                        {
                            routeLinks:[
                                {
                                    sousActive:"Vente",
                                    route:"admin.vente.index",
                                    text:'Ventes'
                                },
                                {
                                    sousActive:"Paiement",
                                    route:"admin.paiement.index",
                                    text:'Paiement'
                                },
                            ],
                            active:'vente',text:'Comptabilite',icon:<ListAlt/>,collapse:true
                        },

                        {
                            routeLinks:[
                                {
                                    sousActive:"Vente",
                                    route:"admin.vente.index",
                                    text:'Ventes'
                                },
                                {
                                    sousActive:"Paiement",
                                    route:"admin.paiement.index",
                                    text:'Paiement'
                                },
                            ],
                            active:'location',text:'Locations',icon:<ListAlt/>,collapse:true
                        },

                        {
                            routeLinks:[
                                {
                                    sousActive:"Vente",
                                    route:"admin.vente.index",
                                    text:'Ventes'
                                },
                                {
                                    sousActive:"Paiement",
                                    route:"admin.paiement.index",
                                    text:'Paiement'
                                },
                            ],
                            active:'reservation',text:'Reservations',icon:<ListAlt/>,collapse:true
                        },

                        {
                            routeLinks:[
                                {
                                    sousActive:"Vente",
                                    route:"admin.vente.index",
                                    text:'Ventes'
                                },
                                {
                                    sousActive:"Paiement",
                                    route:"admin.paiement.index",
                                    text:'Paiements'
                                },
                            ],
                            active:'employe',text:'Employés',icon:<ListAlt/>,collapse:true
                        },

                        {
                            routeLinks:[
                                /* {
                                    sousActive:"produit",
                                    route:"admin.produit.index",
                                    text:'Produits'
                                }, */
                                {
                                    sousActive:"service",
                                    route:"admin.service.index",
                                    text:'Services'
                                },
                                {
                                    sousActive:"departement",
                                    route:"admin.departement.index",
                                    text:'Départements'
                                },
                                {
                                    sousActive:"fournisseur",
                                    route:"admin.fournisseur.index",
                                    text:'Fournisseurs'
                                },
                                {
                                    sousActive:"poste",
                                    route:"admin.poste.index",
                                    text:'Postes'
                                },
                                {
                                    sousActive:"employe",
                                    route:"admin.employe.index",
                                    text:'Employés'
                                },

                                {
                                    sousActive:"stock",
                                    route:"admin.stock.index",
                                    text:'Stocks'
                                },

                                {
                                    sousActive:"caisse",
                                    route:"admin.caisse.index",
                                    text:'Caisses'
                                },

                                {
                                    sousActive:"client",
                                    route:"admin.client.index",
                                    text:'Clients'
                                },
                                
                            ],
                            active:'parametrage',text:'Paramétrage',icon:<ListAlt/>,collapse:true
                        },

                    ].map(({routeLink,text,active,icon,collapse,routeLinks}, index) => (

                        !collapse ?

                            <Fragment key={index}>
                                <ListItem disablePadding sx={props.active===active ? {color: "#f97316",borderRight:"2px solid #f97316",backgroundColor:"#d5deee"}:{color: "black"}}>
                                    <ListItemButton onClick={()=>handleClick(routeLink,active,props.auth.user.id,0)}>
                                        <ListItemIcon sx={props.active===active ? {color: "#f97316"}:{color: "black"}}>
                                            {icon}
                                        </ListItemIcon>
                                        <ListItemText primary={text} />
                                    </ListItemButton>
                                </ListItem>
                                <Divider  component="li"/>
                            </Fragment>
                            :
                            <Fragment key={index}>
                                <ListItemButton key={index} sx={(active===props.active) ? {color: "#f97316",borderRight:"2px solid #f97316",backgroundColor:"#d5deee"}:{color: "black"}} onClick={()=>handleClickCollapse(active)}>
                                    <ListItemIcon sx={props.active===active ? {color: "#f97316"}:{color: "black"}}>
                                        {icon}
                                    </ListItemIcon>
                                    <ListItemText primary={text} />
                                    {(open === active) ? <ExpandLess /> : <ExpandMore />}
                                </ListItemButton>

                                <Divider  component="li"/>
                                <Collapse in={ open === active} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {
                                            routeLinks?.map((rlink,i)=>(
                                                <div key={i} style={(props.sousActive===rlink.sousActive && active===props.active) ? {color: "#f97316",backgroundColor:"#f1f7fd"}:{color: "black"}}>
                                                    <Link href={route(rlink.route,[props.auth.user.id,0],{preserveState:true})}>
                                                        <ListItemButton>
                                                            <ListItemText className={'pl-16'} primary={rlink.text}/>
                                                        </ListItemButton>
                                                    </Link>
                                                    <Divider color={'#f97316'} component="li"/>
                                                </div>
                                            ))
                                        }
                                    </List>
                                </Collapse>
                            </Fragment>

                    ))}
            </List>
            <Divider className={"pt-16"} />
            <ListItemButton>
                <ListItemIcon >
                    <AccountCircleIcon/>
                </ListItemIcon>
                <ListItemText className={"capitalize"} primary={<> {props.auth.user?.prenom} <span className="uppercase">{props.auth.user?.nom} </span> </> } />
            </ListItemButton>

            <ListItemButton sx={props.active==='profil' ? {color: "#f97316",borderRight:"2px solid #f97316",backgroundColor:"#d5deee"}:{color: "black"}}
                            onClick={() => router.get(route('profil'))}
            >
                <ListItemIcon sx={props.active==="profil" ? {color: "#f97316"}:{color: "black"}} >
                    <SupervisorAccountIcon/>
                </ListItemIcon>
                <ListItemText primary={"Changer de profil"} />
            </ListItemButton>

            <ListItemButton sx={props.active==='parametre' ? {color: "#f97316",borderRight:"2px solid #f97316",backgroundColor:"#d5deee"}:{color: "black"}}
                            onClick={() => router.get(route('superAdmin.admin.parametre.index',[props.auth.user?.id]))}
            >
                <ListItemIcon sx={props.active==='parametre' ? {color: "#f97316"}:{color: "black"}} >
                    <SettingsIcon/>
                </ListItemIcon>
                <ListItemText primary={"Paramètre"} />
            </ListItemButton>
            <ListItemButton onClick={() => router.post(route('logout'))}>
                <ListItemIcon >
                    <LogoutIcon/>
                </ListItemIcon>
                <ListItemText primary={"Déconnexion"} />
            </ListItemButton>

        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <ThemeProvider theme={theme}>
            <LocalizationProvider adapterLocale={'fr'} dateAdapter={AdapterDayjs}>
                <Box sx={{ display: 'flex' }}>
                    <AppBar
                        position="fixed"
                        sx={{
                            width: { sm: `calc(100% - ${drawerWidth}px)` },
                            ml: { sm: `${drawerWidth}px` },
                            boxShadow:"inherit",
                            zIndex:99
                        }}
                    >
                        <Head>
                            <link rel="shortcut icon" type="image/x-icon" href="/images/logo.jpg"/>
                            {/*{
                                props.auth?.societe?.nom || "Veaucer"
                            }*/}
                        </Head>
                        <nav className="bg-black border-b h-full w-full">
                            <div className="max-w-9xl lg:px-20 md:px-8 sm:px-6">
                                <div className="flex justify-between h-15">
                                    <div className="flex">
                                        <Toolbar>
                                            <IconButton
                                                aria-label="open drawer"
                                                edge="start"
                                                onClick={handleDrawerToggle}
                                                sx={{ display: { sm: 'none' } }}
                                            >
                                                <MenuIcon className="text-orange-500" />
                                            </IconButton>
                                            <div className="text-orange-500 text-xl font-bold cursor-default">
                                                {[
                                                    {text:"Tableau de bord",active:"superAdminDashboard",lien:'superAdmin.dashboard',params:[props.auth.user.id]},
                                                    {text:"Tableau de bord",active:"adminDashboard",lien:'admin.dashboard',params:[props.auth.user.id]},
                                                    {text:"Référentiel",active:"referentiel",lien:'superAdmin.referentiel.index',params:[props.auth.user.id]},
                                                ].map(({text,active,sousActive,lien,params}, index) => (
                                                    <Link key={index} color={'text.primary'} underline="hover" aria-current="page" href={route(lien,params)}>
                                                        {
                                                            //(props.active===active && props.sousActive===sousActive ) && (props.titre || text)
                                                        }
                                                    </Link>
                                                ))}
                                            </div>
                                        </Toolbar>

                                    </div>

                                    <div className="hidden sm:flex sm:items-center sm:ml-16">
                                        <div className="ml-3 relative">
                                            <Dropdown>
                                                <Dropdown.Trigger>
                                                <span className="inline-flex rounded-md">
                                                    <button
                                                        type="button"
                                                        className="inline-flex items-center px-3 py-1 border border-orange-500 text-sm leading-4 font-medium rounded-md text-orange-500 bg-black hover:text-gray-700 focus:outline-none transition ease-in-out duration-150"
                                                    >
                                                        <div>
                                                            <div className="font-bold flex gap-2 items-center">
                                                                <Person className={"bg-orange-500 text-black rounded-full p-1 w-fit h-fit"}></Person>
                                                                <span className="capitalize">{props.auth.user?.prenom}</span> <span className="uppercase">{props.auth.user?.nom} </span>
                                                            </div>
                                                        <div className="flex items-center justify-center space-x-1 pt-1 w-full">
                                                            <div className={"bg-white rounded-full p-1 w-fit h-fit"}></div>
                                                            <div className={"text-white"}>
                                                                {
                                                                    props.auth?.profil && profilSwitch(props.auth.profil)
                                                                }
                                                            </div>
                                                        </div>
                                                        </div>

                                                        <svg
                                                            className="ml-2 -mr-0.5 h-4 w-4"
                                                            xmlns="http://www.w3.org/2000/svg"
                                                            viewBox="0 0 20 20"
                                                            fill="currentColor"
                                                        >
                                                            <path
                                                                fillRule="evenodd"
                                                                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                                clipRule="evenodd"
                                                            />
                                                        </svg>
                                                    </button>
                                                </span>
                                                </Dropdown.Trigger>

                                                <Dropdown.Content>
                                                    <Dropdown.Link href={route('profil')} method="get" as="button">
                                                        Changer de profil
                                                    </Dropdown.Link>

                                                    <Dropdown.Link href={route('logout')} method="post" as="button">
                                                        Déconnexion
                                                    </Dropdown.Link>
                                                </Dropdown.Content>
                                            </Dropdown>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </nav>

                    </AppBar>
                    <Box
                        component="nav"
                        sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 },zIndex:10 }}
                        aria-label="mailbox folders"
                    >
                        {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                        <Drawer
                            container={container}
                            variant="temporary"
                            open={mobileOpen}
                            onClose={handleDrawerToggle}
                            ModalProps={{
                                keepMounted: true, // Better open performance on mobile.
                            }}
                            sx={{
                                display: { xs: 'block', sm: 'none' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,zIndex:10 },
                            }}
                        >
                            {drawer}
                        </Drawer>
                        <Drawer
                            variant="permanent"
                            sx={{
                                display: { xs: 'none', sm: 'block' },
                                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth,zIndex:10,border: 'none' },
                            }}
                            open
                        >
                            {drawer}
                        </Drawer>
                    </Box>
                    <Box
                        className={"bg-gray-200 min-h-screen flex flex-col justify-between"}
                        component="main"
                        sx={{flexGrow: 1, width: { sm: `calc(100% - ${drawerWidth}px)`} }}
                    >
                        {
                            props.breadcrumbs
                            &&
                            <div role="presentation" className={"fixed sm:top-16 top-12 bg-white lg:px-20 md:px-8 px-5 py-2 w-full z-50"}>
                                <Breadcrumbs aria-label="breadcrumb" separator={"/"}>
                                    {
                                        props.breadcrumbs.map(({text,href,active,icon}) =>(
                                            <Link key={text} color={'text.primary'} underline="hover" aria-current="page" href={href}>
                                                {
                                                    icon && icon
                                                }
                                                <span className={active?'text-orange-500':'text-black'}>
                                                    {text}
                                                </span>
                                            </Link>
                                        ))
                                    }
                                </Breadcrumbs>
                            </div>
                        }
                        <div  className={props.breadcrumbs?'mt-28 lg:px-20 md:px-8 px-5':'mt-20 lg:px-20 md:px-8 px-5'}>
                            {props.children}
                        </div>

                        {
                            props.success &&
                            <SnackBar success={props.success}/>
                        }

                        {
                            props.error &&
                            <SnackBar error={props.error}/>
                        }
                    </Box>
                </Box>
            </LocalizationProvider>
        </ThemeProvider>
    );
}

PanelLayout.propTypes = {
    window: PropTypes.func,
}
