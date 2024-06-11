import * as hono_hono_base from 'hono/hono-base';
import * as hono_utils_http_status from 'hono/utils/http-status';
import * as hono from 'hono';

declare const routes: hono_hono_base.HonoBase<hono.Env, {
    "/reads": {
        $post: {
            input: {
                json: {
                    entryIds: string[];
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
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                data: Record<string, number>;
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/reads/all": {
        $post: {
            input: {
                json: {
                    feedId?: string | undefined;
                    view?: number | undefined;
                    feedIdList?: string[] | undefined;
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
                data: boolean;
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    entryId: string;
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
    "/feeds": {
        $get: {
            input: {
                query: {
                    id?: string | undefined;
                    url?: string | undefined;
                };
            };
            output: {
                data: {
                    feed: {
                        url: string;
                        checkedAt: string;
                        nextCheckAt: string;
                        id?: string | undefined;
                        image?: string | null | undefined;
                        title?: string | null | undefined;
                        description?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        lastModifiedHeader?: string | null | undefined;
                        etagHeader?: string | null | undefined;
                        ttl?: number | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                    };
                    subscriptionCount: number;
                    readCount: number;
                    subscription?: {
                        userId: string;
                        feedId: string;
                        title: string | null;
                        view: number;
                        category: string | null;
                        isPrivate: boolean | null;
                    } | undefined;
                };
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
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
                        id: string;
                        image: string | null;
                        url: string;
                        title: string | null;
                        description: string | null;
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
                        id: string;
                        feedId: string;
                        url: string | null;
                        title: string | null;
                        description: string | null;
                        content: string | null;
                        guid: string;
                        author: string | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                        enclosures?: {
                            url: string;
                            title?: string | undefined;
                            type?: string | undefined;
                            length?: number | undefined;
                        }[] | null | undefined;
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
            input: {};
            output: {
                data: {
                    userId: string;
                    sessionToken: string;
                    expires: string;
                };
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/auth-app/update-account": {
        $patch: {
            input: {
                json: {
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
                    read?: boolean | undefined;
                    limit?: number | undefined;
                    feedIdList?: string[] | undefined;
                    publishedAfter?: string | undefined;
                    collected?: boolean | undefined;
                };
            };
            output: {
                code: 0;
                total: number;
                data?: {
                    feeds: {
                        id: string;
                        image: string | null;
                        url: string;
                        title: string | null;
                        description: string | null;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    entries: {
                        id: string;
                        url: string | null;
                        title: string | null;
                        description: string | null;
                        guid: string;
                        author: string | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                        enclosures?: {
                            url: string;
                            title?: string | undefined;
                            type?: string | undefined;
                            length?: number | undefined;
                        }[] | null | undefined;
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
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
                    collections: {
                        createdAt: string;
                    };
                    feeds: {
                        id: string;
                        image: string | null;
                        url: string;
                        title: string | null;
                        description: string | null;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    entries: {
                        id: string;
                        url: string | null;
                        title: string | null;
                        description: string | null;
                        content: string | null;
                        guid: string;
                        author: string | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        changedAt: string;
                        publishedAt: string;
                        images: string[] | null;
                        categories: string[] | null;
                        enclosures?: {
                            url: string;
                            title?: string | undefined;
                            type?: string | undefined;
                            length?: number | undefined;
                        }[] | null | undefined;
                    };
                    read: boolean | null;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
    "/entries/preview": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                data: {
                    id: string;
                    feedId: string;
                    url: string | null;
                    title: string | null;
                    description: string | null;
                    content: string | null;
                    guid: string;
                    author: string | null;
                    authorUrl: string | null;
                    authorAvatar: string | null;
                    changedAt: string;
                    publishedAt: string;
                    images: string[] | null;
                    categories: string[] | null;
                    enclosures?: {
                        url: string;
                        title?: string | undefined;
                        type?: string | undefined;
                        length?: number | undefined;
                    }[] | null | undefined;
                }[];
                code: 0;
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
                data: {
                    userId: string;
                    feedId: string;
                    feeds: {
                        id: string;
                        image: string | null;
                        url: string;
                        title: string | null;
                        description: string | null;
                        siteUrl: string | null;
                        checkedAt: string;
                        nextCheckAt: string;
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                    };
                    title: string | null;
                    view: number;
                    category: string | null;
                    isPrivate: boolean | null;
                }[];
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    url: string;
                    view: number;
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
                    feedId?: string | undefined;
                    url?: string | undefined;
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
