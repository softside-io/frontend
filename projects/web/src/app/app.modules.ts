import { ApiModule, Configuration } from "projects/api";

import { environment } from "../environments/environment";

export const modules = [
    ApiModule.forRoot(apiConfigFactory),
];
export function apiConfigFactory(): Configuration {
    return new Configuration({
        basePath: environment.apiBasePath,
        accessToken: () => localStorage.getItem('token')!,
    });
}