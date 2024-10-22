import React, {Fragment} from 'react';
import {router} from "@inertiajs/react";
import ListItemButton from "@mui/material/ListItemButton";
import SidebarLink from "@/Components/SidebarLink.jsx";
import ListItemText from "@mui/material/ListItemText";
import {AccountCircle, ExpandLess, ExpandMore, Logout, SupervisorAccount} from "@mui/icons-material";
import List from "@mui/material/List";
import {Collapse} from "@mui/material";
import Divider from "@mui/material/Divider";
import ListItemIcon from "@mui/material/ListItemIcon";

function OrderedSideBarMenu({permissions, permissionLinks, auth, active}) {
    // Initialiser l'état d'ouverture avec les parents actifs
    const initializeOpenList = () => {
        const openState = {};
        permissionLinks.forEach(pl => {
            if (pl.parent === true) {
                const hasActiveChild = permissionLinks.some(pll => pll.parent === pl.nom && active === pll.nom);
                if (hasActiveChild) {
                    openState[pl.nom] = true;
                }
            }
        });
        return openState;
    };

    const [openList, setOpenList] = React.useState(initializeOpenList);

    const handleClick = (key) => {
        setOpenList(prevState => ({
            ...prevState,
            [key]: !prevState[key], // Inverser l'état pour cet élément particulier
        }));
    };

    function handleLink(href) {
        router.get(href);
    }

    return (
        <List sx={{width: '100%'}} component="nav">
            {
                permissionLinks.map(pl => (
                    permissions?.includes(pl.permission) && (
                        !pl.parent ? (
                            <ListItemButton key={pl.nom} onClick={() => handleLink(pl.href)}>
                                <SidebarLink className="w-full" key={pl.permission} active={route().current().split('.')[0] === pl.nom}>
                                    {pl.icon} {pl.text}
                                </SidebarLink>
                            </ListItemButton>
                        ) : pl.parent === true ? (
                            <Fragment key={pl.nom}>
                                <ListItemButton onClick={() => handleClick(pl.nom)}>
                                    {pl?.icon}
                                    <ListItemText className={'ml-2'} primary={pl.text}/>
                                    {openList[pl.nom] ? <ExpandLess/> : <ExpandMore/>}
                                </ListItemButton>
                                <Collapse in={openList[pl.nom]} timeout="auto" unmountOnExit>
                                    <List component="div" disablePadding>
                                        {permissionLinks
                                            .filter(pll => pll.parent === pl.nom && permissions?.includes(pll.permission))
                                            .map(pll => (
                                                <ListItemButton sx={{pl: 4}} key={pll.nom}>
                                                    <SidebarLink className="w-full" active={active === pll.nom}
                                                                 href={pll.href}>
                                                        {pll.text}
                                                    </SidebarLink>
                                                </ListItemButton>
                                            ))}
                                    </List>
                                </Collapse>
                            </Fragment>
                        ) : null
                    )
                ))
            }
            <Divider className={"pt-16"}/>
            <ListItemButton>
                <ListItemIcon>
                    <AccountCircle/>
                </ListItemIcon>
                <ListItemText className={"capitalize"}
                              primary={<> {auth.user?.prenom} <span className="uppercase">{auth.user?.nom} </span> </>}/>
            </ListItemButton>

            <ListItemButton sx={route().current().split('.')[0] === 'profil' ? {
                color: "#f97316",
                borderRight: "2px solid #f97316",
                backgroundColor: "#d5deee"
            } : {color: "black"}}
                            onClick={() => router.get(route('profil'))}
            >
                <ListItemIcon sx={route().current().split('.')[0] === "profil" ? {color: "#f97316"} : {color: "black"}}>
                    <SupervisorAccount/>
                </ListItemIcon>
                <ListItemText primary={"Changer de profil"}/>
            </ListItemButton>
            <ListItemButton onClick={() => router.post(route('logout'))}>
                <ListItemIcon>
                    <Logout/>
                </ListItemIcon>
                <ListItemText primary={"Déconnexion"}/>
            </ListItemButton>
        </List>
    );
}

export default OrderedSideBarMenu;
