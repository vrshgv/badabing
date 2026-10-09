import { createBrowserRouter, Navigate } from "react-router";

import { Layout } from "./components/Layout";
import { CreateScreeningPage } from "./pages/CreateScreeningPage";
import { ScreeningDetailPage } from "./pages/ScreeningDetailPage";
import { ScreeningsPage } from "./pages/ScreeningsPage";

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Navigate to="/screenings" replace /> },
      { path: 'screenings', element: <ScreeningsPage /> },
      { path: 'screenings/new', element: <CreateScreeningPage /> },
      { path: 'screenings/:id', element: <ScreeningDetailPage /> }
    ]
  }
])