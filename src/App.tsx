import { Authenticated, Refine } from "@refinedev/core";
import {
    ThemedLayoutV2,
    notificationProvider,
    ErrorComponent,
    RefineThemes,
    AuthPage,
} from "@refinedev/antd";
import routerBindings, {
  CatchAllNavigate,
    NavigateToResource,
    UnsavedChangesNotifier,
} from "@refinedev/react-router-v6";
import dataProvider from "@refinedev/simple-rest";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";

import authProvider from "./authProvider";

import { BlogPostList } from "pages/blog-posts/list";
import { BlogPostEdit } from "pages/blog-posts/edit";
import { BlogPostShow } from "pages/blog-posts/show";
import { BlogPostCreate } from "pages/blog-posts/create";

import { ConfigProvider } from "antd";
import "@refinedev/antd/dist/reset.css";

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ConfigProvider theme={RefineThemes.Blue}>
                <Refine
                    routerProvider={routerBindings}
                    dataProvider={dataProvider(
                        "https://api.fake-rest.refine.dev",
                    )}
                    notificationProvider={notificationProvider}
                    resources={[
                        {
                            name: "blog_posts",
                            meta: {
                              canDelete: true,
                            },
                            list: "/blog-posts",
                            show: "/blog-posts/show/:id",
                            create: "/blog-posts/create",
                            edit: "/blog-posts/edit/:id",
                        },
                    ]}
                    options={{
                        syncWithLocation: true,
                        warnWhenUnsavedChanges: true,
                    }}
                    authProvider={authProvider}
                >
                    <Routes>
                        <Route
                            element={
                                <Authenticated
                                    fallback={<CatchAllNavigate to="/login" />}
                                >
                                    <ThemedLayoutV2>
                                        <Outlet />
                                    </ThemedLayoutV2>
                                </Authenticated>
                            }
                        >
                            <Route index element={<NavigateToResource resource="blog_posts" />} />
                            <Route path="blog-posts">
                                <Route index element={<BlogPostList />} />
                                <Route path="show/:id" element={<BlogPostShow />} />
                                <Route path="edit/:id" element={<BlogPostEdit />} />
                                <Route path="create" element={<BlogPostCreate />} />
                            </Route>
                            <Route path="*" element={<ErrorComponent />} />
                        </Route>
                        
                        <Route
                            element={
                                <Authenticated fallback={<Outlet />}>
                                    <NavigateToResource />
                                </Authenticated>
                            }
                        >
                            <Route path="/login" element={<AuthPage type="login" />} />
                            <Route path="/register" element={<AuthPage type="register" />} />
                            <Route path="/forgot-password" element={<AuthPage type="forgotPassword" />} />
                            <Route path="/update-password" element={<AuthPage type="updatePassword" />} />
                        </Route>
                        <Route
                            element={
                                <Authenticated fallback={<Outlet />}>
                                    <ThemedLayoutV2>
                                        <Outlet />
                                    </ThemedLayoutV2>
                                </Authenticated>
                            }
                        >
                            <Route path="*" element={<ErrorComponent />} />
                        </Route>
                    </Routes>
                    <UnsavedChangesNotifier />
                </Refine>
            </ConfigProvider>
        </BrowserRouter>
    );
};

export default App;