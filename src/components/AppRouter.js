import React from "react";
import { Route, Routes } from "react-router-dom";
import { VerifiedAccess } from "../Routes";

const AppRouter = () => {
  return (
    <Routes>
      {VerifiedAccess.map((i) => {
        <Route path={i.route} Component={i.comp} />;
      })}
    </Routes>
  );
};

export default AppRouter;
