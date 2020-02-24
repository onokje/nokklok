import React, {useState} from 'react';

function Menu() {

    const [menuOpen, setMenuOpen] = useState(false);

    const openMenu = () => {
        setMenuOpen(true);
    };

    return (
        <>
            {!menuOpen && <div onClick={openMenu} className="menu_open_area"></div>}
            <div onClick={() => setMenuOpen(false)} className={`menu_container ${menuOpen && 'menu_container_open'}`}>

            </div>
        </>

    );
}

export default Menu;
