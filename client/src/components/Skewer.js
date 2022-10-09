import React, { useState } from 'react';
import { useEffect } from 'react';
import { useRef } from 'react';
import SkewerButton from "./SkewerButton";
import SkewerDropDown from "./SkewerDropDown";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import "./Skewer.scss";

const Skewer = ({_id}) => {
    const [open, setOpen] = useState(false);
    const drop = useRef(null);

    function handleClick(e) {
        if (!e.target.closest(`.${drop.current.className}`) && open) {
            setOpen(false);
        }
    }

    useEffect(() => {
        document.addEventListener("click", handleClick);
        return () => {
            document.removeEventListener("click", handleClick);
        };
    });

    return (
        <>
                <div 
            className="skewer-component"
            ref={drop}
            >        
            <SkewerButton onClick={() => setOpen(!open)}/>
            {open &&
                <SkewerDropDown _id={_id}/>
            }
        </div>
        </>

        

    )

}

export default Skewer;