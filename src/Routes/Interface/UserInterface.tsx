import React from "react";
import { Route, Routes } from "react-router-dom";
import UserInterface from "../../components/Interface/UserInter";

const InterRoutes= () => {
    return (
        <>
            <Routes>
                <Route path='/' element={<UserInterface/>} />
            </Routes>
        </>
    )
}

export default InterRoutes;