import React from 'react';
import {Link} from "@inertiajs/react";

function SidebarLink({children,active,className,...props}) {
    return (
        <Link {...props} className={`${active?"bg-orange-500 text-white rounded pl-1 py-2 font-bold":""} flex gap-2 items-center ${className}`}>
            {children}
        </Link>
    );
}

export default SidebarLink;
