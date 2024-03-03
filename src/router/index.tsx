import { createContext, ReactNode, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import api from "../helpers/api";

import { AllowedComponent } from "./AllowedComponent";

import { Routes as ACCRoutes } from "./Routes";
import { RouteType } from "./Routes/types";

export const AppRouter = () => {
  const buildRoute = (route: RouteType): ReactNode | null => {
    if (route === undefined || null) return null;

    const {
      id,
      children,
      path,
      element,
      redirection,
      permissions,
      index: idx,
    } = route;

    return idx ? (
      <Route
        index
        key={id}
        element={AllowedComponent(element, redirection, permissions)}
      />
    ) : (
      <Route
        path={path}
        key={id}
        element={AllowedComponent(element, redirection, permissions)}
      >
        {children ? (
          children.length && children.map((child: any) => buildRoute(child))
        ) : (
          <></>
        )}
      </Route>
    );
  };

  const { keycloak } = useKeycloak();

  useEffect(() => {
    api.interceptors.request.use(
      (config: any) => {
        config.headers.Authorization = `Bearer ${keycloak.token}`;

        return config;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
  }, [keycloak.token]);

  return (
    <Routes>{ACCRoutes.map((route: RouteType) => buildRoute(route))}</Routes>
  );
};
