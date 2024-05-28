import * as hono_hono_base from 'hono/hono-base';
import * as hono_utils_http_status from 'hono/utils/http-status';
import * as hono from 'hono';

declare const routes: hono_hono_base.HonoBase<hono.Env, {
    "/reads": {
        $post: {
            input: {
                json: {
                    entryId: string;
                    csrfToken: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        } | {
            input: {
                json: {
                    entryId: string;
                    csrfToken: string;
                };
            };
            output: {
                code: 1;
                error: "Unauthorized";
            };
            outputFormat: "json";
            status: 401;
        };
        $delete: {
            input: {
                json: {
                    entryId: string;
                    csrfToken: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/collections": {
        $get: {
            input: {
                query: {
                    entryId: string;
                };
            };
            output: {
                code: 0;
                data: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    entryId: string;
                    csrfToken: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    entryId: string;
                    csrfToken: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/categories": {
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                data?: string[] | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    feedIdList: string[];
                    deleteSubscriptions: boolean;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $patch: {
            input: {
                json: {
                    category: string;
                    feedIdList: string[];
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/feeds/refresh": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/discover": {
        $post: {
            input: {
                json: {
                    keyword: string;
                    type?: "auto" | "rss" | undefined;
                };
            };
            output: {
                data: {
                    feed: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    entries?: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        url: string | null;
                        feedId: string;
                        guid: string;
                        author: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                    }[] | undefined;
                    docs?: string | undefined;
                    isSubscribed?: boolean | undefined;
                    subscriptionCount?: number | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/auth-app/new-session": {
        $post: {
            input: {
                json: {
                    csrfToken: string;
                };
            };
            output: {
                code: 0;
                data: {
                    userId: string;
                    sessionToken: string;
                    expires: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/auth-app/update-account": {
        $patch: {
            input: {
                json: {
                    csrfToken: string;
                    name?: string | null | undefined;
                    image?: string | null | undefined;
                    handle?: string | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    [x: `/import/${string}`]: {
        [x: `$${Lowercase<string>}`]: {
            input: Partial<hono.ValidationTargets>;
            output: any;
            outputFormat: string;
            status: hono_utils_http_status.StatusCode;
        };
    };
} & {
    "/entries": {
        $post: {
            input: {
                json: {
                    feedId?: string | undefined;
                    view?: number | undefined;
                    category?: string | undefined;
                    limit?: number | undefined;
                    offset?: number | undefined;
                    feedIdList?: string[] | undefined;
                };
            };
            output: {
                code: 0;
                total: number;
                data?: {
                    description: string | null;
                    title: string | null;
                    id: string;
                    feeds: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    url: string | null;
                    feedId: string;
                    guid: string;
                    author: string | null;
                    changedAt: string;
                    publishedAt: string;
                    images: string[] | null;
                    categories: string[] | null;
                    collected: boolean;
                    read: boolean;
                }[] | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data?: {
                    description: string | null;
                    title: string | null;
                    content: string | null;
                    id: string;
                    feeds: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    url: string | null;
                    feedId: string;
                    guid: string;
                    author: string | null;
                    changedAt: string;
                    publishedAt: string;
                    images: string[] | null;
                    categories: string[] | null;
                    collected: boolean;
                    read: boolean;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/subscriptions": {
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                code: 0;
                data?: {
                    title: string | null;
                    userId: string;
                    feeds: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        image: string | null;
                        url: string;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    feedId: string;
                    view: number;
                    category: string | null;
                    isPrivate: boolean | null;
                }[] | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    url: string;
                    view: number;
                    csrfToken: string;
                    category?: string | null | undefined;
                    isPrivate?: boolean | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    csrfToken: string;
                    url?: string | undefined;
                    feedId?: string | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $patch: {
            input: {
                json: {
                    feedId: string;
                    view: number;
                    csrfToken: string;
                    category?: string | null | undefined;
                    isPrivate?: boolean | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/">;
type AppType = typeof routes;

export type { AppType };
