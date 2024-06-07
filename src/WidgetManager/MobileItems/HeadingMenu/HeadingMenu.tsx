import React from 'react';
import "./HeadingMenu.css";

interface Props {
    logo_element: any;
    right_element: any;
    left_element: any;
}


const MobileMenuHeader = ({
    logo_element,
    right_element,
    left_element }: Props) => {
    return (
        <div className="mobile-menu-header">
            <div className="left-container">
                <div className="logo-element">
                    {logo_element}
                </div>
                <div className="left-element">
                    {left_element}
                </div>
            </div>
            <div className="right-element">
                {right_element}
            </div>
        </div>
    );
}

export default MobileMenuHeader;