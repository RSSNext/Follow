import * as hono_hono_base from 'hono/hono-base';
import * as hono_types from 'hono/types';
import * as hono_utils_http_status from 'hono/utils/http-status';
import { HttpBindings } from '@hono/node-server';
import * as better_call from 'better-call';
import * as zod from 'zod';
import { z } from 'zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import { AnyPgColumn } from 'drizzle-orm/pg-core';
import * as drizzle_orm from 'drizzle-orm';
import { InferInsertModel, SQL } from 'drizzle-orm';
import * as better_auth_adapters_drizzle from 'better-auth/adapters/drizzle';
import * as better_auth_plugins from 'better-auth/plugins';
import * as better_auth from 'better-auth';

type Env = {
    Bindings: HttpBindings;
};

declare const authPlugins: ({
    id: "customGetProviders";
    endpoints: {
        customGetProviders: {
            <C extends [(better_call.Context<"/get-providers", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : any>;
            path: "/get-providers";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
} | {
    id: "customCreateSession";
    endpoints: {
        customCreateSession: {
            <C extends [(better_call.Context<"/create-session", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                ck: string;
                userId: string;
            } | null>;
            path: "/create-session";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
} | {
    id: "getAccountInfo";
    endpoints: {
        getAccountInfo: {
            <C extends [(better_call.Context<"/get-account-info", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                id: string;
                provider: string;
                profile: {
                    id?: string;
                    email?: string;
                    name?: string;
                    image?: string;
                } | null;
            }[] | null>;
            path: "/get-account-info";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
} | {
    id: "customUpdateUser";
    endpoints: {
        customUpdateUser: {
            <C extends [(better_call.Context<"/update-user-ccc", {
                method: "POST";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : string | null>;
            path: "/update-user-ccc";
            options: {
                method: "POST";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    };
})[];

declare const achievements: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "achievements";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "achievements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "achievements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
            tableName: "achievements";
            dataType: "string";
            columnType: "PgText";
            data: "received" | "checking" | "completed" | "incomplete" | "audit";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["checking", "completed", "incomplete", "audit", "received"];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        actionId: drizzle_orm_pg_core.PgColumn<{
            name: "action_id";
            tableName: "achievements";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        progress: drizzle_orm_pg_core.PgColumn<{
            name: "progress";
            tableName: "achievements";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        progressMax: drizzle_orm_pg_core.PgColumn<{
            name: "progress_max";
            tableName: "achievements";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        done: drizzle_orm_pg_core.PgColumn<{
            name: "done";
            tableName: "achievements";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        doneAt: drizzle_orm_pg_core.PgColumn<{
            name: "done_at";
            tableName: "achievements";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        tx: drizzle_orm_pg_core.PgColumn<{
            name: "tx";
            tableName: "achievements";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const achievementsOpenAPISchema: zod.ZodObject<{
    id: zod.ZodString;
    userId: zod.ZodString;
    type: zod.ZodEnum<["checking", "completed", "incomplete", "audit", "received"]>;
    actionId: zod.ZodNumber;
    progress: zod.ZodNumber;
    progressMax: zod.ZodNumber;
    done: zod.ZodBoolean;
    doneAt: zod.ZodNullable<zod.ZodString>;
    tx: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    type: "received" | "checking" | "completed" | "incomplete" | "audit";
    id: string;
    userId: string;
    actionId: number;
    progress: number;
    progressMax: number;
    done: boolean;
    doneAt: string | null;
    tx: string | null;
}, {
    type: "received" | "checking" | "completed" | "incomplete" | "audit";
    id: string;
    userId: string;
    actionId: number;
    progress: number;
    progressMax: number;
    done: boolean;
    doneAt: string | null;
    tx: string | null;
}>;

declare const languageSchema: z.ZodEnum<["en", "ja", "zh-CN", "zh-TW"]>;
declare const ruleFieldSchema: z.ZodEnum<["all", "title", "content", "author", "url", "order"]>;
declare const ruleOperatorSchema: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
declare const conditionItemSchema: z.ZodObject<{
    field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category", "entry_title", "entry_content", "entry_url", "entry_author", "entry_media_length"]>;
    operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
    value: z.ZodString;
}, "strip", z.ZodTypeAny, {
    value: string;
    field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
    operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
}, {
    value: string;
    field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
    operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
}>;
type ConditionItem = z.infer<typeof conditionItemSchema>;
declare const actions: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "actions";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "actions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        rules: drizzle_orm_pg_core.PgColumn<{
            name: "rules";
            tableName: "actions";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                name: string;
                condition: ConditionItem[] | ConditionItem[][];
                result: {
                    disabled?: boolean;
                    translation?: z.infer<typeof languageSchema>;
                    summary?: boolean;
                    readability?: boolean;
                    sourceContent?: boolean;
                    silence?: boolean;
                    block?: boolean;
                    newEntryNotification?: boolean;
                    rewriteRules?: {
                        from: string;
                        to: string;
                    }[];
                    blockRules?: {
                        field: z.infer<typeof ruleFieldSchema>;
                        operator: z.infer<typeof ruleOperatorSchema>;
                        value: string | number;
                    }[];
                    webhooks?: string[];
                };
            }[];
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                name: string;
                condition: ConditionItem[] | ConditionItem[][];
                result: {
                    disabled?: boolean;
                    translation?: z.infer<typeof languageSchema>;
                    summary?: boolean;
                    readability?: boolean;
                    sourceContent?: boolean;
                    silence?: boolean;
                    block?: boolean;
                    newEntryNotification?: boolean;
                    rewriteRules?: {
                        from: string;
                        to: string;
                    }[];
                    blockRules?: {
                        field: z.infer<typeof ruleFieldSchema>;
                        operator: z.infer<typeof ruleOperatorSchema>;
                        value: string | number;
                    }[];
                    webhooks?: string[];
                };
            }[];
        }>;
    };
    dialect: "pg";
}>;
declare const actionsItemOpenAPISchema: z.ZodObject<{
    name: z.ZodString;
    condition: z.ZodUnion<[z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category", "entry_title", "entry_content", "entry_url", "entry_author", "entry_media_length"]>;
        operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }, {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }>, "many">, z.ZodArray<z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category", "entry_title", "entry_content", "entry_url", "entry_author", "entry_media_length"]>;
        operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }, {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }>, "many">, "many">]>;
    result: z.ZodObject<{
        disabled: z.ZodOptional<z.ZodBoolean>;
        translation: z.ZodOptional<z.ZodEnum<["en", "ja", "zh-CN", "zh-TW"]>>;
        summary: z.ZodOptional<z.ZodBoolean>;
        readability: z.ZodOptional<z.ZodBoolean>;
        sourceContent: z.ZodOptional<z.ZodBoolean>;
        silence: z.ZodOptional<z.ZodBoolean>;
        block: z.ZodOptional<z.ZodBoolean>;
        newEntryNotification: z.ZodOptional<z.ZodBoolean>;
        rewriteRules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            from: z.ZodString;
            to: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            from: string;
            to: string;
        }, {
            from: string;
            to: string;
        }>, "many">>;
        blockRules: z.ZodOptional<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["all", "title", "content", "author", "url", "order"]>;
            operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
            value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
        }, "strip", z.ZodTypeAny, {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }, {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }>, "many">>;
        webhooks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        disabled?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        summary?: boolean | undefined;
        readability?: boolean | undefined;
        sourceContent?: boolean | undefined;
        silence?: boolean | undefined;
        block?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    }, {
        disabled?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        summary?: boolean | undefined;
        readability?: boolean | undefined;
        sourceContent?: boolean | undefined;
        silence?: boolean | undefined;
        block?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    condition: {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[] | {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[][];
    result: {
        disabled?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        summary?: boolean | undefined;
        readability?: boolean | undefined;
        sourceContent?: boolean | undefined;
        silence?: boolean | undefined;
        block?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    };
}, {
    name: string;
    condition: {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[] | {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[][];
    result: {
        disabled?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        summary?: boolean | undefined;
        readability?: boolean | undefined;
        sourceContent?: boolean | undefined;
        silence?: boolean | undefined;
        block?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    };
}>;
declare const actionsOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    userId: z.ZodString;
    rules: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
}, "rules">, {
    rules: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        condition: z.ZodUnion<[z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category", "entry_title", "entry_content", "entry_url", "entry_author", "entry_media_length"]>;
            operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }, {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }>, "many">, z.ZodArray<z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category", "entry_title", "entry_content", "entry_url", "entry_author", "entry_media_length"]>;
            operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }, {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }>, "many">, "many">]>;
        result: z.ZodObject<{
            disabled: z.ZodOptional<z.ZodBoolean>;
            translation: z.ZodOptional<z.ZodEnum<["en", "ja", "zh-CN", "zh-TW"]>>;
            summary: z.ZodOptional<z.ZodBoolean>;
            readability: z.ZodOptional<z.ZodBoolean>;
            sourceContent: z.ZodOptional<z.ZodBoolean>;
            silence: z.ZodOptional<z.ZodBoolean>;
            block: z.ZodOptional<z.ZodBoolean>;
            newEntryNotification: z.ZodOptional<z.ZodBoolean>;
            rewriteRules: z.ZodOptional<z.ZodArray<z.ZodObject<{
                from: z.ZodString;
                to: z.ZodString;
            }, "strip", z.ZodTypeAny, {
                from: string;
                to: string;
            }, {
                from: string;
                to: string;
            }>, "many">>;
            blockRules: z.ZodOptional<z.ZodArray<z.ZodObject<{
                field: z.ZodEnum<["all", "title", "content", "author", "url", "order"]>;
                operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
                value: z.ZodUnion<[z.ZodString, z.ZodNumber]>;
            }, "strip", z.ZodTypeAny, {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }, {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }>, "many">>;
            webhooks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            disabled?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            summary?: boolean | undefined;
            readability?: boolean | undefined;
            sourceContent?: boolean | undefined;
            silence?: boolean | undefined;
            block?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        }, {
            disabled?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            summary?: boolean | undefined;
            readability?: boolean | undefined;
            sourceContent?: boolean | undefined;
            silence?: boolean | undefined;
            block?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[][];
        result: {
            disabled?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            summary?: boolean | undefined;
            readability?: boolean | undefined;
            sourceContent?: boolean | undefined;
            silence?: boolean | undefined;
            block?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
    }, {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[][];
        result: {
            disabled?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            summary?: boolean | undefined;
            readability?: boolean | undefined;
            sourceContent?: boolean | undefined;
            silence?: boolean | undefined;
            block?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
    }>, "many">>>;
}>, "strip", z.ZodTypeAny, {
    userId: string;
    rules?: {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[][];
        result: {
            disabled?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            summary?: boolean | undefined;
            readability?: boolean | undefined;
            sourceContent?: boolean | undefined;
            silence?: boolean | undefined;
            block?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
    }[] | null | undefined;
}, {
    userId: string;
    rules?: {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[][];
        result: {
            disabled?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            summary?: boolean | undefined;
            readability?: boolean | undefined;
            sourceContent?: boolean | undefined;
            silence?: boolean | undefined;
            block?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
    }[] | null | undefined;
}>;
declare const actionsRelations: drizzle_orm.Relations<"actions", {
    users: drizzle_orm.One<"user", true>;
}>;
type ActionsModel = z.infer<typeof actionsOpenAPISchema>;
type SettingsModel = Exclude<z.infer<typeof actionsItemOpenAPISchema>["result"], undefined>;

declare const detailModelSchema: z.ZodNullable<z.ZodObject<{
    "Invitations count": z.ZodNumber;
    "Purchase lists cost": z.ZodNumber;
    "Total tip amount": z.ZodNumber;
    "Feeds subscriptions count": z.ZodNumber;
    "Lists subscriptions count": z.ZodNumber;
    "Inbox subscriptions count": z.ZodNumber;
    "Recent read count in the last month": z.ZodNumber;
    "Mint count": z.ZodNumber;
    "Claimed feeds count": z.ZodNumber;
    "Claimed feeds subscriptions count": z.ZodNumber;
    "Lists with more than 1 feed count": z.ZodNumber;
    "Created lists subscriptions count": z.ZodNumber;
    "Created lists income amount": z.ZodNumber;
    "GitHub Community Contributions": z.ZodNumber;
    "Invitations count Rank": z.ZodNumber;
    "Purchase lists cost Rank": z.ZodNumber;
    "Total tip amount Rank": z.ZodNumber;
    "Feeds subscriptions count Rank": z.ZodNumber;
    "Lists subscriptions count Rank": z.ZodNumber;
    "Inbox subscriptions count Rank": z.ZodNumber;
    "Recent read count in the last month Rank": z.ZodNumber;
    "Mint count Rank": z.ZodNumber;
    "Claimed feeds count Rank": z.ZodNumber;
    "Claimed feeds subscriptions count Rank": z.ZodNumber;
    "Lists with more than 1 feed count Rank": z.ZodNumber;
    "Created lists subscriptions count Rank": z.ZodNumber;
    "Created lists income amount Rank": z.ZodNumber;
    "GitHub Community Contributions Rank": z.ZodNumber;
}, "strip", z.ZodTypeAny, {
    "Invitations count": number;
    "Purchase lists cost": number;
    "Total tip amount": number;
    "Feeds subscriptions count": number;
    "Lists subscriptions count": number;
    "Inbox subscriptions count": number;
    "Recent read count in the last month": number;
    "Mint count": number;
    "Claimed feeds count": number;
    "Claimed feeds subscriptions count": number;
    "Lists with more than 1 feed count": number;
    "Created lists subscriptions count": number;
    "Created lists income amount": number;
    "GitHub Community Contributions": number;
    "Invitations count Rank": number;
    "Purchase lists cost Rank": number;
    "Total tip amount Rank": number;
    "Feeds subscriptions count Rank": number;
    "Lists subscriptions count Rank": number;
    "Inbox subscriptions count Rank": number;
    "Recent read count in the last month Rank": number;
    "Mint count Rank": number;
    "Claimed feeds count Rank": number;
    "Claimed feeds subscriptions count Rank": number;
    "Lists with more than 1 feed count Rank": number;
    "Created lists subscriptions count Rank": number;
    "Created lists income amount Rank": number;
    "GitHub Community Contributions Rank": number;
}, {
    "Invitations count": number;
    "Purchase lists cost": number;
    "Total tip amount": number;
    "Feeds subscriptions count": number;
    "Lists subscriptions count": number;
    "Inbox subscriptions count": number;
    "Recent read count in the last month": number;
    "Mint count": number;
    "Claimed feeds count": number;
    "Claimed feeds subscriptions count": number;
    "Lists with more than 1 feed count": number;
    "Created lists subscriptions count": number;
    "Created lists income amount": number;
    "GitHub Community Contributions": number;
    "Invitations count Rank": number;
    "Purchase lists cost Rank": number;
    "Total tip amount Rank": number;
    "Feeds subscriptions count Rank": number;
    "Lists subscriptions count Rank": number;
    "Inbox subscriptions count Rank": number;
    "Recent read count in the last month Rank": number;
    "Mint count Rank": number;
    "Claimed feeds count Rank": number;
    "Claimed feeds subscriptions count Rank": number;
    "Lists with more than 1 feed count Rank": number;
    "Created lists subscriptions count Rank": number;
    "Created lists income amount Rank": number;
    "GitHub Community Contributions Rank": number;
}>>;
type DetailModel = z.infer<typeof detailModelSchema>;
declare const activityEnum: readonly ["public_beta"];
type AirdropActivity = typeof activityEnum[number];
declare const airdrops: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "airdrops";
    schema: undefined;
    columns: {
        activity: drizzle_orm_pg_core.PgColumn<{
            name: "activity";
            tableName: "airdrops";
            dataType: "string";
            columnType: "PgText";
            data: "public_beta";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["public_beta"];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "airdrops";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        amount: drizzle_orm_pg_core.PgColumn<{
            name: "amount";
            tableName: "airdrops";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        rank: drizzle_orm_pg_core.PgColumn<{
            name: "rank";
            tableName: "airdrops";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        detail: drizzle_orm_pg_core.PgColumn<{
            name: "detail";
            tableName: "airdrops";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                "Invitations count": number;
                "Purchase lists cost": number;
                "Total tip amount": number;
                "Feeds subscriptions count": number;
                "Lists subscriptions count": number;
                "Inbox subscriptions count": number;
                "Recent read count in the last month": number;
                "Mint count": number;
                "Claimed feeds count": number;
                "Claimed feeds subscriptions count": number;
                "Lists with more than 1 feed count": number;
                "Created lists subscriptions count": number;
                "Created lists income amount": number;
                "GitHub Community Contributions": number;
                "Invitations count Rank": number;
                "Purchase lists cost Rank": number;
                "Total tip amount Rank": number;
                "Feeds subscriptions count Rank": number;
                "Lists subscriptions count Rank": number;
                "Inbox subscriptions count Rank": number;
                "Recent read count in the last month Rank": number;
                "Mint count Rank": number;
                "Claimed feeds count Rank": number;
                "Claimed feeds subscriptions count Rank": number;
                "Lists with more than 1 feed count Rank": number;
                "Created lists subscriptions count Rank": number;
                "Created lists income amount Rank": number;
                "GitHub Community Contributions Rank": number;
            } | null;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: {
                "Invitations count": number;
                "Purchase lists cost": number;
                "Total tip amount": number;
                "Feeds subscriptions count": number;
                "Lists subscriptions count": number;
                "Inbox subscriptions count": number;
                "Recent read count in the last month": number;
                "Mint count": number;
                "Claimed feeds count": number;
                "Claimed feeds subscriptions count": number;
                "Lists with more than 1 feed count": number;
                "Created lists subscriptions count": number;
                "Created lists income amount": number;
                "GitHub Community Contributions": number;
                "Invitations count Rank": number;
                "Purchase lists cost Rank": number;
                "Total tip amount Rank": number;
                "Feeds subscriptions count Rank": number;
                "Lists subscriptions count Rank": number;
                "Inbox subscriptions count Rank": number;
                "Recent read count in the last month Rank": number;
                "Mint count Rank": number;
                "Claimed feeds count Rank": number;
                "Claimed feeds subscriptions count Rank": number;
                "Lists with more than 1 feed count Rank": number;
                "Created lists subscriptions count Rank": number;
                "Created lists income amount Rank": number;
                "GitHub Community Contributions Rank": number;
            } | null;
        }>;
        verify: drizzle_orm_pg_core.PgColumn<{
            name: "verify";
            tableName: "airdrops";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        tx: drizzle_orm_pg_core.PgColumn<{
            name: "tx";
            tableName: "airdrops";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const airdropsOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    activity: z.ZodEnum<["public_beta"]>;
    userId: z.ZodString;
    amount: z.ZodString;
    rank: z.ZodNullable<z.ZodString>;
    detail: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    verify: z.ZodNullable<z.ZodString>;
    tx: z.ZodNullable<z.ZodString>;
}, "detail">, {
    detail: z.ZodNullable<z.ZodObject<{
        "Invitations count": z.ZodNumber;
        "Purchase lists cost": z.ZodNumber;
        "Total tip amount": z.ZodNumber;
        "Feeds subscriptions count": z.ZodNumber;
        "Lists subscriptions count": z.ZodNumber;
        "Inbox subscriptions count": z.ZodNumber;
        "Recent read count in the last month": z.ZodNumber;
        "Mint count": z.ZodNumber;
        "Claimed feeds count": z.ZodNumber;
        "Claimed feeds subscriptions count": z.ZodNumber;
        "Lists with more than 1 feed count": z.ZodNumber;
        "Created lists subscriptions count": z.ZodNumber;
        "Created lists income amount": z.ZodNumber;
        "GitHub Community Contributions": z.ZodNumber;
        "Invitations count Rank": z.ZodNumber;
        "Purchase lists cost Rank": z.ZodNumber;
        "Total tip amount Rank": z.ZodNumber;
        "Feeds subscriptions count Rank": z.ZodNumber;
        "Lists subscriptions count Rank": z.ZodNumber;
        "Inbox subscriptions count Rank": z.ZodNumber;
        "Recent read count in the last month Rank": z.ZodNumber;
        "Mint count Rank": z.ZodNumber;
        "Claimed feeds count Rank": z.ZodNumber;
        "Claimed feeds subscriptions count Rank": z.ZodNumber;
        "Lists with more than 1 feed count Rank": z.ZodNumber;
        "Created lists subscriptions count Rank": z.ZodNumber;
        "Created lists income amount Rank": z.ZodNumber;
        "GitHub Community Contributions Rank": z.ZodNumber;
    }, "strip", z.ZodTypeAny, {
        "Invitations count": number;
        "Purchase lists cost": number;
        "Total tip amount": number;
        "Feeds subscriptions count": number;
        "Lists subscriptions count": number;
        "Inbox subscriptions count": number;
        "Recent read count in the last month": number;
        "Mint count": number;
        "Claimed feeds count": number;
        "Claimed feeds subscriptions count": number;
        "Lists with more than 1 feed count": number;
        "Created lists subscriptions count": number;
        "Created lists income amount": number;
        "GitHub Community Contributions": number;
        "Invitations count Rank": number;
        "Purchase lists cost Rank": number;
        "Total tip amount Rank": number;
        "Feeds subscriptions count Rank": number;
        "Lists subscriptions count Rank": number;
        "Inbox subscriptions count Rank": number;
        "Recent read count in the last month Rank": number;
        "Mint count Rank": number;
        "Claimed feeds count Rank": number;
        "Claimed feeds subscriptions count Rank": number;
        "Lists with more than 1 feed count Rank": number;
        "Created lists subscriptions count Rank": number;
        "Created lists income amount Rank": number;
        "GitHub Community Contributions Rank": number;
    }, {
        "Invitations count": number;
        "Purchase lists cost": number;
        "Total tip amount": number;
        "Feeds subscriptions count": number;
        "Lists subscriptions count": number;
        "Inbox subscriptions count": number;
        "Recent read count in the last month": number;
        "Mint count": number;
        "Claimed feeds count": number;
        "Claimed feeds subscriptions count": number;
        "Lists with more than 1 feed count": number;
        "Created lists subscriptions count": number;
        "Created lists income amount": number;
        "GitHub Community Contributions": number;
        "Invitations count Rank": number;
        "Purchase lists cost Rank": number;
        "Total tip amount Rank": number;
        "Feeds subscriptions count Rank": number;
        "Lists subscriptions count Rank": number;
        "Inbox subscriptions count Rank": number;
        "Recent read count in the last month Rank": number;
        "Mint count Rank": number;
        "Claimed feeds count Rank": number;
        "Claimed feeds subscriptions count Rank": number;
        "Lists with more than 1 feed count Rank": number;
        "Created lists subscriptions count Rank": number;
        "Created lists income amount Rank": number;
        "GitHub Community Contributions Rank": number;
    }>>;
}>, "strip", z.ZodTypeAny, {
    userId: string;
    tx: string | null;
    activity: "public_beta";
    amount: string;
    rank: string | null;
    detail: {
        "Invitations count": number;
        "Purchase lists cost": number;
        "Total tip amount": number;
        "Feeds subscriptions count": number;
        "Lists subscriptions count": number;
        "Inbox subscriptions count": number;
        "Recent read count in the last month": number;
        "Mint count": number;
        "Claimed feeds count": number;
        "Claimed feeds subscriptions count": number;
        "Lists with more than 1 feed count": number;
        "Created lists subscriptions count": number;
        "Created lists income amount": number;
        "GitHub Community Contributions": number;
        "Invitations count Rank": number;
        "Purchase lists cost Rank": number;
        "Total tip amount Rank": number;
        "Feeds subscriptions count Rank": number;
        "Lists subscriptions count Rank": number;
        "Inbox subscriptions count Rank": number;
        "Recent read count in the last month Rank": number;
        "Mint count Rank": number;
        "Claimed feeds count Rank": number;
        "Claimed feeds subscriptions count Rank": number;
        "Lists with more than 1 feed count Rank": number;
        "Created lists subscriptions count Rank": number;
        "Created lists income amount Rank": number;
        "GitHub Community Contributions Rank": number;
    } | null;
    verify: string | null;
}, {
    userId: string;
    tx: string | null;
    activity: "public_beta";
    amount: string;
    rank: string | null;
    detail: {
        "Invitations count": number;
        "Purchase lists cost": number;
        "Total tip amount": number;
        "Feeds subscriptions count": number;
        "Lists subscriptions count": number;
        "Inbox subscriptions count": number;
        "Recent read count in the last month": number;
        "Mint count": number;
        "Claimed feeds count": number;
        "Claimed feeds subscriptions count": number;
        "Lists with more than 1 feed count": number;
        "Created lists subscriptions count": number;
        "Created lists income amount": number;
        "GitHub Community Contributions": number;
        "Invitations count Rank": number;
        "Purchase lists cost Rank": number;
        "Total tip amount Rank": number;
        "Feeds subscriptions count Rank": number;
        "Lists subscriptions count Rank": number;
        "Inbox subscriptions count Rank": number;
        "Recent read count in the last month Rank": number;
        "Mint count Rank": number;
        "Claimed feeds count Rank": number;
        "Claimed feeds subscriptions count Rank": number;
        "Lists with more than 1 feed count Rank": number;
        "Created lists subscriptions count Rank": number;
        "Created lists income amount Rank": number;
        "GitHub Community Contributions Rank": number;
    } | null;
    verify: string | null;
}>;

declare const collections: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "collections";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "collections";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        feedId: drizzle_orm_pg_core.PgColumn<{
            name: "feed_id";
            tableName: "collections";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        entryId: drizzle_orm_pg_core.PgColumn<{
            name: "entry_id";
            tableName: "collections";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "collections";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        view: drizzle_orm_pg_core.PgColumn<{
            name: "view";
            tableName: "collections";
            dataType: "number";
            columnType: "PgSmallInt";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const collectionsOpenAPISchema: zod.ZodObject<{
    userId: zod.ZodString;
    feedId: zod.ZodString;
    entryId: zod.ZodString;
    createdAt: zod.ZodString;
    view: zod.ZodNumber;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    createdAt: string;
    userId: string;
    view: number;
    feedId: string;
    entryId: string;
}, {
    createdAt: string;
    userId: string;
    view: number;
    feedId: string;
    entryId: string;
}>;
declare const collectionsRelations: drizzle_orm.Relations<"collections", {
    users: drizzle_orm.One<"user", true>;
    entries: drizzle_orm.One<"entries", true>;
    feeds: drizzle_orm.One<"feeds", true>;
}>;

type MediaModel = {
    url: string;
    type: "photo" | "video";
    preview_image_url?: string;
    width?: number;
    height?: number;
    blurhash?: string;
};
type AttachmentsModel = {
    url: string;
    duration_in_seconds?: number;
    mime_type?: string;
    size_in_bytes?: number;
    title?: string;
};
type ExtraModel = {
    links?: {
        url: string;
        type: string;
        content_html?: string;
    }[];
};
declare const CommonEntryFields: {
    id: drizzle_orm.HasRuntimeDefault<drizzle_orm.HasDefault<drizzle_orm.IsPrimaryKey<drizzle_orm.NotNull<drizzle_orm_pg_core.PgTextBuilder<{
        name: "id";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>>>>>;
    title: drizzle_orm_pg_core.PgTextBuilder<{
        name: "title";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    url: drizzle_orm_pg_core.PgTextBuilder<{
        name: "url";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    content: drizzle_orm_pg_core.PgTextBuilder<{
        name: "content";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    description: drizzle_orm_pg_core.PgTextBuilder<{
        name: "description";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    guid: drizzle_orm.NotNull<drizzle_orm_pg_core.PgTextBuilder<{
        name: "guid";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>>;
    author: drizzle_orm_pg_core.PgTextBuilder<{
        name: "author";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    authorUrl: drizzle_orm_pg_core.PgTextBuilder<{
        name: "author_url";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    authorAvatar: drizzle_orm_pg_core.PgTextBuilder<{
        name: "author_avatar";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    insertedAt: drizzle_orm.NotNull<drizzle_orm_pg_core.PgTimestampBuilderInitial<"inserted_at">>;
    publishedAt: drizzle_orm.NotNull<drizzle_orm_pg_core.PgTimestampBuilderInitial<"published_at">>;
    media: drizzle_orm.$Type<drizzle_orm_pg_core.PgJsonbBuilderInitial<"media">, MediaModel[]>;
    categories: drizzle_orm_pg_core.PgArrayBuilder<{
        name: "categories";
        dataType: "array";
        columnType: "PgArray";
        data: string[];
        driverParam: string | string[];
        enumValues: [string, ...string[]];
        size: undefined;
        baseBuilder: {
            name: "categories";
            dataType: "string";
            columnType: "PgText";
            data: string;
            enumValues: [string, ...string[]];
            driverParam: string;
        };
    }, {
        name: "categories";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
    attachments: drizzle_orm.$Type<drizzle_orm_pg_core.PgJsonbBuilderInitial<"attachments">, AttachmentsModel[]>;
    extra: drizzle_orm.$Type<drizzle_orm_pg_core.PgJsonbBuilderInitial<"extra">, ExtraModel>;
    language: drizzle_orm_pg_core.PgTextBuilder<{
        name: "language";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
    }>;
};
declare const entries: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "entries";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: drizzle_orm_pg_core.PgColumn<{
            name: "url";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        content: drizzle_orm_pg_core.PgColumn<{
            name: "content";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        guid: drizzle_orm_pg_core.PgColumn<{
            name: "guid";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        author: drizzle_orm_pg_core.PgColumn<{
            name: "author";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorUrl: drizzle_orm_pg_core.PgColumn<{
            name: "author_url";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorAvatar: drizzle_orm_pg_core.PgColumn<{
            name: "author_avatar";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        insertedAt: drizzle_orm_pg_core.PgColumn<{
            name: "inserted_at";
            tableName: "entries";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        publishedAt: drizzle_orm_pg_core.PgColumn<{
            name: "published_at";
            tableName: "entries";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        media: drizzle_orm_pg_core.PgColumn<{
            name: "media";
            tableName: "entries";
            dataType: "json";
            columnType: "PgJsonb";
            data: MediaModel[];
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: MediaModel[];
        }>;
        categories: drizzle_orm_pg_core.PgColumn<{
            name: "categories";
            tableName: "entries";
            dataType: "array";
            columnType: "PgArray";
            data: string[];
            driverParam: string | string[];
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: drizzle_orm.Column<{
                name: "categories";
                tableName: "entries";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            identity: undefined;
            generated: undefined;
        }, {}, {
            baseBuilder: drizzle_orm_pg_core.PgColumnBuilder<{
                name: "categories";
                dataType: "string";
                columnType: "PgText";
                data: string;
                enumValues: [string, ...string[]];
                driverParam: string;
            }, {}, {}, drizzle_orm.ColumnBuilderExtraConfig>;
            size: undefined;
        }>;
        attachments: drizzle_orm_pg_core.PgColumn<{
            name: "attachments";
            tableName: "entries";
            dataType: "json";
            columnType: "PgJsonb";
            data: AttachmentsModel[];
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: AttachmentsModel[];
        }>;
        extra: drizzle_orm_pg_core.PgColumn<{
            name: "extra";
            tableName: "entries";
            dataType: "json";
            columnType: "PgJsonb";
            data: ExtraModel;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: ExtraModel;
        }>;
        language: drizzle_orm_pg_core.PgColumn<{
            name: "language";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        feedId: drizzle_orm_pg_core.PgColumn<{
            name: "feed_id";
            tableName: "entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const attachmentsZodSchema: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
    url: z.ZodString;
    duration_in_seconds: z.ZodOptional<z.ZodNumber>;
    mime_type: z.ZodOptional<z.ZodString>;
    size_in_bytes: z.ZodOptional<z.ZodNumber>;
    title: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    url: string;
    title?: string | undefined;
    duration_in_seconds?: number | undefined;
    mime_type?: string | undefined;
    size_in_bytes?: number | undefined;
}, {
    url: string;
    title?: string | undefined;
    duration_in_seconds?: number | undefined;
    mime_type?: string | undefined;
    size_in_bytes?: number | undefined;
}>, "many">>>;
declare const mediaZodSchema: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
    url: z.ZodString;
    type: z.ZodEnum<["photo", "video"]>;
    width: z.ZodOptional<z.ZodNumber>;
    height: z.ZodOptional<z.ZodNumber>;
    preview_image_url: z.ZodOptional<z.ZodString>;
    blurhash: z.ZodOptional<z.ZodString>;
}, "strip", z.ZodTypeAny, {
    type: "photo" | "video";
    url: string;
    width?: number | undefined;
    height?: number | undefined;
    preview_image_url?: string | undefined;
    blurhash?: string | undefined;
}, {
    type: "photo" | "video";
    url: string;
    width?: number | undefined;
    height?: number | undefined;
    preview_image_url?: string | undefined;
    blurhash?: string | undefined;
}>, "many">>>;
declare const extraZodSchema: z.ZodNullable<z.ZodOptional<z.ZodObject<{
    links: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodString;
        content_html: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: string;
        url: string;
        content_html?: string | undefined;
    }, {
        type: string;
        url: string;
        content_html?: string | undefined;
    }>, "many">>>;
}, "strip", z.ZodTypeAny, {
    links?: {
        type: string;
        url: string;
        content_html?: string | undefined;
    }[] | null | undefined;
}, {
    links?: {
        type: string;
        url: string;
        content_html?: string | undefined;
    }[] | null | undefined;
}>>>;
declare const entriesOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    title: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    content: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    guid: z.ZodString;
    author: z.ZodNullable<z.ZodString>;
    authorUrl: z.ZodNullable<z.ZodString>;
    authorAvatar: z.ZodNullable<z.ZodString>;
    insertedAt: z.ZodString;
    publishedAt: z.ZodString;
    media: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    categories: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    extra: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    language: z.ZodNullable<z.ZodString>;
    feedId: z.ZodString;
}, "media" | "attachments" | "extra">, {
    attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        duration_in_seconds: z.ZodOptional<z.ZodNumber>;
        mime_type: z.ZodOptional<z.ZodString>;
        size_in_bytes: z.ZodOptional<z.ZodNumber>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }, {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }>, "many">>>;
    media: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodEnum<["photo", "video"]>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        preview_image_url: z.ZodOptional<z.ZodString>;
        blurhash: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }>, "many">>>;
    extra: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        links: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            type: z.ZodString;
            content_html: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            url: string;
            content_html?: string | undefined;
        }, {
            type: string;
            url: string;
            content_html?: string | undefined;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    }, {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    }>>>;
}>, "strip", z.ZodTypeAny, {
    description: string | null;
    title: string | null;
    content: string | null;
    id: string;
    author: string | null;
    url: string | null;
    language: string | null;
    feedId: string;
    guid: string;
    categories: string[] | null;
    authorUrl: string | null;
    authorAvatar: string | null;
    insertedAt: string;
    publishedAt: string;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
    extra?: {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    } | null | undefined;
}, {
    description: string | null;
    title: string | null;
    content: string | null;
    id: string;
    author: string | null;
    url: string | null;
    language: string | null;
    feedId: string;
    guid: string;
    categories: string[] | null;
    authorUrl: string | null;
    authorAvatar: string | null;
    insertedAt: string;
    publishedAt: string;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
    extra?: {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    } | null | undefined;
}>;
declare const entriesRelations: drizzle_orm.Relations<"entries", {
    feeds: drizzle_orm.One<"feeds", true>;
    collections: drizzle_orm.Many<"collections">;
    feedPowerTokens: drizzle_orm.One<"feedPowerTokens", true>;
    entryReadHistories: drizzle_orm.One<"entryReadHistories", true>;
}>;
type EntriesModel = InferInsertModel<typeof entries> & {
    attachments?: AttachmentsModel[] | null;
    media?: MediaModel[] | null;
};
declare const entryReadHistories: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "entryReadHistories";
    schema: undefined;
    columns: {
        entryId: drizzle_orm_pg_core.PgColumn<{
            name: "entry_id";
            tableName: "entryReadHistories";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userIds: drizzle_orm_pg_core.PgColumn<{
            name: "user_ids";
            tableName: "entryReadHistories";
            dataType: "array";
            columnType: "PgArray";
            data: string[];
            driverParam: string | string[];
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: drizzle_orm.Column<{
                name: "user_ids";
                tableName: "entryReadHistories";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            identity: undefined;
            generated: undefined;
        }, {}, {
            baseBuilder: drizzle_orm_pg_core.PgColumnBuilder<{
                name: "user_ids";
                dataType: "string";
                columnType: "PgText";
                data: string;
                enumValues: [string, ...string[]];
                driverParam: string;
            }, {}, {}, drizzle_orm.ColumnBuilderExtraConfig>;
            size: undefined;
        }>;
        readCount: drizzle_orm_pg_core.PgColumn<{
            name: "read_count";
            tableName: "entryReadHistories";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const entryReadHistoriesRelations: drizzle_orm.Relations<"entryReadHistories", {
    entry: drizzle_orm.One<"entries", true>;
}>;
type EntryReadHistoriesModel = InferInsertModel<typeof entryReadHistories>;
declare const entryReadHistoriesOpenAPISchema: z.ZodObject<{
    entryId: z.ZodString;
    userIds: z.ZodArray<z.ZodString, "many">;
    readCount: z.ZodNumber;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    entryId: string;
    userIds: string[];
    readCount: number;
}, {
    entryId: string;
    userIds: string[];
    readCount: number;
}>;
declare const urlReads: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "urlReads";
    schema: undefined;
    columns: {
        url: drizzle_orm_pg_core.PgColumn<{
            name: "url";
            tableName: "urlReads";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userIds: drizzle_orm_pg_core.PgColumn<{
            name: "user_ids";
            tableName: "urlReads";
            dataType: "array";
            columnType: "PgArray";
            data: string[];
            driverParam: string | string[];
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: drizzle_orm.Column<{
                name: "user_ids";
                tableName: "urlReads";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            identity: undefined;
            generated: undefined;
        }, {}, {
            baseBuilder: drizzle_orm_pg_core.PgColumnBuilder<{
                name: "user_ids";
                dataType: "string";
                columnType: "PgText";
                data: string;
                enumValues: [string, ...string[]];
                driverParam: string;
            }, {}, {}, drizzle_orm.ColumnBuilderExtraConfig>;
            size: undefined;
        }>;
        count: drizzle_orm_pg_core.PgColumn<{
            name: "count";
            tableName: "urlReads";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
type UrlReadsModel = InferInsertModel<typeof urlReads>;
declare const urlReadsOpenAPISchema: z.ZodObject<{
    url: z.ZodString;
    userIds: z.ZodArray<z.ZodString, "many">;
    count: z.ZodNumber;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    url: string;
    userIds: string[];
    count: number;
}, {
    url: string;
    userIds: string[];
    count: number;
}>;

declare const feeds: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "feeds";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: drizzle_orm_pg_core.PgColumn<{
            name: "url";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        siteUrl: drizzle_orm_pg_core.PgColumn<{
            name: "site_url";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        image: drizzle_orm_pg_core.PgColumn<{
            name: "image";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        checkedAt: drizzle_orm_pg_core.PgColumn<{
            name: "checked_at";
            tableName: "feeds";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        lastModifiedHeader: drizzle_orm_pg_core.PgColumn<{
            name: "last_modified_header";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        etagHeader: drizzle_orm_pg_core.PgColumn<{
            name: "etag_header";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        ttl: drizzle_orm_pg_core.PgColumn<{
            name: "ttl";
            tableName: "feeds";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        errorMessage: drizzle_orm_pg_core.PgColumn<{
            name: "error_message";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        errorAt: drizzle_orm_pg_core.PgColumn<{
            name: "error_at";
            tableName: "feeds";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        ownerUserId: drizzle_orm_pg_core.PgColumn<{
            name: "owner_user_id";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        language: drizzle_orm_pg_core.PgColumn<{
            name: "language";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        migrateTo: drizzle_orm_pg_core.PgColumn<{
            name: "migrate_to";
            tableName: "feeds";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const feedsOpenAPISchema: zod.ZodObject<{
    id: zod.ZodString;
    url: zod.ZodString;
    title: zod.ZodNullable<zod.ZodString>;
    description: zod.ZodNullable<zod.ZodString>;
    siteUrl: zod.ZodNullable<zod.ZodString>;
    image: zod.ZodNullable<zod.ZodString>;
    checkedAt: zod.ZodString;
    lastModifiedHeader: zod.ZodNullable<zod.ZodString>;
    etagHeader: zod.ZodNullable<zod.ZodString>;
    ttl: zod.ZodNullable<zod.ZodNumber>;
    errorMessage: zod.ZodNullable<zod.ZodString>;
    errorAt: zod.ZodNullable<zod.ZodString>;
    ownerUserId: zod.ZodNullable<zod.ZodString>;
    language: zod.ZodNullable<zod.ZodString>;
    migrateTo: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    description: string | null;
    title: string | null;
    id: string;
    image: string | null;
    url: string;
    siteUrl: string | null;
    checkedAt: string;
    lastModifiedHeader: string | null;
    etagHeader: string | null;
    ttl: number | null;
    errorMessage: string | null;
    errorAt: string | null;
    ownerUserId: string | null;
    language: string | null;
    migrateTo: string | null;
}, {
    description: string | null;
    title: string | null;
    id: string;
    image: string | null;
    url: string;
    siteUrl: string | null;
    checkedAt: string;
    lastModifiedHeader: string | null;
    etagHeader: string | null;
    ttl: number | null;
    errorMessage: string | null;
    errorAt: string | null;
    ownerUserId: string | null;
    language: string | null;
    migrateTo: string | null;
}>;
declare const feedsRelations: drizzle_orm.Relations<"feeds", {
    subscriptions: drizzle_orm.Many<"subscriptions">;
    entries: drizzle_orm.Many<"entries">;
    owner: drizzle_orm.One<"user", false>;
    migrateTo: drizzle_orm.One<"feeds", false>;
}>;
type FeedModel = InferInsertModel<typeof feeds>;

declare const subscriptions: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "subscriptions";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        feedId: drizzle_orm_pg_core.PgColumn<{
            name: "feed_id";
            tableName: "subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        view: drizzle_orm_pg_core.PgColumn<{
            name: "view";
            tableName: "subscriptions";
            dataType: "number";
            columnType: "PgSmallInt";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        category: drizzle_orm_pg_core.PgColumn<{
            name: "category";
            tableName: "subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "subscriptions";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isPrivate: drizzle_orm_pg_core.PgColumn<{
            name: "is_private";
            tableName: "subscriptions";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const subscriptionsOpenAPISchema: zod.ZodObject<{
    userId: zod.ZodString;
    feedId: zod.ZodString;
    view: zod.ZodNumber;
    category: zod.ZodNullable<zod.ZodString>;
    title: zod.ZodNullable<zod.ZodString>;
    createdAt: zod.ZodString;
    isPrivate: zod.ZodBoolean;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    title: string | null;
    createdAt: string;
    userId: string;
    view: number;
    category: string | null;
    feedId: string;
    isPrivate: boolean;
}, {
    title: string | null;
    createdAt: string;
    userId: string;
    view: number;
    category: string | null;
    feedId: string;
    isPrivate: boolean;
}>;
declare const subscriptionsRelations: drizzle_orm.Relations<"subscriptions", {
    users: drizzle_orm.One<"user", true>;
    feeds: drizzle_orm.One<"feeds", true>;
    timeline: drizzle_orm.Many<"timeline">;
    rsshubUsage: drizzle_orm.One<"rsshub_usage", true>;
}>;

declare const timeline: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "timeline";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "timeline";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        feedId: drizzle_orm_pg_core.PgColumn<{
            name: "feedId";
            tableName: "timeline";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        entryId: drizzle_orm_pg_core.PgColumn<{
            name: "entry_id";
            tableName: "timeline";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        publishedAt: drizzle_orm_pg_core.PgColumn<{
            name: "published_at";
            tableName: "timeline";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        insertedAt: drizzle_orm_pg_core.PgColumn<{
            name: "inserted_at";
            tableName: "timeline";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        view: drizzle_orm_pg_core.PgColumn<{
            name: "view";
            tableName: "timeline";
            dataType: "number";
            columnType: "PgSmallInt";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        read: drizzle_orm_pg_core.PgColumn<{
            name: "read";
            tableName: "timeline";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const timelineOpenAPISchema: zod.ZodObject<{
    userId: zod.ZodString;
    feedId: zod.ZodString;
    entryId: zod.ZodString;
    publishedAt: zod.ZodString;
    insertedAt: zod.ZodString;
    view: zod.ZodNumber;
    read: zod.ZodNullable<zod.ZodBoolean>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    userId: string;
    view: number;
    feedId: string;
    insertedAt: string;
    publishedAt: string;
    entryId: string;
    read: boolean | null;
}, {
    userId: string;
    view: number;
    feedId: string;
    insertedAt: string;
    publishedAt: string;
    entryId: string;
    read: boolean | null;
}>;
declare const timelineRelations: drizzle_orm.Relations<"timeline", {
    entries: drizzle_orm.One<"entries", true>;
    feeds: drizzle_orm.One<"feeds", true>;
    collections: drizzle_orm.One<"collections", true>;
    subscriptions: drizzle_orm.One<"subscriptions", true>;
}>;

declare const inboxesEntries: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "inboxes_entries";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        url: drizzle_orm_pg_core.PgColumn<{
            name: "url";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        content: drizzle_orm_pg_core.PgColumn<{
            name: "content";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        guid: drizzle_orm_pg_core.PgColumn<{
            name: "guid";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        author: drizzle_orm_pg_core.PgColumn<{
            name: "author";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorUrl: drizzle_orm_pg_core.PgColumn<{
            name: "author_url";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        authorAvatar: drizzle_orm_pg_core.PgColumn<{
            name: "author_avatar";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        insertedAt: drizzle_orm_pg_core.PgColumn<{
            name: "inserted_at";
            tableName: "inboxes_entries";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        publishedAt: drizzle_orm_pg_core.PgColumn<{
            name: "published_at";
            tableName: "inboxes_entries";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        media: drizzle_orm_pg_core.PgColumn<{
            name: "media";
            tableName: "inboxes_entries";
            dataType: "json";
            columnType: "PgJsonb";
            data: MediaModel[];
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: MediaModel[];
        }>;
        categories: drizzle_orm_pg_core.PgColumn<{
            name: "categories";
            tableName: "inboxes_entries";
            dataType: "array";
            columnType: "PgArray";
            data: string[];
            driverParam: string | string[];
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: drizzle_orm.Column<{
                name: "categories";
                tableName: "inboxes_entries";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            identity: undefined;
            generated: undefined;
        }, {}, {
            baseBuilder: drizzle_orm_pg_core.PgColumnBuilder<{
                name: "categories";
                dataType: "string";
                columnType: "PgText";
                data: string;
                enumValues: [string, ...string[]];
                driverParam: string;
            }, {}, {}, drizzle_orm.ColumnBuilderExtraConfig>;
            size: undefined;
        }>;
        attachments: drizzle_orm_pg_core.PgColumn<{
            name: "attachments";
            tableName: "inboxes_entries";
            dataType: "json";
            columnType: "PgJsonb";
            data: AttachmentsModel[];
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: AttachmentsModel[];
        }>;
        extra: drizzle_orm_pg_core.PgColumn<{
            name: "extra";
            tableName: "inboxes_entries";
            dataType: "json";
            columnType: "PgJsonb";
            data: ExtraModel;
            driverParam: unknown;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: ExtraModel;
        }>;
        language: drizzle_orm_pg_core.PgColumn<{
            name: "language";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        inboxHandle: drizzle_orm_pg_core.PgColumn<{
            name: "inbox_handle";
            tableName: "inboxes_entries";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        read: drizzle_orm_pg_core.PgColumn<{
            name: "read";
            tableName: "inboxes_entries";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const inboxesEntriesOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    title: z.ZodNullable<z.ZodString>;
    url: z.ZodNullable<z.ZodString>;
    content: z.ZodNullable<z.ZodString>;
    description: z.ZodNullable<z.ZodString>;
    guid: z.ZodString;
    author: z.ZodNullable<z.ZodString>;
    authorUrl: z.ZodNullable<z.ZodString>;
    authorAvatar: z.ZodNullable<z.ZodString>;
    insertedAt: z.ZodString;
    publishedAt: z.ZodString;
    media: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    categories: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    extra: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    language: z.ZodNullable<z.ZodString>;
    inboxHandle: z.ZodString;
    read: z.ZodNullable<z.ZodBoolean>;
}, "media" | "attachments" | "extra">, {
    attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        duration_in_seconds: z.ZodOptional<z.ZodNumber>;
        mime_type: z.ZodOptional<z.ZodString>;
        size_in_bytes: z.ZodOptional<z.ZodNumber>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }, {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }>, "many">>>;
    media: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodEnum<["photo", "video"]>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        preview_image_url: z.ZodOptional<z.ZodString>;
        blurhash: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }>, "many">>>;
    extra: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        links: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            type: z.ZodString;
            content_html: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            url: string;
            content_html?: string | undefined;
        }, {
            type: string;
            url: string;
            content_html?: string | undefined;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    }, {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    }>>>;
}>, "strip", z.ZodTypeAny, {
    description: string | null;
    title: string | null;
    content: string | null;
    id: string;
    author: string | null;
    url: string | null;
    language: string | null;
    guid: string;
    categories: string[] | null;
    authorUrl: string | null;
    authorAvatar: string | null;
    insertedAt: string;
    publishedAt: string;
    read: boolean | null;
    inboxHandle: string;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
    extra?: {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    } | null | undefined;
}, {
    description: string | null;
    title: string | null;
    content: string | null;
    id: string;
    author: string | null;
    url: string | null;
    language: string | null;
    guid: string;
    categories: string[] | null;
    authorUrl: string | null;
    authorAvatar: string | null;
    insertedAt: string;
    publishedAt: string;
    read: boolean | null;
    inboxHandle: string;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
    extra?: {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    } | null | undefined;
}>;
declare const inboxesEntriesInsertOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    description: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    title: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    content: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    id: z.ZodOptional<z.ZodString>;
    author: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    url: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    language: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    guid: z.ZodString;
    media: z.ZodOptional<z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>>;
    categories: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    attachments: z.ZodOptional<z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>>;
    extra: z.ZodOptional<z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | (string | number | boolean | /*elided*/ any | /*elided*/ any | null)[] | null;
    } | (string | number | boolean | {
        [key: string]: string | number | boolean | /*elided*/ any | /*elided*/ any | null;
    } | /*elided*/ any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>>;
    authorUrl: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    authorAvatar: z.ZodOptional<z.ZodNullable<z.ZodString>>;
    insertedAt: z.ZodString;
    publishedAt: z.ZodString;
    read: z.ZodOptional<z.ZodNullable<z.ZodBoolean>>;
    inboxHandle: z.ZodString;
}, "id" | "media" | "attachments" | "extra" | "insertedAt" | "publishedAt" | "inboxHandle">, {
    attachments: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        duration_in_seconds: z.ZodOptional<z.ZodNumber>;
        mime_type: z.ZodOptional<z.ZodString>;
        size_in_bytes: z.ZodOptional<z.ZodNumber>;
        title: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }, {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }>, "many">>>;
    media: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        url: z.ZodString;
        type: z.ZodEnum<["photo", "video"]>;
        width: z.ZodOptional<z.ZodNumber>;
        height: z.ZodOptional<z.ZodNumber>;
        preview_image_url: z.ZodOptional<z.ZodString>;
        blurhash: z.ZodOptional<z.ZodString>;
    }, "strip", z.ZodTypeAny, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }>, "many">>>;
    extra: z.ZodNullable<z.ZodOptional<z.ZodObject<{
        links: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
            url: z.ZodString;
            type: z.ZodString;
            content_html: z.ZodOptional<z.ZodString>;
        }, "strip", z.ZodTypeAny, {
            type: string;
            url: string;
            content_html?: string | undefined;
        }, {
            type: string;
            url: string;
            content_html?: string | undefined;
        }>, "many">>>;
    }, "strip", z.ZodTypeAny, {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    }, {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    }>>>;
    publishedAt: z.ZodString;
}>, "strip", z.ZodTypeAny, {
    guid: string;
    publishedAt: string;
    description?: string | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    author?: string | null | undefined;
    url?: string | null | undefined;
    language?: string | null | undefined;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }[] | null | undefined;
    categories?: string[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
    extra?: {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    } | null | undefined;
    authorUrl?: string | null | undefined;
    authorAvatar?: string | null | undefined;
    read?: boolean | null | undefined;
}, {
    guid: string;
    publishedAt: string;
    description?: string | null | undefined;
    title?: string | null | undefined;
    content?: string | null | undefined;
    author?: string | null | undefined;
    url?: string | null | undefined;
    language?: string | null | undefined;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
        blurhash?: string | undefined;
    }[] | null | undefined;
    categories?: string[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
    extra?: {
        links?: {
            type: string;
            url: string;
            content_html?: string | undefined;
        }[] | null | undefined;
    } | null | undefined;
    authorUrl?: string | null | undefined;
    authorAvatar?: string | null | undefined;
    read?: boolean | null | undefined;
}>;
declare const inboxesEntriesRelations: drizzle_orm.Relations<"inboxes_entries", {
    inboxes: drizzle_orm.One<"inboxes", true>;
}>;
type inboxesEntriesModel = InferInsertModel<typeof inboxesEntries> & {
    attachments?: AttachmentsModel[] | null;
    media?: MediaModel[] | null;
};

declare const inboxes: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "inboxes";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "inboxes";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        handle: drizzle_orm_pg_core.PgColumn<{
            name: "handle";
            tableName: "inboxes";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        secret: drizzle_orm_pg_core.PgColumn<{
            name: "secret";
            tableName: "inboxes";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "inboxes";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const inboxesOpenAPISchema: z.ZodObject<{
    userId: z.ZodString;
    handle: z.ZodString;
    secret: z.ZodString;
    title: z.ZodNullable<z.ZodString>;
}, z.UnknownKeysParam, z.ZodTypeAny, {
    title: string | null;
    handle: string;
    userId: string;
    secret: string;
}, {
    title: string | null;
    handle: string;
    userId: string;
    secret: string;
}>;
declare const inboxesRelations: drizzle_orm.Relations<"inboxes", {
    users: drizzle_orm.One<"user", true>;
    entries: drizzle_orm.Many<"inboxes_entries">;
}>;
declare const inboxHandleSchema: z.ZodString;

declare const invitations: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "invitations";
    schema: undefined;
    columns: {
        code: drizzle_orm_pg_core.PgColumn<{
            name: "code";
            tableName: "invitations";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "invitations";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        usedAt: drizzle_orm_pg_core.PgColumn<{
            name: "used_at";
            tableName: "invitations";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        fromUserId: drizzle_orm_pg_core.PgColumn<{
            name: "from_user_id";
            tableName: "invitations";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        toUserId: drizzle_orm_pg_core.PgColumn<{
            name: "to_user_id";
            tableName: "invitations";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const invitationsOpenAPISchema: zod.ZodObject<{
    code: zod.ZodString;
    createdAt: zod.ZodNullable<zod.ZodString>;
    usedAt: zod.ZodNullable<zod.ZodString>;
    fromUserId: zod.ZodString;
    toUserId: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    code: string;
    createdAt: string | null;
    usedAt: string | null;
    fromUserId: string;
    toUserId: string | null;
}, {
    code: string;
    createdAt: string | null;
    usedAt: string | null;
    fromUserId: string;
    toUserId: string | null;
}>;
declare const invitationsRelations: drizzle_orm.Relations<"invitations", {
    users: drizzle_orm.One<"user", false>;
}>;

declare const lists: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "lists";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "lists";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        feedIds: drizzle_orm_pg_core.PgColumn<{
            name: "feed_ids";
            tableName: "lists";
            dataType: "array";
            columnType: "PgArray";
            data: string[];
            driverParam: string | string[];
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: drizzle_orm.Column<{
                name: "feed_ids";
                tableName: "lists";
                dataType: "string";
                columnType: "PgText";
                data: string;
                driverParam: string;
                notNull: false;
                hasDefault: false;
                isPrimaryKey: false;
                isAutoincrement: false;
                hasRuntimeDefault: false;
                enumValues: [string, ...string[]];
                baseColumn: never;
                identity: undefined;
                generated: undefined;
            }, {}, {}>;
            identity: undefined;
            generated: undefined;
        }, {}, {
            baseBuilder: drizzle_orm_pg_core.PgColumnBuilder<{
                name: "feed_ids";
                dataType: "string";
                columnType: "PgText";
                data: string;
                enumValues: [string, ...string[]];
                driverParam: string;
            }, {}, {}, drizzle_orm.ColumnBuilderExtraConfig>;
            size: undefined;
        }>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "lists";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "lists";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        image: drizzle_orm_pg_core.PgColumn<{
            name: "image";
            tableName: "lists";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        view: drizzle_orm_pg_core.PgColumn<{
            name: "view";
            tableName: "lists";
            dataType: "number";
            columnType: "PgSmallInt";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        fee: drizzle_orm_pg_core.PgColumn<{
            name: "fee";
            tableName: "lists";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        timelineUpdatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "timeline_updated_at";
            tableName: "lists";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        language: drizzle_orm_pg_core.PgColumn<{
            name: "language";
            tableName: "lists";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        ownerUserId: drizzle_orm_pg_core.PgColumn<{
            name: "owner_user_id";
            tableName: "lists";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const listsOpenAPISchema: zod.ZodObject<{
    id: zod.ZodString;
    feedIds: zod.ZodArray<zod.ZodString, "many">;
    title: zod.ZodString;
    description: zod.ZodNullable<zod.ZodString>;
    image: zod.ZodNullable<zod.ZodString>;
    view: zod.ZodNumber;
    fee: zod.ZodNumber;
    timelineUpdatedAt: zod.ZodString;
    language: zod.ZodNullable<zod.ZodString>;
    ownerUserId: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    description: string | null;
    title: string;
    id: string;
    image: string | null;
    view: number;
    ownerUserId: string;
    language: string | null;
    feedIds: string[];
    fee: number;
    timelineUpdatedAt: string;
}, {
    description: string | null;
    title: string;
    id: string;
    image: string | null;
    view: number;
    ownerUserId: string;
    language: string | null;
    feedIds: string[];
    fee: number;
    timelineUpdatedAt: string;
}>;
declare const listsRelations: drizzle_orm.Relations<"lists", {
    owner: drizzle_orm.One<"user", true>;
    listsSubscriptions: drizzle_orm.Many<"lists_subscriptions">;
}>;

declare const listsSubscriptions: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "lists_subscriptions";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "lists_subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        listId: drizzle_orm_pg_core.PgColumn<{
            name: "list_id";
            tableName: "lists_subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        view: drizzle_orm_pg_core.PgColumn<{
            name: "view";
            tableName: "lists_subscriptions";
            dataType: "number";
            columnType: "PgSmallInt";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        title: drizzle_orm_pg_core.PgColumn<{
            name: "title";
            tableName: "lists_subscriptions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        lastViewedAt: drizzle_orm_pg_core.PgColumn<{
            name: "last_viewed_at";
            tableName: "lists_subscriptions";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "lists_subscriptions";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        isPrivate: drizzle_orm_pg_core.PgColumn<{
            name: "is_private";
            tableName: "lists_subscriptions";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const listsSubscriptionsOpenAPISchema: zod.ZodObject<{
    userId: zod.ZodString;
    listId: zod.ZodString;
    view: zod.ZodNumber;
    title: zod.ZodNullable<zod.ZodString>;
    lastViewedAt: zod.ZodNullable<zod.ZodString>;
    createdAt: zod.ZodString;
    isPrivate: zod.ZodBoolean;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    title: string | null;
    createdAt: string;
    userId: string;
    view: number;
    isPrivate: boolean;
    listId: string;
    lastViewedAt: string | null;
}, {
    title: string | null;
    createdAt: string;
    userId: string;
    view: number;
    isPrivate: boolean;
    listId: string;
    lastViewedAt: string | null;
}>;
declare const listsSubscriptionsRelations: drizzle_orm.Relations<"lists_subscriptions", {
    users: drizzle_orm.One<"user", true>;
    lists: drizzle_orm.One<"lists", true>;
}>;

declare const listsTimeline: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "lists_timeline";
    schema: undefined;
    columns: {
        listId: drizzle_orm_pg_core.PgColumn<{
            name: "list_id";
            tableName: "lists_timeline";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        feedId: drizzle_orm_pg_core.PgColumn<{
            name: "feedId";
            tableName: "lists_timeline";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        entryId: drizzle_orm_pg_core.PgColumn<{
            name: "entry_id";
            tableName: "lists_timeline";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        insertedAt: drizzle_orm_pg_core.PgColumn<{
            name: "inserted_at";
            tableName: "lists_timeline";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const listsTimelineOpenAPISchema: zod.ZodObject<{
    listId: zod.ZodString;
    feedId: zod.ZodString;
    entryId: zod.ZodString;
    insertedAt: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    feedId: string;
    insertedAt: string;
    entryId: string;
    listId: string;
}, {
    feedId: string;
    insertedAt: string;
    entryId: string;
    listId: string;
}>;
declare const listsTimelineRelations: drizzle_orm.Relations<"lists_timeline", {
    entries: drizzle_orm.One<"entries", true>;
    feeds: drizzle_orm.One<"feeds", true>;
}>;

declare const messaging: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "messaging";
    schema: undefined;
    columns: {
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "messaging";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        token: drizzle_orm_pg_core.PgColumn<{
            name: "token";
            tableName: "messaging";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        channel: drizzle_orm_pg_core.PgColumn<{
            name: "channel";
            tableName: "messaging";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const messagingOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    userId: z.ZodNullable<z.ZodString>;
    token: z.ZodString;
    channel: z.ZodString;
}, "channel">, {
    channel: z.ZodEnum<["desktop", "mobile"]>;
}>, "strip", z.ZodTypeAny, {
    userId: string | null;
    token: string;
    channel: "desktop" | "mobile";
}, {
    userId: string | null;
    token: string;
    channel: "desktop" | "mobile";
}>;
declare const messagingRelations: drizzle_orm.Relations<"messaging", {
    users: drizzle_orm.One<"user", false>;
}>;
declare enum MessagingType {
    NewEntry = "new-entry"
}
type MessagingData = {
    type: MessagingType.NewEntry;
    feedId: string;
    entryId: string;
    view: string;
    title: string;
    description: string;
};

declare const rsshub: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "rsshub";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "rsshub";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        baseUrl: drizzle_orm_pg_core.PgColumn<{
            name: "base_url";
            tableName: "rsshub";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        accessKey: drizzle_orm_pg_core.PgColumn<{
            name: "access_key";
            tableName: "rsshub";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        ownerUserId: drizzle_orm_pg_core.PgColumn<{
            name: "owner_user_id";
            tableName: "rsshub";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        price: drizzle_orm_pg_core.PgColumn<{
            name: "price";
            tableName: "rsshub";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        description: drizzle_orm_pg_core.PgColumn<{
            name: "description";
            tableName: "rsshub";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userLimit: drizzle_orm_pg_core.PgColumn<{
            name: "user_limit";
            tableName: "rsshub";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const rsshubOpenAPISchema: zod.ZodObject<{
    id: zod.ZodString;
    baseUrl: zod.ZodString;
    accessKey: zod.ZodNullable<zod.ZodString>;
    ownerUserId: zod.ZodString;
    price: zod.ZodNumber;
    description: zod.ZodNullable<zod.ZodString>;
    userLimit: zod.ZodNullable<zod.ZodNumber>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    description: string | null;
    id: string;
    ownerUserId: string;
    baseUrl: string;
    accessKey: string | null;
    price: number;
    userLimit: number | null;
}, {
    description: string | null;
    id: string;
    ownerUserId: string;
    baseUrl: string;
    accessKey: string | null;
    price: number;
    userLimit: number | null;
}>;
declare const rsshubUsage: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "rsshub_usage";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "rsshub_usage";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        rsshubId: drizzle_orm_pg_core.PgColumn<{
            name: "rsshub_id";
            tableName: "rsshub_usage";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "rsshub_usage";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const rsshubUsageOpenAPISchema: zod.ZodObject<{
    id: zod.ZodString;
    rsshubId: zod.ZodString;
    userId: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    id: string;
    userId: string;
    rsshubId: string;
}, {
    id: string;
    userId: string;
    rsshubId: string;
}>;
declare const rsshubUsageRelations: drizzle_orm.Relations<"rsshub_usage", {
    rsshub: drizzle_orm.One<"rsshub", true>;
}>;

declare const settings: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "settings";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "settings";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "settings";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        tab: drizzle_orm_pg_core.PgColumn<{
            name: "tab";
            tableName: "settings";
            dataType: "string";
            columnType: "PgText";
            data: "general" | "appearance" | "integration";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["general", "appearance", "integration"];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        payload: drizzle_orm_pg_core.PgColumn<{
            name: "payload";
            tableName: "settings";
            dataType: "json";
            columnType: "PgJsonb";
            data: Record<string, any>;
            driverParam: unknown;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {
            $type: Record<string, any>;
        }>;
        updateAt: drizzle_orm_pg_core.PgColumn<{
            name: "update_at";
            tableName: "settings";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        version: drizzle_orm_pg_core.PgColumn<{
            name: "version";
            tableName: "settings";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const user: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "user";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        emailVerified: drizzle_orm_pg_core.PgColumn<{
            name: "emailVerified";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        image: drizzle_orm_pg_core.PgColumn<{
            name: "image";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        handle: drizzle_orm_pg_core.PgColumn<{
            name: "handle";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updatedAt";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        twoFactorEnabled: drizzle_orm_pg_core.PgColumn<{
            name: "two_factor_enabled";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const users: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "user";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        name: drizzle_orm_pg_core.PgColumn<{
            name: "name";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        email: drizzle_orm_pg_core.PgColumn<{
            name: "email";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        emailVerified: drizzle_orm_pg_core.PgColumn<{
            name: "emailVerified";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        image: drizzle_orm_pg_core.PgColumn<{
            name: "image";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        handle: drizzle_orm_pg_core.PgColumn<{
            name: "handle";
            tableName: "user";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updatedAt";
            tableName: "user";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        twoFactorEnabled: drizzle_orm_pg_core.PgColumn<{
            name: "two_factor_enabled";
            tableName: "user";
            dataType: "boolean";
            columnType: "PgBoolean";
            data: boolean;
            driverParam: boolean;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare function lower(handle: AnyPgColumn): SQL;
declare const usersOpenApiSchema: zod.ZodObject<Omit<{
    id: zod.ZodString;
    name: zod.ZodNullable<zod.ZodString>;
    email: zod.ZodString;
    emailVerified: zod.ZodNullable<zod.ZodBoolean>;
    image: zod.ZodNullable<zod.ZodString>;
    handle: zod.ZodNullable<zod.ZodString>;
    createdAt: zod.ZodDate;
    updatedAt: zod.ZodDate;
    twoFactorEnabled: zod.ZodNullable<zod.ZodBoolean>;
}, "email">, "strip", zod.ZodTypeAny, {
    name: string | null;
    id: string;
    emailVerified: boolean | null;
    image: string | null;
    handle: string | null;
    createdAt: Date;
    updatedAt: Date;
    twoFactorEnabled: boolean | null;
}, {
    name: string | null;
    id: string;
    emailVerified: boolean | null;
    image: string | null;
    handle: string | null;
    createdAt: Date;
    updatedAt: Date;
    twoFactorEnabled: boolean | null;
}>;
declare const account: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "account";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "userId";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        providerId: drizzle_orm_pg_core.PgColumn<{
            name: "provider";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        accountId: drizzle_orm_pg_core.PgColumn<{
            name: "providerAccountId";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        refreshToken: drizzle_orm_pg_core.PgColumn<{
            name: "refresh_token";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        accessToken: drizzle_orm_pg_core.PgColumn<{
            name: "access_token";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        accessTokenExpiresAt: drizzle_orm_pg_core.PgColumn<{
            name: "expires_at";
            tableName: "account";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        refreshTokenExpiresAt: drizzle_orm_pg_core.PgColumn<{
            name: "refreshTokenExpiresAt";
            tableName: "account";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        scope: drizzle_orm_pg_core.PgColumn<{
            name: "scope";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        idToken: drizzle_orm_pg_core.PgColumn<{
            name: "id_token";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        password: drizzle_orm_pg_core.PgColumn<{
            name: "password";
            tableName: "account";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "createdAt";
            tableName: "account";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updatedAt";
            tableName: "account";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const session: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "session";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "session";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        token: drizzle_orm_pg_core.PgColumn<{
            name: "sessionToken";
            tableName: "session";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "userId";
            tableName: "session";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        expiresAt: drizzle_orm_pg_core.PgColumn<{
            name: "expires";
            tableName: "session";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "createdAt";
            tableName: "session";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updatedAt";
            tableName: "session";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        ipAddress: drizzle_orm_pg_core.PgColumn<{
            name: "ipAddress";
            tableName: "session";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userAgent: drizzle_orm_pg_core.PgColumn<{
            name: "userAgent";
            tableName: "session";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const verification: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "verificationToken";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "verificationToken";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        identifier: drizzle_orm_pg_core.PgColumn<{
            name: "identifier";
            tableName: "verificationToken";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        value: drizzle_orm_pg_core.PgColumn<{
            name: "token";
            tableName: "verificationToken";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        expiresAt: drizzle_orm_pg_core.PgColumn<{
            name: "expires";
            tableName: "verificationToken";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "createdAt";
            tableName: "verificationToken";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        updatedAt: drizzle_orm_pg_core.PgColumn<{
            name: "updatedAt";
            tableName: "verificationToken";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: false;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const twoFactor: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "two_factor";
    schema: undefined;
    columns: {
        id: drizzle_orm_pg_core.PgColumn<{
            name: "id";
            tableName: "two_factor";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: true;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        secret: drizzle_orm_pg_core.PgColumn<{
            name: "secret";
            tableName: "two_factor";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        backupCodes: drizzle_orm_pg_core.PgColumn<{
            name: "backup_codes";
            tableName: "two_factor";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "user_id";
            tableName: "two_factor";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const usersRelations: drizzle_orm.Relations<"user", {
    subscriptions: drizzle_orm.Many<"subscriptions">;
    listsSubscriptions: drizzle_orm.Many<"lists_subscriptions">;
    collections: drizzle_orm.Many<"collections">;
    actions: drizzle_orm.One<"actions", true>;
    wallets: drizzle_orm.One<"wallets", true>;
    feeds: drizzle_orm.Many<"feeds">;
    inboxes: drizzle_orm.One<"inboxes", true>;
    messaging: drizzle_orm.Many<"messaging">;
}>;

declare const wallets: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "wallets";
    schema: undefined;
    columns: {
        addressIndex: drizzle_orm_pg_core.PgColumn<{
            name: "address_index";
            tableName: "wallets";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: "always";
            generated: undefined;
        }, {}, {}>;
        address: drizzle_orm_pg_core.PgColumn<{
            name: "address";
            tableName: "wallets";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "userId";
            tableName: "wallets";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "wallets";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        powerToken: drizzle_orm_pg_core.PgColumn<{
            name: "power_token";
            tableName: "wallets";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        dailyPowerToken: drizzle_orm_pg_core.PgColumn<{
            name: "daily_power_token";
            tableName: "wallets";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        cashablePowerToken: drizzle_orm_pg_core.PgColumn<{
            name: "cashable_power_token";
            tableName: "wallets";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const walletsOpenAPISchema: zod.ZodObject<{
    addressIndex: zod.ZodNumber;
    address: zod.ZodNullable<zod.ZodString>;
    userId: zod.ZodString;
    createdAt: zod.ZodString;
    powerToken: zod.ZodString;
    dailyPowerToken: zod.ZodString;
    cashablePowerToken: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    createdAt: string;
    userId: string;
    powerToken: string;
    addressIndex: number;
    address: string | null;
    dailyPowerToken: string;
    cashablePowerToken: string;
}, {
    createdAt: string;
    userId: string;
    powerToken: string;
    addressIndex: number;
    address: string | null;
    dailyPowerToken: string;
    cashablePowerToken: string;
}>;
declare const walletsRelations: drizzle_orm.Relations<"wallets", {
    user: drizzle_orm.One<"user", true>;
    transactionsFrom: drizzle_orm.Many<"transactions">;
    transactionTo: drizzle_orm.Many<"transactions">;
    level: drizzle_orm.One<"levels", false>;
}>;
declare const transactionType: drizzle_orm_pg_core.PgEnum<["tip", "mint", "burn", "withdraw", "purchase", "airdrop"]>;
declare const transactions: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "transactions";
    schema: undefined;
    columns: {
        hash: drizzle_orm_pg_core.PgColumn<{
            name: "hash";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "tip" | "mint" | "burn" | "withdraw" | "purchase" | "airdrop";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["tip", "mint", "burn", "withdraw", "purchase", "airdrop"];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        fromUserId: drizzle_orm_pg_core.PgColumn<{
            name: "from_user_id";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        toUserId: drizzle_orm_pg_core.PgColumn<{
            name: "to_user_id";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        toFeedId: drizzle_orm_pg_core.PgColumn<{
            name: "to_feed_id";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        toListId: drizzle_orm_pg_core.PgColumn<{
            name: "to_list_id";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        toEntryId: drizzle_orm_pg_core.PgColumn<{
            name: "to_entry_id";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        toRSSHubId: drizzle_orm_pg_core.PgColumn<{
            name: "to_rsshub_id";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        powerToken: drizzle_orm_pg_core.PgColumn<{
            name: "power_token";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        tax: drizzle_orm_pg_core.PgColumn<{
            name: "tax";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        createdAt: drizzle_orm_pg_core.PgColumn<{
            name: "created_at";
            tableName: "transactions";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        comment: drizzle_orm_pg_core.PgColumn<{
            name: "comment";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const transactionsOpenAPISchema: zod.ZodObject<{
    hash: zod.ZodString;
    type: zod.ZodEnum<["tip", "mint", "burn", "withdraw", "purchase", "airdrop"]>;
    fromUserId: zod.ZodNullable<zod.ZodString>;
    toUserId: zod.ZodNullable<zod.ZodString>;
    toFeedId: zod.ZodNullable<zod.ZodString>;
    toListId: zod.ZodNullable<zod.ZodString>;
    toEntryId: zod.ZodNullable<zod.ZodString>;
    toRSSHubId: zod.ZodNullable<zod.ZodString>;
    powerToken: zod.ZodString;
    tax: zod.ZodString;
    createdAt: zod.ZodString;
    comment: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    type: "tip" | "mint" | "burn" | "withdraw" | "purchase" | "airdrop";
    createdAt: string;
    hash: string;
    powerToken: string;
    fromUserId: string | null;
    toUserId: string | null;
    toFeedId: string | null;
    toListId: string | null;
    toEntryId: string | null;
    toRSSHubId: string | null;
    tax: string;
    comment: string | null;
}, {
    type: "tip" | "mint" | "burn" | "withdraw" | "purchase" | "airdrop";
    createdAt: string;
    hash: string;
    powerToken: string;
    fromUserId: string | null;
    toUserId: string | null;
    toFeedId: string | null;
    toListId: string | null;
    toEntryId: string | null;
    toRSSHubId: string | null;
    tax: string;
    comment: string | null;
}>;
declare const transactionsRelations: drizzle_orm.Relations<"transactions", {
    fromUser: drizzle_orm.One<"user", false>;
    toUser: drizzle_orm.One<"user", false>;
    toFeed: drizzle_orm.One<"feeds", false>;
    fromWallet: drizzle_orm.One<"wallets", false>;
    toWallet: drizzle_orm.One<"wallets", false>;
}>;
declare const feedPowerTokens: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "feedPowerTokens";
    schema: undefined;
    columns: {
        feedId: drizzle_orm_pg_core.PgColumn<{
            name: "feed_id";
            tableName: "feedPowerTokens";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        powerToken: drizzle_orm_pg_core.PgColumn<{
            name: "power_token";
            tableName: "feedPowerTokens";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const feedPowerTokensOpenAPISchema: zod.ZodObject<{
    feedId: zod.ZodString;
    powerToken: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    feedId: string;
    powerToken: string;
}, {
    feedId: string;
    powerToken: string;
}>;
declare const feedPowerTokensRelations: drizzle_orm.Relations<"feedPowerTokens", {
    feed: drizzle_orm.One<"feeds", true>;
}>;
declare const levels: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "levels";
    schema: undefined;
    columns: {
        address: drizzle_orm_pg_core.PgColumn<{
            name: "address";
            tableName: "levels";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        rank: drizzle_orm_pg_core.PgColumn<{
            name: "rank";
            tableName: "levels";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        level: drizzle_orm_pg_core.PgColumn<{
            name: "level";
            tableName: "levels";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        prevActivityPoints: drizzle_orm_pg_core.PgColumn<{
            name: "prev_activity_points";
            tableName: "levels";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        activityPoints: drizzle_orm_pg_core.PgColumn<{
            name: "activity_points";
            tableName: "levels";
            dataType: "number";
            columnType: "PgInteger";
            data: number;
            driverParam: string | number;
            notNull: false;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        powerToken: drizzle_orm_pg_core.PgColumn<{
            name: "power_token";
            tableName: "levels";
            dataType: "string";
            columnType: "PgNumeric";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: true;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        userId: drizzle_orm_pg_core.PgColumn<{
            name: "userId";
            tableName: "levels";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const levelsOpenAPISchema: zod.ZodObject<{
    address: zod.ZodString;
    rank: zod.ZodNullable<zod.ZodNumber>;
    level: zod.ZodNullable<zod.ZodNumber>;
    prevActivityPoints: zod.ZodNullable<zod.ZodNumber>;
    activityPoints: zod.ZodNullable<zod.ZodNumber>;
    powerToken: zod.ZodString;
    userId: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    userId: string;
    rank: number | null;
    powerToken: string;
    address: string;
    level: number | null;
    prevActivityPoints: number | null;
    activityPoints: number | null;
}, {
    userId: string;
    rank: number | null;
    powerToken: string;
    address: string;
    level: number | null;
    prevActivityPoints: number | null;
    activityPoints: number | null;
}>;
declare const levelsRelations: drizzle_orm.Relations<"levels", {
    wallet: drizzle_orm.One<"wallets", true>;
    user: drizzle_orm.One<"user", true>;
}>;
declare const boosts: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "boosts";
    schema: undefined;
    columns: {
        hash: drizzle_orm_pg_core.PgColumn<{
            name: "hash";
            tableName: "boosts";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        expiresAt: drizzle_orm_pg_core.PgColumn<{
            name: "expires_at";
            tableName: "boosts";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const rsshubPurchase: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "rsshub_purchase";
    schema: undefined;
    columns: {
        hash: drizzle_orm_pg_core.PgColumn<{
            name: "hash";
            tableName: "rsshub_purchase";
            dataType: "string";
            columnType: "PgText";
            data: string;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: true;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: [string, ...string[]];
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
        expiresAt: drizzle_orm_pg_core.PgColumn<{
            name: "expires_at";
            tableName: "rsshub_purchase";
            dataType: "date";
            columnType: "PgTimestamp";
            data: Date;
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: undefined;
            baseColumn: never;
            identity: undefined;
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;

declare const auth: {
    handler: (request: Request) => Promise<Response>;
    api: better_auth.InferAPI<{
        ok: {
            <C extends [(better_call.Context<"/ok", {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                ok: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                ok: boolean;
            }>;
            path: "/ok";
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                ok: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        error: {
            <C extends [(better_call.Context<"/error", {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "text/html": {
                                        schema: {
                                            type: "string";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : Response>;
            path: "/error";
            options: {
                method: "GET";
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "text/html": {
                                        schema: {
                                            type: "string";
                                        };
                                    };
                                };
                            };
                        };
                    };
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInSocial: {
            <C extends [better_call.Context<"/sign-in/social", {
                method: "POST";
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    newUserCallbackURL: zod.ZodOptional<zod.ZodString>;
                    errorCallbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit")[]]>;
                    disableRedirect: zod.ZodOptional<zod.ZodBoolean>;
                    idToken: zod.ZodOptional<zod.ZodObject<{
                        token: zod.ZodString;
                        nonce: zod.ZodOptional<zod.ZodString>;
                        accessToken: zod.ZodOptional<zod.ZodString>;
                        refreshToken: zod.ZodOptional<zod.ZodString>;
                        expiresAt: zod.ZodOptional<zod.ZodNumber>;
                    }, "strip", zod.ZodTypeAny, {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    }, {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    }>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    type: string;
                                                };
                                                user: {
                                                    type: string;
                                                };
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                redirect: boolean;
                token: string;
                url: undefined;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | {
                url: string;
                redirect: boolean;
            }>;
            path: "/sign-in/social";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    newUserCallbackURL: zod.ZodOptional<zod.ZodString>;
                    errorCallbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit")[]]>;
                    disableRedirect: zod.ZodOptional<zod.ZodBoolean>;
                    idToken: zod.ZodOptional<zod.ZodObject<{
                        token: zod.ZodString;
                        nonce: zod.ZodOptional<zod.ZodString>;
                        accessToken: zod.ZodOptional<zod.ZodString>;
                        refreshToken: zod.ZodOptional<zod.ZodString>;
                        expiresAt: zod.ZodOptional<zod.ZodNumber>;
                    }, "strip", zod.ZodTypeAny, {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    }, {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    }>>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    idToken?: {
                        token: string;
                        expiresAt?: number | undefined;
                        accessToken?: string | undefined;
                        refreshToken?: string | undefined;
                        nonce?: string | undefined;
                    } | undefined;
                    callbackURL?: string | undefined;
                    newUserCallbackURL?: string | undefined;
                    errorCallbackURL?: string | undefined;
                    disableRedirect?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    type: string;
                                                };
                                                user: {
                                                    type: string;
                                                };
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        callbackOAuth: {
            <C extends [better_call.Context<"/callback/:id", {
                method: ("GET" | "POST")[];
                body: zod.ZodOptional<zod.ZodObject<{
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                    error_description: zod.ZodOptional<zod.ZodString>;
                    state: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }>>;
                query: zod.ZodOptional<zod.ZodObject<{
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                    error_description: zod.ZodOptional<zod.ZodString>;
                    state: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }>>;
                metadata: {
                    isAction: false;
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : void>;
            path: "/callback/:id";
            options: {
                method: ("GET" | "POST")[];
                body: zod.ZodOptional<zod.ZodObject<{
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                    error_description: zod.ZodOptional<zod.ZodString>;
                    state: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }>>;
                query: zod.ZodOptional<zod.ZodObject<{
                    code: zod.ZodOptional<zod.ZodString>;
                    error: zod.ZodOptional<zod.ZodString>;
                    error_description: zod.ZodOptional<zod.ZodString>;
                    state: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }, {
                    code?: string | undefined;
                    error?: string | undefined;
                    error_description?: string | undefined;
                    state?: string | undefined;
                }>>;
                metadata: {
                    isAction: false;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getSession: {
            <C extends [better_call.Context<"/get-session", {
                method: "GET";
                query: zod.ZodOptional<zod.ZodObject<{
                    disableCookieCache: zod.ZodOptional<zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]>>;
                    disableRefresh: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    disableCookieCache?: boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }, {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }>>;
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    type: string;
                                                    properties: {
                                                        token: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        expiresAt: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined | undefined;
                    userAgent?: string | null | undefined | undefined;
                };
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | null | undefined | undefined;
                    handle: string;
                } & {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | null | undefined | undefined;
                    twoFactorEnabled: boolean | null | undefined;
                    handle: string;
                };
            } | null>;
            path: "/get-session";
            options: {
                method: "GET";
                query: zod.ZodOptional<zod.ZodObject<{
                    disableCookieCache: zod.ZodOptional<zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]>>;
                    disableRefresh: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    disableCookieCache?: boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }, {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }>>;
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                session: {
                                                    type: string;
                                                    properties: {
                                                        token: {
                                                            type: string;
                                                        };
                                                        userId: {
                                                            type: string;
                                                        };
                                                        expiresAt: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                                user: {
                                                    type: string;
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signOut: {
            <C extends [better_call.Context<"/sign-out", {
                method: "POST";
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                success: boolean;
            }>;
            path: "/sign-out";
            options: {
                method: "POST";
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                success: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signUpEmail: {
            <C extends [better_call.Context<"/sign-up/email", {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                }, {
                    password: string;
                    email: string;
                    name: string;
                }> & zod.ZodObject<{
                    handle: zod.ZodString;
                } | {
                    handle: zod.ZodString;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    handle: string;
                } | {
                    handle: string;
                }, {
                    handle: string;
                } | {
                    handle: string;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            password: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                id: {
                                                    type: string;
                                                    description: string;
                                                };
                                                email: {
                                                    type: string;
                                                    description: string;
                                                };
                                                name: {
                                                    type: string;
                                                    description: string;
                                                };
                                                image: {
                                                    type: string;
                                                    description: string;
                                                };
                                                emailVerified: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                token: null;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            } | {
                token: string;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            path: "/sign-up/email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    name: zod.ZodString;
                    email: zod.ZodString;
                    password: zod.ZodString;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    name: string;
                }, {
                    password: string;
                    email: string;
                    name: string;
                }> & zod.ZodObject<{
                    handle: zod.ZodString;
                } | {
                    handle: zod.ZodString;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    handle: string;
                } | {
                    handle: string;
                }, {
                    handle: string;
                } | {
                    handle: string;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            password: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                id: {
                                                    type: string;
                                                    description: string;
                                                };
                                                email: {
                                                    type: string;
                                                    description: string;
                                                };
                                                name: {
                                                    type: string;
                                                    description: string;
                                                };
                                                image: {
                                                    type: string;
                                                    description: string;
                                                };
                                                emailVerified: {
                                                    type: string;
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        signInEmail: {
            <C extends [better_call.Context<"/sign-in/email", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    rememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                redirect: boolean;
                token: string;
                url: string | undefined;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            path: "/sign-in/email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    password: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    rememberMe: zod.ZodOptional<zod.ZodDefault<zod.ZodBoolean>>;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }, {
                    password: string;
                    email: string;
                    callbackURL?: string | undefined;
                    rememberMe?: boolean | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPassword: {
            <C extends [better_call.Context<"/forget-password", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo?: string | undefined;
                }, {
                    email: string;
                    redirectTo?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/forget-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    redirectTo: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    redirectTo?: string | undefined;
                }, {
                    email: string;
                    redirectTo?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        resetPassword: {
            <C extends [better_call.Context<"/reset-password", {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    token: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token?: string | undefined;
                }, {
                    token?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    token: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    token?: string | undefined;
                }, {
                    newPassword: string;
                    token?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/reset-password";
            options: {
                method: "POST";
                query: zod.ZodOptional<zod.ZodObject<{
                    token: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token?: string | undefined;
                }, {
                    token?: string | undefined;
                }>>;
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    token: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    token?: string | undefined;
                }, {
                    newPassword: string;
                    token?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyEmail: {
            <C extends [better_call.Context<"/verify-email", {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, void>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : void | {
                status: boolean;
                user: {
                    id: any;
                    email: any;
                    name: any;
                    image: any;
                    emailVerified: any;
                    createdAt: any;
                    updatedAt: any;
                };
            } | {
                status: boolean;
                user: null;
            }>;
            path: "/verify-email";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, void>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        sendVerificationEmail: {
            <C extends [better_call.Context<"/send-verification-email", {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/send-verification-email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    email: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    email: string;
                    callbackURL?: string | undefined;
                }, {
                    email: string;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            email: {
                                                type: string;
                                                description: string;
                                            };
                                            callbackURL: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        changeEmail: {
            <C extends [better_call.Context<"/change-email", {
                method: "POST";
                body: zod.ZodObject<{
                    newEmail: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/change-email";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newEmail: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }, {
                    newEmail: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        changePassword: {
            <C extends [better_call.Context<"/change-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    description: string;
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                token: string | null;
                user: {
                    id: string;
                    email: string;
                    name: string;
                    image: string | null | undefined;
                    emailVerified: boolean;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            path: "/change-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                    currentPassword: zod.ZodString;
                    revokeOtherSessions: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }, {
                    newPassword: string;
                    currentPassword: string;
                    revokeOtherSessions?: boolean | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    description: string;
                                                    $ref: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        setPassword: {
            <C extends [better_call.Context<"/set-password", {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/set-password";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    newPassword: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    newPassword: string;
                }, {
                    newPassword: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        updateUser: {
            <C extends [better_call.Context<"/update-user", {
                method: "POST";
                body: zod.ZodObject<{
                    handle: zod.ZodString;
                } | {
                    handle: zod.ZodString;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    handle: string;
                } | {
                    handle: string;
                }, {
                    handle: string;
                } | {
                    handle: string;
                }> & zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString | zod.ZodNull>;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | null | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | null | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            image: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/update-user";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    handle: zod.ZodString;
                } | {
                    handle: zod.ZodString;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    handle: string;
                } | {
                    handle: string;
                }, {
                    handle: string;
                } | {
                    handle: string;
                }> & zod.ZodObject<{
                    name: zod.ZodOptional<zod.ZodString>;
                    image: zod.ZodOptional<zod.ZodString | zod.ZodNull>;
                }, zod.UnknownKeysParam, zod.ZodTypeAny, {
                    name?: string | undefined;
                    image?: string | null | undefined;
                }, {
                    name?: string | undefined;
                    image?: string | null | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            name: {
                                                type: string;
                                                description: string;
                                            };
                                            image: {
                                                type: string;
                                                description: string;
                                            };
                                        };
                                    };
                                };
                            };
                        };
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                user: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        deleteUser: {
            <C extends [better_call.Context<"/delete-user", {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    password: zod.ZodOptional<zod.ZodString>;
                    token: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                success: boolean;
                message: string;
            }>;
            path: "/delete-user";
            options: {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    password: zod.ZodOptional<zod.ZodString>;
                    token: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                }, {
                    password?: string | undefined;
                    token?: string | undefined;
                    callbackURL?: string | undefined;
                }>;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        forgetPasswordCallback: {
            <C extends [better_call.Context<"/reset-password/:token", {
                method: "GET";
                query: zod.ZodObject<{
                    callbackURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, void>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : never>;
            path: "/reset-password/:token";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    callbackURL: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    callbackURL: string;
                }, {
                    callbackURL: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, void>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                token: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listSessions: {
            <C extends [better_call.Context<"/list-sessions", {
                method: "GET";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    token: {
                                                        type: string;
                                                    };
                                                    userId: {
                                                        type: string;
                                                    };
                                                    expiresAt: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : better_auth.Prettify<{
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
            }>[]>;
            path: "/list-sessions";
            options: {
                method: "GET";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    token: {
                                                        type: string;
                                                    };
                                                    userId: {
                                                        type: string;
                                                    };
                                                    expiresAt: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSession: {
            <C extends [better_call.Context<"/revoke-session", {
                method: "POST";
                body: zod.ZodObject<{
                    token: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                }, {
                    token: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/revoke-session";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    token: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                }, {
                    token: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        requestBody: {
                            content: {
                                "application/json": {
                                    schema: {
                                        type: "object";
                                        properties: {
                                            token: {
                                                type: string;
                                            };
                                        };
                                        required: string[];
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeSessions: {
            <C extends [better_call.Context<"/revoke-sessions", {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/revoke-sessions";
            options: {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                requireHeaders: true;
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        revokeOtherSessions: {
            <C extends [better_call.Context<"/revoke-other-sessions", {
                method: "POST";
                requireHeaders: true;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/revoke-other-sessions";
            options: {
                method: "POST";
                requireHeaders: true;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        linkSocialAccount: {
            <C extends [better_call.Context<"/link-social", {
                method: "POST";
                requireHeaders: true;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit")[]]>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    callbackURL?: string | undefined;
                }, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                url: string;
                redirect: boolean;
            }>;
            path: "/link-social";
            options: {
                method: "POST";
                requireHeaders: true;
                body: zod.ZodObject<{
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                    provider: zod.ZodEnum<["github", ...("github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit")[]]>;
                }, "strip", zod.ZodTypeAny, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    callbackURL?: string | undefined;
                }, {
                    provider: "github" | "apple" | "discord" | "facebook" | "microsoft" | "google" | "spotify" | "twitch" | "twitter" | "dropbox" | "linkedin" | "gitlab" | "reddit";
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                url: {
                                                    type: string;
                                                };
                                                redirect: {
                                                    type: string;
                                                };
                                            };
                                            required: string[];
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        listUserAccounts: {
            <C extends [(better_call.Context<"/list-accounts", {
                method: "GET";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                    };
                                                    provider: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                id: string;
                provider: string;
                createdAt: Date;
                updatedAt: Date;
                accountId: string;
                scopes: string[];
            }[]>;
            path: "/list-accounts";
            options: {
                method: "GET";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        description: string;
                        responses: {
                            "200": {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "array";
                                            items: {
                                                type: string;
                                                properties: {
                                                    id: {
                                                        type: string;
                                                    };
                                                    provider: {
                                                        type: string;
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        deleteUserCallback: {
            <C extends [better_call.Context<"/delete-user/callback", {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, void>, better_call.EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                success: boolean;
                message: string;
            }>;
            path: "/delete-user/callback";
            options: {
                method: "GET";
                query: zod.ZodObject<{
                    token: zod.ZodString;
                    callbackURL: zod.ZodOptional<zod.ZodString>;
                }, "strip", zod.ZodTypeAny, {
                    token: string;
                    callbackURL?: string | undefined;
                }, {
                    token: string;
                    callbackURL?: string | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, void>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        unlinkAccount: {
            <C extends [better_call.Context<"/unlink-account", {
                method: "POST";
                body: zod.ZodObject<{
                    providerId: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    providerId: string;
                }, {
                    providerId: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/unlink-account";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    providerId: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    providerId: string;
                }, {
                    providerId: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & {
        customGetProviders: {
            <C extends [(better_call.Context<"/get-providers", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : any>;
            path: "/get-providers";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & {
        customCreateSession: {
            <C extends [(better_call.Context<"/create-session", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                ck: string;
                userId: string;
            } | null>;
            path: "/create-session";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & {
        getAccountInfo: {
            <C extends [(better_call.Context<"/get-account-info", {
                method: "GET";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                id: string;
                provider: string;
                profile: {
                    id?: string;
                    email?: string;
                    name?: string;
                    image?: string;
                } | null;
            }[] | null>;
            path: "/get-account-info";
            options: {
                method: "GET";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & {
        customUpdateUser: {
            <C extends [(better_call.Context<"/update-user-ccc", {
                method: "POST";
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : string | null>;
            path: "/update-user-ccc";
            options: {
                method: "POST";
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & {
        enableTwoFactor: {
            <C extends [better_call.Context<"/two-factor/enable", {
                method: "POST";
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                totpURI: {
                                                    type: string;
                                                    description: string;
                                                };
                                                backupCodes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                totpURI: string;
                backupCodes: string[];
            }>;
            path: "/two-factor/enable";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                totpURI: {
                                                    type: string;
                                                    description: string;
                                                };
                                                backupCodes: {
                                                    type: string;
                                                    items: {
                                                        type: string;
                                                    };
                                                    description: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        disableTwoFactor: {
            <C extends [better_call.Context<"/two-factor/disable", {
                method: "POST";
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/two-factor/disable";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyBackupCode: {
            <C extends [better_call.Context<"/two-factor/verify-backup-code", {
                method: "POST";
                body: zod.ZodObject<{
                    code: zod.ZodString;
                    disableSession: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    code: string;
                    disableSession?: boolean | undefined;
                }, {
                    code: string;
                    disableSession?: boolean | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: better_auth_plugins.UserWithTwoFactor;
                session: {
                    session: {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: better_auth_plugins.UserWithTwoFactor;
                } & {
                    session: Record<string, any> & {
                        id: string;
                        createdAt: Date;
                        updatedAt: Date;
                        userId: string;
                        expiresAt: Date;
                        token: string;
                        ipAddress?: string | null | undefined;
                        userAgent?: string | null | undefined;
                    };
                    user: Record<string, any> & {
                        id: string;
                        email: string;
                        emailVerified: boolean;
                        name: string;
                        createdAt: Date;
                        updatedAt: Date;
                        image?: string | null | undefined;
                    };
                } & {
                    session: better_auth.Session & Record<string, any>;
                    user: better_auth.User & Record<string, any>;
                };
            }>;
            path: "/two-factor/verify-backup-code";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    code: zod.ZodString;
                    disableSession: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    code: string;
                    disableSession?: boolean | undefined;
                }, {
                    code: string;
                    disableSession?: boolean | undefined;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        generateBackupCodes: {
            <C extends [better_call.Context<"/two-factor/generate-backup-codes", {
                method: "POST";
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
                backupCodes: string[];
            }>;
            path: "/two-factor/generate-backup-codes";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        viewBackupCodes: {
            <C extends [better_call.Context<"/two-factor/view-backup-codes", {
                method: "GET";
                body: zod.ZodObject<{
                    userId: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
                backupCodes: string[];
            }>;
            path: "/two-factor/view-backup-codes";
            options: {
                method: "GET";
                body: zod.ZodObject<{
                    userId: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    userId: string;
                }, {
                    userId: string;
                }>;
                metadata: {
                    SERVER_ONLY: true;
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        sendTwoFactorOTP: {
            <C extends [better_call.Context<"/two-factor/send-otp", {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                status: boolean;
            }>;
            path: "/two-factor/send-otp";
            options: {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyTwoFactorOTP: {
            <C extends [better_call.Context<"/two-factor/verify-otp", {
                method: "POST";
                body: zod.ZodObject<{
                    code: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                token: string;
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image: string | null | undefined;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            path: "/two-factor/verify-otp";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    code: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        generateTOTP: {
            <C extends [(better_call.Context<"/totp/generate", {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                code: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                code: string;
            }>;
            path: "/totp/generate";
            options: {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                code: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        getTOTPURI: {
            <C extends [better_call.Context<"/two-factor/get-totp-uri", {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                totpURI: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                totpURI: string;
            }>;
            path: "/two-factor/get-totp-uri";
            options: {
                method: "POST";
                use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, better_call.EndpointOptions>[];
                body: zod.ZodObject<{
                    password: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    password: string;
                }, {
                    password: string;
                }>;
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                totpURI: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
        verifyTOTP: {
            <C extends [better_call.Context<"/two-factor/verify-totp", {
                method: "POST";
                body: zod.ZodObject<{
                    code: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            }>]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                token: string;
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    image: string | null | undefined;
                    createdAt: Date;
                    updatedAt: Date;
                };
            }>;
            path: "/two-factor/verify-totp";
            options: {
                method: "POST";
                body: zod.ZodObject<{
                    code: zod.ZodString;
                }, "strip", zod.ZodTypeAny, {
                    code: string;
                }, {
                    code: string;
                }>;
                use: better_call.Endpoint<better_call.Handler<string, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }, {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: better_auth_plugins.UserWithTwoFactor;
                    };
                } | {
                    valid: () => Promise<{
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            token: string;
                            user: {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                image: string | null | undefined;
                                createdAt: Date;
                                updatedAt: Date;
                            };
                        };
                        _flag: "json";
                    }>;
                    invalid: () => Promise<never>;
                    session: {
                        session: Record<string, any> & {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined;
                            userAgent?: string | null | undefined;
                        };
                        user: Record<string, any> & {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined;
                        };
                    };
                }>, {
                    body: zod.ZodObject<{
                        trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                    }, "strip", zod.ZodTypeAny, {
                        trustDevice?: boolean | undefined;
                    }, {
                        trustDevice?: boolean | undefined;
                    }>;
                } & {
                    method: "*";
                }>[];
                metadata: {
                    openapi: {
                        summary: string;
                        description: string;
                        responses: {
                            200: {
                                description: string;
                                content: {
                                    "application/json": {
                                        schema: {
                                            type: "object";
                                            properties: {
                                                status: {
                                                    type: string;
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                };
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    } & {
        getSession: {
            <C extends [(better_call.Context<"/get-session", {
                method: "GET";
                metadata: {
                    CUSTOM_SESSION: boolean;
                };
                query: zod.ZodOptional<zod.ZodObject<{
                    disableCookieCache: zod.ZodOptional<zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]>>;
                    disableRefresh: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    disableCookieCache?: boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }, {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }>>;
            }> | undefined)?]>(...ctx: C): Promise<C extends [{
                asResponse: true;
            }] ? Response : {
                user: {
                    id: string;
                    email: string;
                    emailVerified: boolean;
                    name: string;
                    createdAt: Date;
                    updatedAt: Date;
                    image?: string | null | undefined | undefined;
                } & {
                    image: string | null;
                    handle: string | null;
                    twoFactorEnabled: boolean | null;
                };
                session: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    userId: string;
                    expiresAt: Date;
                    token: string;
                    ipAddress?: string | null | undefined | undefined;
                    userAgent?: string | null | undefined | undefined;
                };
                invitation: {
                    code: string;
                    createdAt: Date | null;
                    usedAt: Date | null;
                    fromUserId: string;
                    toUserId: string | null;
                } | undefined;
                role: "user" | "trial";
            } | null>;
            path: "/get-session";
            options: {
                method: "GET";
                metadata: {
                    CUSTOM_SESSION: boolean;
                };
                query: zod.ZodOptional<zod.ZodObject<{
                    disableCookieCache: zod.ZodOptional<zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]>>;
                    disableRefresh: zod.ZodOptional<zod.ZodBoolean>;
                }, "strip", zod.ZodTypeAny, {
                    disableCookieCache?: boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }, {
                    disableCookieCache?: string | boolean | undefined;
                    disableRefresh?: boolean | undefined;
                }>>;
            };
            method: better_call.Method | better_call.Method[];
            headers: Headers;
        };
    }>;
    options: {
        appName: string;
        database: (options: better_auth.BetterAuthOptions) => {
            id: string;
            create<T extends Record<string, any>, R = T>(data: {
                model: string;
                data: T;
                select?: string[];
            }): Promise<any>;
            findOne<T>(data: {
                model: string;
                where: better_auth.Where[];
                select?: string[];
            }): Promise<any>;
            findMany<T>(data: {
                model: string;
                where?: better_auth.Where[];
                limit?: number;
                sortBy?: {
                    field: string;
                    direction: "asc" | "desc";
                };
                offset?: number;
            }): Promise<any[]>;
            update<T>(data: {
                model: string;
                where: better_auth.Where[];
                update: Record<string, any>;
            }): Promise<any>;
            updateMany(data: {
                model: string;
                where: better_auth.Where[];
                update: Record<string, any>;
            }): Promise<any>;
            delete<T>(data: {
                model: string;
                where: better_auth.Where[];
            }): Promise<void>;
            deleteMany(data: {
                model: string;
                where: better_auth.Where[];
            }): Promise<any>;
            options: better_auth_adapters_drizzle.DrizzleAdapterConfig;
        };
        advanced: {
            generateId: false;
        };
        session: {
            updateAge: number;
            expiresIn: number;
        };
        basePath: string;
        trustedOrigins: string[];
        user: {
            additionalFields: {
                handle: {
                    type: "string";
                };
            };
            changeEmail: {
                enabled: true;
                sendChangeEmailVerification: ({ user, url }: {
                    user: better_auth.User;
                    newEmail: string;
                    url: string;
                    token: string;
                }) => Promise<void>;
            };
        };
        account: {
            accountLinking: {
                enabled: true;
                trustedProviders: ("github" | "apple" | "google")[];
            };
        };
        socialProviders: {
            google: {
                clientId: string;
                clientSecret: string;
            };
            github: {
                clientId: string;
                clientSecret: string;
            };
            apple: {
                enabled: boolean;
                clientId: string;
                clientSecret: string;
                appBundleIdentifier: string | undefined;
            };
        };
        emailAndPassword: {
            enabled: true;
            sendResetPassword({ user, url }: {
                user: better_auth.User;
                url: string;
                token: string;
            }): Promise<void>;
        };
        emailVerification: {
            sendVerificationEmail({ user, url }: {
                user: better_auth.User;
                url: string;
                token: string;
            }): Promise<void>;
        };
        plugins: (better_auth.BetterAuthPlugin | {
            id: "two-factor";
            endpoints: {
                enableTwoFactor: {
                    <C extends [better_call.Context<"/two-factor/enable", {
                        method: "POST";
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        totpURI: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        backupCodes: {
                                                            type: string;
                                                            items: {
                                                                type: string;
                                                            };
                                                            description: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        totpURI: string;
                        backupCodes: string[];
                    }>;
                    path: "/two-factor/enable";
                    options: {
                        method: "POST";
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        totpURI: {
                                                            type: string;
                                                            description: string;
                                                        };
                                                        backupCodes: {
                                                            type: string;
                                                            items: {
                                                                type: string;
                                                            };
                                                            description: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                disableTwoFactor: {
                    <C extends [better_call.Context<"/two-factor/disable", {
                        method: "POST";
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        status: boolean;
                    }>;
                    path: "/two-factor/disable";
                    options: {
                        method: "POST";
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                verifyBackupCode: {
                    <C extends [better_call.Context<"/two-factor/verify-backup-code", {
                        method: "POST";
                        body: zod.ZodObject<{
                            code: zod.ZodString;
                            disableSession: zod.ZodOptional<zod.ZodBoolean>;
                        }, "strip", zod.ZodTypeAny, {
                            code: string;
                            disableSession?: boolean | undefined;
                        }, {
                            code: string;
                            disableSession?: boolean | undefined;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        user: better_auth_plugins.UserWithTwoFactor;
                        session: {
                            session: {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                            user: better_auth_plugins.UserWithTwoFactor;
                        } & {
                            session: Record<string, any> & {
                                id: string;
                                createdAt: Date;
                                updatedAt: Date;
                                userId: string;
                                expiresAt: Date;
                                token: string;
                                ipAddress?: string | null | undefined;
                                userAgent?: string | null | undefined;
                            };
                            user: Record<string, any> & {
                                id: string;
                                email: string;
                                emailVerified: boolean;
                                name: string;
                                createdAt: Date;
                                updatedAt: Date;
                                image?: string | null | undefined;
                            };
                        } & {
                            session: better_auth.Session & Record<string, any>;
                            user: better_auth.User & Record<string, any>;
                        };
                    }>;
                    path: "/two-factor/verify-backup-code";
                    options: {
                        method: "POST";
                        body: zod.ZodObject<{
                            code: zod.ZodString;
                            disableSession: zod.ZodOptional<zod.ZodBoolean>;
                        }, "strip", zod.ZodTypeAny, {
                            code: string;
                            disableSession?: boolean | undefined;
                        }, {
                            code: string;
                            disableSession?: boolean | undefined;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                generateBackupCodes: {
                    <C extends [better_call.Context<"/two-factor/generate-backup-codes", {
                        method: "POST";
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        status: boolean;
                        backupCodes: string[];
                    }>;
                    path: "/two-factor/generate-backup-codes";
                    options: {
                        method: "POST";
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                viewBackupCodes: {
                    <C extends [better_call.Context<"/two-factor/view-backup-codes", {
                        method: "GET";
                        body: zod.ZodObject<{
                            userId: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        metadata: {
                            SERVER_ONLY: true;
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        status: boolean;
                        backupCodes: string[];
                    }>;
                    path: "/two-factor/view-backup-codes";
                    options: {
                        method: "GET";
                        body: zod.ZodObject<{
                            userId: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            userId: string;
                        }, {
                            userId: string;
                        }>;
                        metadata: {
                            SERVER_ONLY: true;
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                sendTwoFactorOTP: {
                    <C extends [better_call.Context<"/two-factor/send-otp", {
                        method: "POST";
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        status: boolean;
                    }>;
                    path: "/two-factor/send-otp";
                    options: {
                        method: "POST";
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                verifyTwoFactorOTP: {
                    <C extends [better_call.Context<"/two-factor/verify-otp", {
                        method: "POST";
                        body: zod.ZodObject<{
                            code: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            code: string;
                        }, {
                            code: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        token: string;
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image: string | null | undefined;
                            createdAt: Date;
                            updatedAt: Date;
                        };
                    }>;
                    path: "/two-factor/verify-otp";
                    options: {
                        method: "POST";
                        body: zod.ZodObject<{
                            code: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            code: string;
                        }, {
                            code: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                generateTOTP: {
                    <C extends [(better_call.Context<"/totp/generate", {
                        method: "POST";
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        code: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }> | undefined)?]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        code: string;
                    }>;
                    path: "/totp/generate";
                    options: {
                        method: "POST";
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        code: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                getTOTPURI: {
                    <C extends [better_call.Context<"/two-factor/get-totp-uri", {
                        method: "POST";
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        totpURI: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        totpURI: string;
                    }>;
                    path: "/two-factor/get-totp-uri";
                    options: {
                        method: "POST";
                        use: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, better_call.EndpointOptions>[];
                        body: zod.ZodObject<{
                            password: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            password: string;
                        }, {
                            password: string;
                        }>;
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        totpURI: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
                verifyTOTP: {
                    <C extends [better_call.Context<"/two-factor/verify-totp", {
                        method: "POST";
                        body: zod.ZodObject<{
                            code: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            code: string;
                        }, {
                            code: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    }>]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        token: string;
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            image: string | null | undefined;
                            createdAt: Date;
                            updatedAt: Date;
                        };
                    }>;
                    path: "/two-factor/verify-totp";
                    options: {
                        method: "POST";
                        body: zod.ZodObject<{
                            code: zod.ZodString;
                        }, "strip", zod.ZodTypeAny, {
                            code: string;
                        }, {
                            code: string;
                        }>;
                        use: better_call.Endpoint<better_call.Handler<string, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }, {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: better_auth_plugins.UserWithTwoFactor;
                            };
                        } | {
                            valid: () => Promise<{
                                response: {
                                    body: any;
                                    status: number;
                                    statusText: string;
                                    headers: Record<string, string> | undefined;
                                };
                                body: {
                                    token: string;
                                    user: {
                                        id: string;
                                        email: string;
                                        emailVerified: boolean;
                                        name: string;
                                        image: string | null | undefined;
                                        createdAt: Date;
                                        updatedAt: Date;
                                    };
                                };
                                _flag: "json";
                            }>;
                            invalid: () => Promise<never>;
                            session: {
                                session: Record<string, any> & {
                                    id: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    userId: string;
                                    expiresAt: Date;
                                    token: string;
                                    ipAddress?: string | null | undefined;
                                    userAgent?: string | null | undefined;
                                };
                                user: Record<string, any> & {
                                    id: string;
                                    email: string;
                                    emailVerified: boolean;
                                    name: string;
                                    createdAt: Date;
                                    updatedAt: Date;
                                    image?: string | null | undefined;
                                };
                            };
                        }>, {
                            body: zod.ZodObject<{
                                trustDevice: zod.ZodOptional<zod.ZodBoolean>;
                            }, "strip", zod.ZodTypeAny, {
                                trustDevice?: boolean | undefined;
                            }, {
                                trustDevice?: boolean | undefined;
                            }>;
                        } & {
                            method: "*";
                        }>[];
                        metadata: {
                            openapi: {
                                summary: string;
                                description: string;
                                responses: {
                                    200: {
                                        description: string;
                                        content: {
                                            "application/json": {
                                                schema: {
                                                    type: "object";
                                                    properties: {
                                                        status: {
                                                            type: string;
                                                        };
                                                    };
                                                };
                                            };
                                        };
                                    };
                                };
                            };
                        };
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
            };
            options: better_auth_plugins.TwoFactorOptions | undefined;
            hooks: {
                after: {
                    matcher(context: better_auth.HookEndpointContext<{
                        returned: better_call.APIError | Response | Record<string, any>;
                        endpoint: better_call.Endpoint;
                    }>): boolean;
                    handler: better_call.Endpoint<better_call.Handler<string, better_call.EndpointOptions, {
                        response: {
                            body: any;
                            status: number;
                            statusText: string;
                            headers: Record<string, string> | undefined;
                        };
                        body: {
                            twoFactorRedirect: boolean;
                        };
                        _flag: "json";
                    } | undefined>, better_call.EndpointOptions>;
                }[];
            };
            schema: {
                user: {
                    fields: {
                        twoFactorEnabled: {
                            type: "boolean";
                            required: false;
                            defaultValue: false;
                            input: false;
                        };
                    };
                };
                twoFactor: {
                    fields: {
                        secret: {
                            type: "string";
                            required: true;
                            returned: false;
                        };
                        backupCodes: {
                            type: "string";
                            required: true;
                            returned: false;
                        };
                        userId: {
                            type: "string";
                            required: true;
                            returned: false;
                            references: {
                                model: string;
                                field: string;
                            };
                        };
                    };
                };
            };
            rateLimit: {
                pathMatcher(path: string): boolean;
                window: number;
                max: number;
            }[];
        } | {
            id: "custom-session";
            endpoints: {
                getSession: {
                    <C extends [(better_call.Context<"/get-session", {
                        method: "GET";
                        metadata: {
                            CUSTOM_SESSION: boolean;
                        };
                        query: zod.ZodOptional<zod.ZodObject<{
                            disableCookieCache: zod.ZodOptional<zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]>>;
                            disableRefresh: zod.ZodOptional<zod.ZodBoolean>;
                        }, "strip", zod.ZodTypeAny, {
                            disableCookieCache?: boolean | undefined;
                            disableRefresh?: boolean | undefined;
                        }, {
                            disableCookieCache?: string | boolean | undefined;
                            disableRefresh?: boolean | undefined;
                        }>>;
                    }> | undefined)?]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        user: {
                            id: string;
                            email: string;
                            emailVerified: boolean;
                            name: string;
                            createdAt: Date;
                            updatedAt: Date;
                            image?: string | null | undefined | undefined;
                        } & {
                            image: string | null;
                            handle: string | null;
                            twoFactorEnabled: boolean | null;
                        };
                        session: {
                            id: string;
                            createdAt: Date;
                            updatedAt: Date;
                            userId: string;
                            expiresAt: Date;
                            token: string;
                            ipAddress?: string | null | undefined | undefined;
                            userAgent?: string | null | undefined | undefined;
                        };
                        invitation: {
                            code: string;
                            createdAt: Date | null;
                            usedAt: Date | null;
                            fromUserId: string;
                            toUserId: string | null;
                        } | undefined;
                        role: "user" | "trial";
                    } | null>;
                    path: "/get-session";
                    options: {
                        method: "GET";
                        metadata: {
                            CUSTOM_SESSION: boolean;
                        };
                        query: zod.ZodOptional<zod.ZodObject<{
                            disableCookieCache: zod.ZodOptional<zod.ZodUnion<[zod.ZodBoolean, zod.ZodEffects<zod.ZodString, boolean, string>]>>;
                            disableRefresh: zod.ZodOptional<zod.ZodBoolean>;
                        }, "strip", zod.ZodTypeAny, {
                            disableCookieCache?: boolean | undefined;
                            disableRefresh?: boolean | undefined;
                        }, {
                            disableCookieCache?: string | boolean | undefined;
                            disableRefresh?: boolean | undefined;
                        }>>;
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
            };
        } | {
            id: "customGetProviders";
            endpoints: {
                customGetProviders: {
                    <C extends [(better_call.Context<"/get-providers", {
                        method: "GET";
                    }> | undefined)?]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : any>;
                    path: "/get-providers";
                    options: {
                        method: "GET";
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
            };
        } | {
            id: "customCreateSession";
            endpoints: {
                customCreateSession: {
                    <C extends [(better_call.Context<"/create-session", {
                        method: "GET";
                    }> | undefined)?]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        ck: string;
                        userId: string;
                    } | null>;
                    path: "/create-session";
                    options: {
                        method: "GET";
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
            };
        } | {
            id: "getAccountInfo";
            endpoints: {
                getAccountInfo: {
                    <C extends [(better_call.Context<"/get-account-info", {
                        method: "GET";
                    }> | undefined)?]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : {
                        id: string;
                        provider: string;
                        profile: {
                            id?: string;
                            email?: string;
                            name?: string;
                            image?: string;
                        } | null;
                    }[] | null>;
                    path: "/get-account-info";
                    options: {
                        method: "GET";
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
            };
        } | {
            id: "customUpdateUser";
            endpoints: {
                customUpdateUser: {
                    <C extends [(better_call.Context<"/update-user-ccc", {
                        method: "POST";
                    }> | undefined)?]>(...ctx: C): Promise<C extends [{
                        asResponse: true;
                    }] ? Response : string | null>;
                    path: "/update-user-ccc";
                    options: {
                        method: "POST";
                    };
                    method: better_call.Method | better_call.Method[];
                    headers: Headers;
                };
            };
        })[];
    };
    $context: Promise<better_auth.AuthContext>;
    $Infer: {
        Session: {
            session: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                userId: string;
                expiresAt: Date;
                token: string;
                ipAddress?: string | null | undefined | undefined;
                userAgent?: string | null | undefined | undefined;
            };
            user: {
                id: string;
                email: string;
                emailVerified: boolean;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                image?: string | null | undefined | undefined;
                handle: string;
                twoFactorEnabled: boolean | null | undefined;
            };
        };
    };
    $ERROR_CODES: {
        USER_NOT_FOUND: string;
        FAILED_TO_CREATE_USER: string;
        FAILED_TO_CREATE_SESSION: string;
        FAILED_TO_UPDATE_USER: string;
        FAILED_TO_GET_SESSION: string;
        INVALID_PASSWORD: string;
        INVALID_EMAIL: string;
        INVALID_EMAIL_OR_PASSWORD: string;
        SOCIAL_ACCOUNT_ALREADY_LINKED: string;
        PROVIDER_NOT_FOUND: string;
        INVALID_TOKEN: string;
        ID_TOKEN_NOT_SUPPORTED: string;
        FAILED_TO_GET_USER_INFO: string;
        USER_EMAIL_NOT_FOUND: string;
        EMAIL_NOT_VERIFIED: string;
        PASSWORD_TOO_SHORT: string;
        PASSWORD_TOO_LONG: string;
        USER_ALREADY_EXISTS: string;
        EMAIL_CAN_NOT_BE_UPDATED: string;
        CREDENTIAL_ACCOUNT_NOT_FOUND: string;
        SESSION_EXPIRED: string;
        FAILED_TO_UNLINK_LAST_ACCOUNT: string;
        ACCOUNT_NOT_FOUND: string;
    };
};

type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>;
type AuthUser = NonNullable<AuthSession>["user"];

declare const _routes: hono_hono_base.HonoBase<Env, ({
    "/better-auth/*": {
        $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: hono_utils_http_status.StatusCode;
        };
    };
} & {
    "/better-auth/*": {
        $post: {
            input: {};
            output: {};
            outputFormat: string;
            status: hono_utils_http_status.StatusCode;
        };
    };
}) | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    type?: "received" | "checking" | "completed" | "incomplete" | "audit" | "all" | undefined;
                };
            };
            output: {
                code: number;
                data: {
                    type: "received" | "checking" | "completed" | "incomplete" | "audit";
                    id: string;
                    userId: string;
                    actionId: number;
                    progress: number;
                    progressMax: number;
                    done: boolean;
                    doneAt: string | null;
                    tx: string | null;
                    power: string;
                }[];
                done: number;
                total: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $put: {
            input: {
                json: {
                    actionId: number;
                };
            };
            output: {
                code: number;
                data: {
                    actionId: number;
                    result: boolean;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/check": {
        $post: {
            input: {
                json: {
                    actionId: number;
                };
            };
            output: {
                code: number;
                data: {
                    actionId: number;
                    result: boolean;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/audit": {
        $post: {
            input: {
                json: {
                    actionId: number;
                    payload?: any;
                };
            };
            output: {
                code: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/achievement"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {
                code: 0;
                data?: {
                    userId: string;
                    rules?: {
                        name: string;
                        condition: {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[] | {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[][];
                        result: {
                            disabled?: boolean | undefined;
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            summary?: boolean | undefined;
                            readability?: boolean | undefined;
                            sourceContent?: boolean | undefined;
                            silence?: boolean | undefined;
                            block?: boolean | undefined;
                            newEntryNotification?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "content" | "all" | "author" | "url" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                            webhooks?: string[] | undefined;
                        };
                    }[] | null | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $put: {
            input: {
                json: {
                    rules?: {
                        name: string;
                        condition: {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[] | {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category" | "entry_title" | "entry_content" | "entry_url" | "entry_author" | "entry_media_length";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[][];
                        result: {
                            disabled?: boolean | undefined;
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            summary?: boolean | undefined;
                            readability?: boolean | undefined;
                            sourceContent?: boolean | undefined;
                            silence?: boolean | undefined;
                            block?: boolean | undefined;
                            newEntryNotification?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "content" | "all" | "author" | "url" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                            webhooks?: string[] | undefined;
                        };
                    }[] | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/actions"> | hono_types.MergeSchemaPath<{
    "/translation": {
        $get: {
            input: {
                query: {
                    id: string;
                    language: "en" | "ja" | "zh-CN" | "zh-TW";
                    fields: string;
                    part?: string | undefined;
                };
            };
            output: {
                code: 0;
                data?: {
                    description?: string | undefined;
                    title?: string | undefined;
                    content?: string | undefined;
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/summary": {
        $get: {
            input: {
                query: {
                    id: string;
                    language?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                };
            };
            output: {
                code: 0;
                data?: string | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/daily": {
        $get: {
            input: {
                query: {
                    view: "0" | "1";
                    startDate: string;
                };
            };
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/ai"> | hono_types.MergeSchemaPath<{
    "/": {
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
    };
} & {
    "/": {
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
    };
} & {
    "/": {
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
}, "/categories"> | hono_types.MergeSchemaPath<{
    "/": {
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
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    entryId: string;
                    view?: number | undefined;
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
    "/": {
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
}, "/collections"> | hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    keyword: string;
                    target?: "feeds" | "lists" | undefined;
                };
            };
            output: {
                data: {
                    entries?: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        language: string | null;
                        feedId: string;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    }[] | undefined;
                    feed?: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    } | undefined;
                    list?: {
                        type: "list";
                        id: string;
                        view: number;
                        feedIds: string[];
                        fee: number;
                        timelineUpdatedAt: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        feeds?: {
                            type: "feed";
                            id: string;
                            url: string;
                            description?: string | null | undefined;
                            title?: string | null | undefined;
                            image?: string | null | undefined;
                            siteUrl?: string | null | undefined;
                            errorMessage?: string | null | undefined;
                            errorAt?: string | null | undefined;
                            ownerUserId?: string | null | undefined;
                            owner?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            }[] | null | undefined;
                        }[] | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                    } | undefined;
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
    "/rsshub": {
        $get: {
            input: {
                query: {
                    category?: string | undefined;
                    categories?: string | undefined;
                    namespace?: string | undefined;
                    lang?: string | undefined;
                };
            };
            output: {
                data: {
                    [x: string]: {
                        description: string;
                        name: string;
                        url: string;
                        lang: string;
                        routes: {
                            [x: string]: {
                                path: string;
                                example: string;
                                description: string;
                                name: string;
                                categories: string[];
                                parameters: {
                                    [x: string]: string;
                                };
                                maintainers: string[];
                                location: string;
                                view?: number | undefined;
                            };
                        };
                    };
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/rsshub/route": {
        $get: {
            input: {
                query: {
                    route: string;
                };
            };
            output: {
                data: {
                    description: string;
                    name: string;
                    url: string;
                    prefix: string;
                    route?: any;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/discover"> | hono_types.MergeSchemaPath<hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    inboxId: string;
                    read?: boolean | undefined;
                    limit?: number | undefined;
                    publishedAfter?: string | undefined;
                    publishedBefore?: string | undefined;
                };
            };
            output: {
                code: 0;
                remaining: number;
                data?: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        language: string | null;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        read: boolean | null;
                        inboxHandle: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    };
                    feeds: {
                        type: "inbox";
                        id: string;
                        secret: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
                    settings?: {
                        disabled?: boolean | undefined;
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        summary?: boolean | undefined;
                        readability?: boolean | undefined;
                        sourceContent?: boolean | undefined;
                        silence?: boolean | undefined;
                        block?: boolean | undefined;
                        newEntryNotification?: boolean | undefined;
                        rewriteRules?: {
                            from: string;
                            to: string;
                        }[] | undefined;
                        webhooks?: string[] | undefined;
                    } | undefined;
                }[] | undefined;
                total?: number | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data?: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        language: string | null;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        read: boolean | null;
                        inboxHandle: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    };
                    feeds: {
                        type: "inbox";
                        id: string;
                        secret: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                    };
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
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
}, "/inbox"> & hono_types.MergeSchemaPath<{
    "/:id": {
        $get: {
            input: {
                param: {
                    id?: any;
                };
            } & {
                query: {
                    size?: number | undefined;
                    page?: number | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    users: {
                        [x: string]: {
                            name: string | null;
                            id: string;
                            image: string | null;
                            handle: string | null;
                        };
                    };
                    entryReadHistories: {
                        userIds: string[];
                        readCount: number;
                    } | null;
                    total: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/read-histories"> & hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    insertedAfter: number;
                    view?: number | undefined;
                    feedId?: string | undefined;
                    read?: string | undefined;
                    feedIdList?: string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    has_new: boolean;
                    entry_id?: string | undefined;
                    lastest_at?: string | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/check-new"> & {
    "/": {
        $post: {
            input: {
                json: {
                    view?: number | undefined;
                    feedId?: string | undefined;
                    read?: boolean | undefined;
                    listId?: string | undefined;
                    limit?: number | undefined;
                    feedIdList?: string[] | undefined;
                    publishedAfter?: string | undefined;
                    publishedBefore?: string | undefined;
                    collected?: boolean | undefined;
                    isCollection?: boolean | undefined;
                    isArchived?: boolean | undefined;
                    withContent?: boolean | undefined;
                };
            };
            output: {
                code: 0;
                data?: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        language: string | null;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    };
                    feeds: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
                    settings?: {
                        disabled?: boolean | undefined;
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        summary?: boolean | undefined;
                        readability?: boolean | undefined;
                        sourceContent?: boolean | undefined;
                        silence?: boolean | undefined;
                        block?: boolean | undefined;
                        newEntryNotification?: boolean | undefined;
                        rewriteRules?: {
                            from: string;
                            to: string;
                        }[] | undefined;
                        webhooks?: string[] | undefined;
                    } | undefined;
                }[] | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data?: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        language: string | null;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    };
                    feeds: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    };
                } | undefined;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/stream": {
        $post: {
            input: {
                json: {
                    ids: string[];
                };
            };
            output: {};
            outputFormat: "text";
            status: 200;
        };
    };
} & {
    "/preview": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data: {
                    description: string | null;
                    title: string | null;
                    content: string | null;
                    id: string;
                    author: string | null;
                    url: string | null;
                    language: string | null;
                    feedId: string;
                    guid: string;
                    categories: string[] | null;
                    authorUrl: string | null;
                    authorAvatar: string | null;
                    insertedAt: string;
                    publishedAt: string;
                    media?: {
                        type: "photo" | "video";
                        url: string;
                        width?: number | undefined;
                        height?: number | undefined;
                        preview_image_url?: string | undefined;
                        blurhash?: string | undefined;
                    }[] | null | undefined;
                    attachments?: {
                        url: string;
                        title?: string | undefined;
                        duration_in_seconds?: number | undefined;
                        mime_type?: string | undefined;
                        size_in_bytes?: number | undefined;
                    }[] | null | undefined;
                    extra?: {
                        links?: {
                            type: string;
                            url: string;
                            content_html?: string | undefined;
                        }[] | null | undefined;
                    } | null | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/entries"> | hono_types.MergeSchemaPath<hono_types.MergeSchemaPath<{
    "/message": {
        $get: {
            input: {
                query: {
                    feedId: string;
                };
            };
            output: {
                code: 0;
                data: {
                    json: string;
                    xml: string;
                    description: string;
                    content: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/challenge": {
        $post: {
            input: {
                json: {
                    feedId: string;
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
    "/list": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    feed: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    };
                    subscriptionCount: number;
                    tipAmount: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/claim"> & {
    "/": {
        $get: {
            input: {
                query: {
                    id?: string | undefined;
                    url?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        author: string | null;
                        url: string | null;
                        language: string | null;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        publishedAt: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    }[];
                    readCount: number;
                    feed: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    };
                    subscriptionCount: number;
                    subscription?: {
                        title: string | null;
                        createdAt: string;
                        userId: string;
                        view: number;
                        category: string | null;
                        feedId: string;
                        isPrivate: boolean;
                    } | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/refresh": {
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
    "/reset": {
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
}, "/feeds"> | hono_types.MergeSchemaPath<{
    "/new": {
        $post: {
            input: {
                json: {
                    TOTPCode?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/use": {
        $post: {
            input: {
                json: {
                    code: string;
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
    "/": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    code: string;
                    createdAt: string | null;
                    users: {
                        name: string | null;
                        id: string;
                        image: string | null;
                    } | null;
                    usedAt: string | null;
                    toUserId: string | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/limitation": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/invitations"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    id?: string | undefined;
                    handle?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    name: string | null;
                    id: string;
                    emailVerified: boolean | null;
                    image: string | null;
                    handle: string | null;
                    createdAt: string;
                    updatedAt: string;
                    twoFactorEnabled: boolean | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/batch": {
        $post: {
            input: {
                json: {
                    ids: string[];
                };
            };
            output: {
                code: 0;
                data: {
                    [x: string]: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                        twoFactorEnabled: boolean | null;
                    };
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/profiles"> | hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    entryIds: string[];
                    isInbox?: boolean | undefined;
                    readHistories?: string[] | undefined;
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
    "/": {
        $delete: {
            input: {
                json: {
                    entryId: string;
                    isInbox?: boolean | undefined;
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
    "/": {
        $get: {
            input: {
                query: {
                    view?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    [x: string]: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/all": {
        $post: {
            input: {
                json: {
                    view?: number | undefined;
                    feedId?: string | undefined;
                    listId?: string | undefined;
                    feedIdList?: string[] | undefined;
                    inboxId?: string | undefined;
                    startTime?: number | undefined;
                    endTime?: number | undefined;
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
    "/total-count": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    count: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/reads"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    tab?: "general" | "appearance" | "integration" | undefined;
                };
            };
            output: {
                code: 0;
                settings: {
                    [x: string]: any;
                };
                updated: {
                    [x: string]: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/:tab": {
        $patch: {
            input: {
                param: {
                    tab: string;
                };
            } & {
                json: Record<string, any>;
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/settings"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    userId?: string | undefined;
                    view?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: ({
                    title: string | null;
                    createdAt: string;
                    userId: string;
                    view: number;
                    category: string | null;
                    feeds: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    };
                    feedId: string;
                    isPrivate: boolean;
                    boost: {
                        boosters: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                            twoFactorEnabled: boolean | null;
                        }[];
                    };
                } | {
                    title: string | null;
                    createdAt: string;
                    userId: string;
                    view: number;
                    feedId: string;
                    isPrivate: boolean;
                    lists: {
                        type: "list";
                        id: string;
                        view: number;
                        feedIds: string[];
                        fee: number;
                        timelineUpdatedAt: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        feeds?: {
                            type: "feed";
                            id: string;
                            url: string;
                            description?: string | null | undefined;
                            title?: string | null | undefined;
                            image?: string | null | undefined;
                            siteUrl?: string | null | undefined;
                            errorMessage?: string | null | undefined;
                            errorAt?: string | null | undefined;
                            ownerUserId?: string | null | undefined;
                            owner?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            }[] | null | undefined;
                        }[] | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                    };
                    listId: string;
                    lastViewedAt: string | null;
                    category?: string | undefined;
                } | {
                    title: string | null;
                    createdAt: string;
                    userId: string;
                    view: number;
                    category: string | null;
                    feedId: string;
                    isPrivate: boolean;
                    inboxes: {
                        type: "inbox";
                        id: string;
                        secret: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                    };
                    inboxId: string;
                })[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    view: number;
                    title?: string | null | undefined;
                    category?: string | null | undefined;
                    url?: string | undefined;
                    isPrivate?: boolean | undefined;
                    listId?: string | undefined;
                    TOTPCode?: string | undefined;
                };
            };
            output: {
                code: 0;
                feed: {
                    description: string | null;
                    title: string | null;
                    id: string;
                    image: string | null;
                    url: string;
                    siteUrl: string | null;
                    checkedAt: string;
                    lastModifiedHeader: string | null;
                    etagHeader: string | null;
                    ttl: number | null;
                    errorMessage: string | null;
                    errorAt: string | null;
                    ownerUserId: string | null;
                    language: string | null;
                    migrateTo: string | null;
                } | null;
                list: {
                    description: string | null;
                    title: string;
                    id: string;
                    image: string | null;
                    view: number;
                    ownerUserId: string;
                    language: string | null;
                    feedIds: string[];
                    fee: number;
                    timelineUpdatedAt: string;
                } | null;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
                    url?: string | undefined;
                    feedId?: string | undefined;
                    listId?: string | undefined;
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
    "/": {
        $patch: {
            input: {
                json: {
                    view: number;
                    title?: string | null | undefined;
                    category?: string | null | undefined;
                    feedId?: string | undefined;
                    isPrivate?: boolean | undefined;
                    listId?: string | undefined;
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
    "/export": {
        $get: {
            input: {
                query: {
                    RSSHubURL?: string | undefined;
                    folderMode?: "view" | "category" | undefined;
                };
            };
            output: {};
            outputFormat: string;
            status: 200;
        };
    };
} & {
    "/import": {
        $post: {
            input: {};
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/batch": {
        $patch: {
            input: {
                json: {
                    view: number;
                    feedIds: string[];
                    title?: string | null | undefined;
                    category?: string | null | undefined;
                    isPrivate?: boolean | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/subscriptions"> | hono_types.MergeSchemaPath<hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    tx: string | null;
                    amount: string;
                    rank: string | null;
                    detail: {
                        "Invitations count": number;
                        "Purchase lists cost": number;
                        "Total tip amount": number;
                        "Feeds subscriptions count": number;
                        "Lists subscriptions count": number;
                        "Inbox subscriptions count": number;
                        "Recent read count in the last month": number;
                        "Mint count": number;
                        "Claimed feeds count": number;
                        "Claimed feeds subscriptions count": number;
                        "Lists with more than 1 feed count": number;
                        "Created lists subscriptions count": number;
                        "Created lists income amount": number;
                        "GitHub Community Contributions": number;
                        "Invitations count Rank": number;
                        "Purchase lists cost Rank": number;
                        "Total tip amount Rank": number;
                        "Feeds subscriptions count Rank": number;
                        "Lists subscriptions count Rank": number;
                        "Inbox subscriptions count Rank": number;
                        "Recent read count in the last month Rank": number;
                        "Mint count Rank": number;
                        "Claimed feeds count Rank": number;
                        "Claimed feeds subscriptions count Rank": number;
                        "Lists with more than 1 feed count Rank": number;
                        "Created lists subscriptions count Rank": number;
                        "Created lists income amount Rank": number;
                        "GitHub Community Contributions Rank": number;
                    } | null;
                    verify: string | null;
                } | null;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $put: {
            input: {
                json: {
                    verify: string | null;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/airdrop"> & hono_types.MergeSchemaPath<{
    "/tip": {
        $post: {
            input: {
                json: {
                    amount: string;
                    entryId: string;
                    TOTPCode?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $get: {
            input: {
                query: {
                    type?: "tip" | "mint" | "burn" | "withdraw" | "purchase" | "airdrop" | undefined;
                    hash?: string | undefined;
                    fromUserId?: string | undefined;
                    toUserId?: string | undefined;
                    toFeedId?: string | undefined;
                    fromOrToUserId?: string | undefined;
                    createdAfter?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    type: "tip" | "mint" | "burn" | "withdraw" | "purchase" | "airdrop";
                    createdAt: string;
                    hash: string;
                    powerToken: string;
                    fromUserId: string | null;
                    toUserId: string | null;
                    toFeedId: string | null;
                    toListId: string | null;
                    toEntryId: string | null;
                    toRSSHubId: string | null;
                    tax: string;
                    comment: string | null;
                    fromUser?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                        twoFactorEnabled: boolean | null;
                    } | null | undefined;
                    toUser?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                        twoFactorEnabled: boolean | null;
                    } | null | undefined;
                    toFeed?: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    } | null | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/claim_daily": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/withdraw": {
        $post: {
            input: {
                json: {
                    amount: string;
                    address: string;
                    TOTPCode?: string | undefined;
                    toRss3?: boolean | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/claim-check": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: boolean;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/transactions"> & {
    "/": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    createdAt: string;
                    userId: string;
                    powerToken: string;
                    addressIndex: number;
                    address: string | null;
                    dailyPowerToken: string;
                    cashablePowerToken: string;
                    level: {
                        rank: number | null;
                        level: number | null;
                        prevActivityPoints: number | null;
                        activityPoints: number | null;
                    } | null;
                    todayDailyPower: string;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/refresh": {
        $post: {
            input: {};
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/ranking": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    user: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                        twoFactorEnabled: boolean | null;
                    };
                    userId: string;
                    rank: number | null;
                    powerToken: string;
                    address: string;
                    level: number | null;
                    prevActivityPoints: number | null;
                    activityPoints: number | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/power-price": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    rss3: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/wallets"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    listId: string;
                };
            };
            output: {
                code: 0;
                data: {
                    entries: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        feeds: {
                            type: "feed";
                            id: string;
                            url: string;
                            description?: string | null | undefined;
                            title?: string | null | undefined;
                            image?: string | null | undefined;
                            siteUrl?: string | null | undefined;
                            errorMessage?: string | null | undefined;
                            errorAt?: string | null | undefined;
                            ownerUserId?: string | null | undefined;
                            owner?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            }[] | null | undefined;
                        };
                        language: string | null;
                        feedId: string;
                        guid: string;
                        categories: string[] | null;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                            blurhash?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                        extra?: {
                            links?: {
                                type: string;
                                url: string;
                                content_html?: string | undefined;
                            }[] | null | undefined;
                        } | null | undefined;
                    }[];
                    readCount: number;
                    list: {
                        type: "list";
                        id: string;
                        view: number;
                        feedIds: string[];
                        fee: number;
                        timelineUpdatedAt: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        feeds?: {
                            type: "feed";
                            id: string;
                            url: string;
                            description?: string | null | undefined;
                            title?: string | null | undefined;
                            image?: string | null | undefined;
                            siteUrl?: string | null | undefined;
                            errorMessage?: string | null | undefined;
                            errorAt?: string | null | undefined;
                            ownerUserId?: string | null | undefined;
                            owner?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: boolean | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                                updatedAt: string;
                            }[] | null | undefined;
                        }[] | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                    };
                    subscriptionCount: number;
                    feedCount: number;
                    subscription?: {
                        title: string | null;
                        createdAt: string;
                        userId: string;
                        view: number;
                        isPrivate: boolean;
                        listId: string;
                        lastViewedAt: string | null;
                    } | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    title: string;
                    view: number;
                    fee: number;
                    description?: string | null | undefined;
                    image?: string | null | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    type: "list";
                    id: string;
                    view: number;
                    feedIds: string[];
                    fee: number;
                    timelineUpdatedAt: string;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    image?: string | null | undefined;
                    feeds?: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    }[] | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                    } | null | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
                    listId: string;
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
    "/": {
        $patch: {
            input: {
                json: {
                    title: string;
                    view: number;
                    fee: number;
                    listId: string;
                    description?: string | null | undefined;
                    image?: string | null | undefined;
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
    "/list": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    type: "list";
                    id: string;
                    view: number;
                    feedIds: string[];
                    fee: number;
                    timelineUpdatedAt: string;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    image?: string | null | undefined;
                    feeds?: {
                        type: "feed";
                        id: string;
                        url: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: boolean | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                            updatedAt: string;
                        }[] | null | undefined;
                    }[] | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                    } | null | undefined;
                    subscriptionCount?: number | undefined;
                    purchaseAmount?: number | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/feeds": {
        $post: {
            input: {
                json: {
                    feedId: string;
                    listId: string;
                } | {
                    feedIds: string[];
                    listId: string;
                };
            };
            output: {
                code: 0;
                data: {
                    type: "feed";
                    id: string;
                    url: string;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    image?: string | null | undefined;
                    siteUrl?: string | null | undefined;
                    errorMessage?: string | null | undefined;
                    errorAt?: string | null | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                    } | null | undefined;
                    tipUsers?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                    }[] | null | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/feeds": {
        $delete: {
            input: {
                json: {
                    feedId: string;
                    listId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/lists"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {};
            output: {};
            outputFormat: "text";
            status: 200;
        };
    };
} & {
    "/pools": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    totalCount: number;
                    idleCount: number;
                    waitingCount: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/metrics"> | hono_types.MergeSchemaPath<{
    "/clean": {
        $post: {
            input: {
                json: {
                    type: string;
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
    "/mintdscsafr": {
        $post: {
            input: {
                json: {
                    userId: string;
                    amount: number;
                    key: string;
                    comment?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/admin"> | hono_types.MergeSchemaPath<{
    "/": {
        $delete: {
            input: {
                json: {
                    handle: string;
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
    "/": {
        $get: {
            input: {
                query: {
                    handle: string;
                };
            };
            output: {
                code: 0;
                data: {
                    type: "inbox";
                    id: string;
                    secret: string;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    image?: string | null | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                    } | null | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    handle: string;
                    title?: string | undefined;
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
    "/webhook": {
        $post: {
            input: {
                json: {
                    guid: string;
                    publishedAt: string;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    content?: string | null | undefined;
                    author?: string | null | undefined;
                    url?: string | null | undefined;
                    language?: string | null | undefined;
                    media?: {
                        type: "photo" | "video";
                        url: string;
                        width?: number | undefined;
                        height?: number | undefined;
                        preview_image_url?: string | undefined;
                        blurhash?: string | undefined;
                    }[] | null | undefined;
                    categories?: string[] | null | undefined;
                    attachments?: {
                        url: string;
                        title?: string | undefined;
                        duration_in_seconds?: number | undefined;
                        mime_type?: string | undefined;
                        size_in_bytes?: number | undefined;
                    }[] | null | undefined;
                    extra?: {
                        links?: {
                            type: string;
                            url: string;
                            content_html?: string | undefined;
                        }[] | null | undefined;
                    } | null | undefined;
                    authorUrl?: string | null | undefined;
                    authorAvatar?: string | null | undefined;
                    read?: boolean | null | undefined;
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
    "/email": {
        $post: {
            input: {
                json: {
                    date: string;
                    from: {
                        name?: string | undefined;
                        address?: string | undefined;
                    };
                    to: {
                        address: string;
                    };
                    messageId: string;
                    subject?: string | undefined;
                    html?: string | undefined;
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
    "/": {
        $put: {
            input: {
                json: {
                    title: string;
                    handle: string;
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
    "/list": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    type: "inbox";
                    id: string;
                    secret: string;
                    description?: string | null | undefined;
                    title?: string | null | undefined;
                    image?: string | null | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: boolean | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                        updatedAt: string;
                    } | null | undefined;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/inboxes"> | hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    token: string;
                    channel: "desktop" | "mobile";
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
    "/test": {
        $get: {
            input: {};
            output: {
                code: 0;
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/messaging"> | hono_types.MergeSchemaPath<{
    "/configs": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    MAX_SUBSCRIPTIONS: number;
                    MAX_LISTS: number;
                    MAX_ACTIONS: number;
                    MAX_WEBHOOKS_PER_ACTION: number;
                    MAX_INBOXES: number;
                    IMPORTING_TITLE: string;
                    DAILY_POWER_PERCENTAGES: number[];
                    LEVEL_PERCENTAGES: number[];
                    DAILY_CLAIM_AMOUNT: {
                        trial: number;
                        normal: number;
                    };
                    TAX_POINT: string;
                    INVITATION_INTERVAL_DAYS: number;
                    INVITATION_PRICE: number;
                    DAILY_POWER_SUPPLY: number;
                    IS_RSS3_TESTNET: boolean;
                    PRODUCT_HUNT_VOTE_URL: string;
                    ANNOUNCEMENT: string;
                    MAX_TRIAL_USER_FEED_SUBSCRIPTION: number;
                    MAX_TRIAL_USER_LIST_SUBSCRIPTION: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/status"> | hono_types.MergeSchemaPath<{
    "/": {
        $get: {
            input: {
                query: {
                    feedId: string;
                };
            };
            output: {
                code: 0;
                data: {
                    level: number;
                    monthlyBoostCost: number;
                    boostCount: number;
                    remainingBoostsToLevelUp: number;
                    lastValidBoost: {
                        hash: string | null;
                        expiresAt: string;
                    } | null;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/boosters": {
        $get: {
            input: {
                query: {
                    feedId: string;
                };
            };
            output: {
                code: 0;
                data: {
                    name: string | null;
                    id: string;
                    emailVerified: boolean | null;
                    image: string | null;
                    handle: string | null;
                    createdAt: string;
                    updatedAt: string;
                    twoFactorEnabled: boolean | null;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $post: {
            input: {
                json: {
                    amount: string;
                    feedId: string;
                    TOTPCode?: string | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    expiresAt: string;
                    transactionHash: string;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "boosts"> | hono_types.MergeSchemaPath<{
    "/postgresql": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/redis": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: number;
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/bullmq": {
        $get: {
            input: {
                query: {
                    name: "follow-queue" | "admin-wallet-queue";
                };
            };
            output: {
                code: 0;
                data: {
                    completed: number;
                    wait: number;
                    failed: number;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/probes"> | hono_types.MergeSchemaPath<{
    "/": {
        $post: {
            input: {
                json: {
                    baseUrl: string;
                    id?: string | undefined;
                    accessKey?: string | undefined;
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
    "/list": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    description: string | null;
                    id: string;
                    ownerUserId: string;
                    owner: {
                        name: string | null;
                        id: string;
                        image: string | null;
                        handle: string | null;
                    } | null;
                    price: number;
                    userLimit: number | null;
                    userCount: number;
                }[];
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/": {
        $delete: {
            input: {
                json: {
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
    "/use": {
        $post: {
            input: {
                json: {
                    id: string | null;
                    TOTPCode?: string | undefined;
                    durationInMonths?: number | undefined;
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
    "/": {
        $get: {
            input: {
                query: {
                    id: string;
                };
            };
            output: {
                code: 0;
                data: {
                    purchase: {
                        hash: string | null;
                        expiresAt: string;
                    } | null;
                    instance: {
                        description: string | null;
                        id: string;
                        ownerUserId: string;
                        price: number;
                        userLimit: number | null;
                        baseUrl?: string | null | undefined;
                        accessKey?: string | null | undefined;
                    };
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
} & {
    "/status": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    purchase: {
                        hash: string | null;
                        expiresAt: string;
                    } | null;
                    usage?: {
                        id: string;
                        userId: string;
                        rsshubId: string;
                    } | undefined;
                };
            };
            outputFormat: "json";
            status: 200;
        };
    };
}, "/rsshub">, "/">;
type AppType = typeof _routes;

export { type ActionsModel, type AirdropActivity, type AppType, type AttachmentsModel, type AuthSession, type AuthUser, CommonEntryFields, type ConditionItem, type DetailModel, type EntriesModel, type EntryReadHistoriesModel, type ExtraModel, type FeedModel, type MediaModel, type MessagingData, MessagingType, type SettingsModel, type UrlReadsModel, account, achievements, achievementsOpenAPISchema, actions, actionsItemOpenAPISchema, actionsOpenAPISchema, actionsRelations, activityEnum, airdrops, airdropsOpenAPISchema, attachmentsZodSchema, authPlugins, boosts, collections, collectionsOpenAPISchema, collectionsRelations, detailModelSchema, entries, entriesOpenAPISchema, entriesRelations, entryReadHistories, entryReadHistoriesOpenAPISchema, entryReadHistoriesRelations, extraZodSchema, feedPowerTokens, feedPowerTokensOpenAPISchema, feedPowerTokensRelations, feeds, feedsOpenAPISchema, feedsRelations, inboxHandleSchema, inboxes, inboxesEntries, inboxesEntriesInsertOpenAPISchema, type inboxesEntriesModel, inboxesEntriesOpenAPISchema, inboxesEntriesRelations, inboxesOpenAPISchema, inboxesRelations, invitations, invitationsOpenAPISchema, invitationsRelations, languageSchema, levels, levelsOpenAPISchema, levelsRelations, lists, listsOpenAPISchema, listsRelations, listsSubscriptions, listsSubscriptionsOpenAPISchema, listsSubscriptionsRelations, listsTimeline, listsTimelineOpenAPISchema, listsTimelineRelations, lower, mediaZodSchema, messaging, messagingOpenAPISchema, messagingRelations, rsshub, rsshubOpenAPISchema, rsshubPurchase, rsshubUsage, rsshubUsageOpenAPISchema, rsshubUsageRelations, session, settings, subscriptions, subscriptionsOpenAPISchema, subscriptionsRelations, timeline, timelineOpenAPISchema, timelineRelations, transactionType, transactions, transactionsOpenAPISchema, transactionsRelations, twoFactor, urlReads, urlReadsOpenAPISchema, user, users, usersOpenApiSchema, usersRelations, verification, wallets, walletsOpenAPISchema, walletsRelations };
