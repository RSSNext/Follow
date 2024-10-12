import * as hono_hono_base from 'hono/hono-base';
import { HttpBindings } from '@hono/node-server';
import * as zod from 'zod';
import { z } from 'zod';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import * as drizzle_orm from 'drizzle-orm';
import { InferInsertModel } from 'drizzle-orm';

type Env = {
    Bindings: HttpBindings;
};

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
            generated: undefined;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
            tableName: "achievements";
            dataType: "string";
            columnType: "PgText";
            data: "received" | "checking" | "completed" | "incomplete";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["checking", "completed", "incomplete", "received"];
            baseColumn: never;
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const achievementsOpenAPISchema: zod.ZodObject<{
    id: zod.ZodString;
    userId: zod.ZodString;
    type: zod.ZodEnum<["checking", "completed", "incomplete", "received"]>;
    actionId: zod.ZodNumber;
    progress: zod.ZodNumber;
    progressMax: zod.ZodNumber;
    done: zod.ZodBoolean;
    doneAt: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    type: "received" | "checking" | "completed" | "incomplete";
    id: string;
    userId: string;
    actionId: number;
    progress: number;
    progressMax: number;
    done: boolean;
    doneAt: string | null;
}, {
    type: "received" | "checking" | "completed" | "incomplete";
    id: string;
    userId: string;
    actionId: number;
    progress: number;
    progressMax: number;
    done: boolean;
    doneAt: string | null;
}>;

declare const languageSchema: z.ZodEnum<["en", "ja", "zh-CN", "zh-TW"]>;
declare const conditionFieldSchema: z.ZodEnum<["view", "title", "site_url", "feed_url", "category"]>;
declare const conditionOperatorSchema: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
declare const ruleFieldSchema: z.ZodEnum<["all", "title", "content", "author", "url", "order"]>;
declare const ruleOperatorSchema: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
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
            generated: undefined;
        }, {}, {}>;
        rules: drizzle_orm_pg_core.PgColumn<{
            name: "rules";
            tableName: "actions";
            dataType: "json";
            columnType: "PgJsonb";
            data: {
                name: string;
                condition: {
                    field: z.infer<typeof conditionFieldSchema>;
                    operator: z.infer<typeof conditionOperatorSchema>;
                    value: string;
                }[];
                result: {
                    translation?: z.infer<typeof languageSchema>;
                    summary?: boolean;
                    readability?: boolean;
                    silence?: boolean;
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const actionsItemOpenAPISchema: z.ZodObject<{
    name: z.ZodString;
    condition: z.ZodArray<z.ZodObject<{
        field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category"]>;
        operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
        value: z.ZodString;
    }, "strip", z.ZodTypeAny, {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }, {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }>, "many">;
    result: z.ZodObject<{
        translation: z.ZodOptional<z.ZodEnum<["en", "ja", "zh-CN", "zh-TW"]>>;
        summary: z.ZodOptional<z.ZodBoolean>;
        readability: z.ZodOptional<z.ZodBoolean>;
        silence: z.ZodOptional<z.ZodBoolean>;
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
            field: "title" | "all" | "content" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }, {
            value: string | number;
            field: "title" | "all" | "content" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }>, "many">>;
        webhooks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
    }, "strip", z.ZodTypeAny, {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        silence?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "all" | "content" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    }, {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        silence?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "all" | "content" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    result: {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        silence?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "all" | "content" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    };
    condition: {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[];
}, {
    name: string;
    result: {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        silence?: boolean | undefined;
        newEntryNotification?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "all" | "content" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
        webhooks?: string[] | undefined;
    };
    condition: {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[];
}>;
declare const actionsOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    userId: z.ZodString;
    rules: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
}, "rules">, {
    rules: z.ZodNullable<z.ZodOptional<z.ZodArray<z.ZodObject<{
        name: z.ZodString;
        condition: z.ZodArray<z.ZodObject<{
            field: z.ZodEnum<["view", "title", "site_url", "feed_url", "category"]>;
            operator: z.ZodEnum<["contains", "not_contains", "eq", "not_eq", "gt", "lt", "regex"]>;
            value: z.ZodString;
        }, "strip", z.ZodTypeAny, {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }, {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }>, "many">;
        result: z.ZodObject<{
            translation: z.ZodOptional<z.ZodEnum<["en", "ja", "zh-CN", "zh-TW"]>>;
            summary: z.ZodOptional<z.ZodBoolean>;
            readability: z.ZodOptional<z.ZodBoolean>;
            silence: z.ZodOptional<z.ZodBoolean>;
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
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }, {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }>, "many">>;
            webhooks: z.ZodOptional<z.ZodArray<z.ZodString, "many">>;
        }, "strip", z.ZodTypeAny, {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            silence?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        }, {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            silence?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            silence?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
    }, {
        name: string;
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            silence?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
    }>, "many">>>;
}>, "strip", z.ZodTypeAny, {
    userId: string;
    rules?: {
        name: string;
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            silence?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
    }[] | null | undefined;
}, {
    userId: string;
    rules?: {
        name: string;
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            silence?: boolean | undefined;
            newEntryNotification?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "all" | "content" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
            webhooks?: string[] | undefined;
        };
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
    }[] | null | undefined;
}>;
declare const actionsRelations: drizzle_orm.Relations<"actions", {
    users: drizzle_orm.One<"user", true>;
}>;
type ActionsModel = z.infer<typeof actionsOpenAPISchema>;
type SettingsModel = Exclude<z.infer<typeof actionsItemOpenAPISchema>["result"], undefined>;

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
        generated: undefined;
    }>>>>>;
    title: drizzle_orm_pg_core.PgTextBuilder<{
        name: "title";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    url: drizzle_orm_pg_core.PgTextBuilder<{
        name: "url";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    content: drizzle_orm_pg_core.PgTextBuilder<{
        name: "content";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    description: drizzle_orm_pg_core.PgTextBuilder<{
        name: "description";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    guid: drizzle_orm.NotNull<drizzle_orm_pg_core.PgTextBuilder<{
        name: "guid";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>>;
    author: drizzle_orm_pg_core.PgTextBuilder<{
        name: "author";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    authorUrl: drizzle_orm_pg_core.PgTextBuilder<{
        name: "author_url";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    authorAvatar: drizzle_orm_pg_core.PgTextBuilder<{
        name: "author_avatar";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
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
        generated: drizzle_orm.GeneratedColumnConfig<string>;
    }, {
        name: "categories";
        dataType: "string";
        columnType: "PgText";
        data: string;
        enumValues: [string, ...string[]];
        driverParam: string;
        generated: undefined;
    }>;
    attachments: drizzle_orm.$Type<drizzle_orm_pg_core.PgJsonbBuilderInitial<"attachments">, AttachmentsModel[]>;
    extra: drizzle_orm.$Type<drizzle_orm_pg_core.PgJsonbBuilderInitial<"extra">, ExtraModel>;
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
            generated: undefined;
        }, {}, {}>;
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
                generated: undefined;
            }, object, object>;
            generated: undefined;
        }, {}, {}>;
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
            generated: undefined;
        }, {}, {}>;
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
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    categories: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    extra: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
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
                generated: undefined;
            }, object, object>;
            generated: undefined;
        }, {}, {}>;
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
}>;
declare const feedsRelations: drizzle_orm.Relations<"feeds", {
    subscriptions: drizzle_orm.Many<"subscriptions">;
    entries: drizzle_orm.Many<"entries">;
    owner: drizzle_orm.One<"user", false>;
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
    isPrivate: zod.ZodBoolean;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    title: string | null;
    userId: string;
    view: number;
    category: string | null;
    feedId: string;
    isPrivate: boolean;
}, {
    title: string | null;
    userId: string;
    view: number;
    category: string | null;
    feedId: string;
    isPrivate: boolean;
}>;
declare const subscriptionsRelations: drizzle_orm.Relations<"subscriptions", {
    users: drizzle_orm.One<"user", true>;
    feeds: drizzle_orm.One<"feeds", true>;
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
            generated: undefined;
        }, {}, {}>;
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
                generated: undefined;
            }, object, object>;
            generated: undefined;
        }, {}, {}>;
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
            generated: undefined;
        }, {}, {}>;
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
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    categories: z.ZodNullable<z.ZodArray<z.ZodString, "many">>;
    attachments: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
    extra: z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>;
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
    guid: z.ZodString;
    media: z.ZodOptional<z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>>;
    categories: z.ZodOptional<z.ZodNullable<z.ZodArray<z.ZodString, "many">>>;
    attachments: z.ZodOptional<z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>>;
    extra: z.ZodOptional<z.ZodNullable<z.ZodType<string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null, z.ZodTypeDef, string | number | boolean | {
        [key: string]: string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null;
    } | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | (string | number | boolean | any | any | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null)[] | null>>>;
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const invitationsOpenAPISchema: zod.ZodObject<{
    code: zod.ZodString;
    createdAt: zod.ZodNullable<zod.ZodString>;
    fromUserId: zod.ZodString;
    toUserId: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    code: string;
    createdAt: string | null;
    fromUserId: string;
    toUserId: string | null;
}, {
    code: string;
    createdAt: string | null;
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
                generated: undefined;
            }, object, object>;
            generated: undefined;
        }, {}, {}>;
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
    ownerUserId: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    description: string | null;
    title: string;
    id: string;
    image: string | null;
    view: number;
    ownerUserId: string;
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
    isPrivate: zod.ZodBoolean;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    title: string | null;
    userId: string;
    view: number;
    isPrivate: boolean;
    listId: string;
    lastViewedAt: string | null;
}, {
    title: string | null;
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
            generated: undefined;
        }, {}, {}>;
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
            generated: undefined;
        }, {}, {}>;
        emailVerified: drizzle_orm_pg_core.PgColumn<{
            name: "emailVerified";
            tableName: "user";
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const usersOpenApiSchema: z.ZodObject<Omit<{
    id: z.ZodString;
    name: z.ZodNullable<z.ZodString>;
    email: z.ZodString;
    emailVerified: z.ZodNullable<z.ZodString>;
    image: z.ZodNullable<z.ZodString>;
    handle: z.ZodNullable<z.ZodString>;
    createdAt: z.ZodDate;
}, "email">, z.UnknownKeysParam, z.ZodTypeAny, {
    name: string | null;
    id: string;
    emailVerified: string | null;
    image: string | null;
    handle: string | null;
    createdAt: Date;
}, {
    name: string | null;
    id: string;
    emailVerified: string | null;
    image: string | null;
    handle: string | null;
    createdAt: Date;
}>;
declare const accounts: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "account";
    schema: undefined;
    columns: {
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
            generated: undefined;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
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
            generated: undefined;
        }, {}, {}>;
        provider: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
        providerAccountId: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
        refresh_token: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
        access_token: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
        expires_at: drizzle_orm_pg_core.PgColumn<{
            name: "expires_at";
            tableName: "account";
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
            generated: undefined;
        }, {}, {}>;
        token_type: drizzle_orm_pg_core.PgColumn<{
            name: "token_type";
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
            generated: undefined;
        }, {}, {}>;
        id_token: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
        session_state: drizzle_orm_pg_core.PgColumn<{
            name: "session_state";
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const sessions: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "session";
    schema: undefined;
    columns: {
        sessionToken: drizzle_orm_pg_core.PgColumn<{
            name: "sessionToken";
            tableName: "session";
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
            generated: undefined;
        }, {}, {}>;
        expires: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const verificationTokens: drizzle_orm_pg_core.PgTableWithColumns<{
    name: "verificationToken";
    schema: undefined;
    columns: {
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
            generated: undefined;
        }, {}, {}>;
        token: drizzle_orm_pg_core.PgColumn<{
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
            generated: undefined;
        }, {}, {}>;
        expires: drizzle_orm_pg_core.PgColumn<{
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
            generated: drizzle_orm.GeneratedColumnConfig<number> & {
                as: any;
                type: "always";
            };
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
    dailyPowerToken: zod.ZodString;
    cashablePowerToken: zod.ZodString;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    createdAt: string;
    userId: string;
    addressIndex: number;
    address: string | null;
    dailyPowerToken: string;
    cashablePowerToken: string;
}, {
    createdAt: string;
    userId: string;
    addressIndex: number;
    address: string | null;
    dailyPowerToken: string;
    cashablePowerToken: string;
}>;
declare const walletsRelations: drizzle_orm.Relations<"wallets", {
    user: drizzle_orm.One<"user", true>;
    transactionsFrom: drizzle_orm.Many<"transactions">;
    transactionTo: drizzle_orm.Many<"transactions">;
}>;
declare const transactionType: drizzle_orm_pg_core.PgEnum<["tip", "mint", "burn", "withdraw", "purchase"]>;
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
            generated: undefined;
        }, {}, {}>;
        type: drizzle_orm_pg_core.PgColumn<{
            name: "type";
            tableName: "transactions";
            dataType: "string";
            columnType: "PgEnumColumn";
            data: "tip" | "mint" | "burn" | "withdraw" | "purchase";
            driverParam: string;
            notNull: true;
            hasDefault: false;
            isPrimaryKey: false;
            isAutoincrement: false;
            hasRuntimeDefault: false;
            enumValues: ["tip", "mint", "burn", "withdraw", "purchase"];
            baseColumn: never;
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
            generated: undefined;
        }, {}, {}>;
    };
    dialect: "pg";
}>;
declare const transactionsOpenAPISchema: zod.ZodObject<{
    hash: zod.ZodString;
    type: zod.ZodEnum<["tip", "mint", "burn", "withdraw", "purchase"]>;
    fromUserId: zod.ZodNullable<zod.ZodString>;
    toUserId: zod.ZodNullable<zod.ZodString>;
    toFeedId: zod.ZodNullable<zod.ZodString>;
    toListId: zod.ZodNullable<zod.ZodString>;
    toEntryId: zod.ZodNullable<zod.ZodString>;
    powerToken: zod.ZodString;
    createdAt: zod.ZodString;
    comment: zod.ZodNullable<zod.ZodString>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    type: "tip" | "mint" | "burn" | "withdraw" | "purchase";
    createdAt: string;
    fromUserId: string | null;
    toUserId: string | null;
    hash: string;
    toFeedId: string | null;
    toListId: string | null;
    toEntryId: string | null;
    powerToken: string;
    comment: string | null;
}, {
    type: "tip" | "mint" | "burn" | "withdraw" | "purchase";
    createdAt: string;
    fromUserId: string | null;
    toUserId: string | null;
    hash: string;
    toFeedId: string | null;
    toListId: string | null;
    toEntryId: string | null;
    powerToken: string;
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

declare const _routes: hono_hono_base.HonoBase<Env, {
    "/messaging": {
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/messaging/test": {
        $get: {
            input: {};
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/inboxes": {
        $delete: {
            input: {
                json: {
                    handle: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    handle: string | string[];
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
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    } | null | undefined;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/inboxes/webhook": {
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/inboxes/email": {
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/inboxes/list": {
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
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    } | null | undefined;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/admin/clean": {
        $post: {
            input: {
                json: {
                    type: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/lists": {
        $get: {
            input: {
                query: {
                    listId: string | string[];
                };
            };
            output: {
                code: 0;
                data: {
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
                                emailVerified: string | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: string | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                            }[] | null | undefined;
                        }[] | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                    };
                    subscriptionCount: number;
                    readCount: number;
                    feedCount: number;
                    subscription?: {
                        title: string | null;
                        userId: string;
                        view: number;
                        isPrivate: boolean;
                        listId: string;
                        lastViewedAt: string | null;
                    } | undefined;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    }[] | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    } | null | undefined;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    listId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/lists/list": {
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    }[] | undefined;
                    ownerUserId?: string | null | undefined;
                    owner?: {
                        name: string | null;
                        id: string;
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    } | null | undefined;
                    subscriptionCount?: number | undefined;
                    purchaseAmount?: number | undefined;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/lists/feeds": {
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
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    } | null | undefined;
                    tipUsers?: {
                        name: string | null;
                        id: string;
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    }[] | null | undefined;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/wallets/transactions/tip": {
        $post: {
            input: {
                json: {
                    entryId: string;
                    amount: string;
                };
            };
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets/transactions": {
        $get: {
            input: {
                query: {
                    type?: string | string[] | undefined;
                    fromUserId?: string | string[] | undefined;
                    toUserId?: string | string[] | undefined;
                    hash?: string | string[] | undefined;
                    fromOrToUserId?: string | string[] | undefined;
                    toFeedId?: string | string[] | undefined;
                    createdAfter?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    type: "tip" | "mint" | "burn" | "withdraw" | "purchase";
                    createdAt: string;
                    fromUserId: string | null;
                    toUserId: string | null;
                    hash: string;
                    toFeedId: string | null;
                    toListId: string | null;
                    toEntryId: string | null;
                    powerToken: string;
                    comment: string | null;
                    fromUser?: {
                        name: string | null;
                        id: string;
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
                    } | null | undefined;
                    toUser?: {
                        name: string | null;
                        id: string;
                        emailVerified: string | null;
                        image: string | null;
                        handle: string | null;
                        createdAt: string;
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    } | null | undefined;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets/transactions/claim_daily": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets/transactions/claim_daily_ttl": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    ttl: number;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets/transactions/withdraw": {
        $post: {
            input: {
                json: {
                    address: string;
                    amount: string;
                };
            };
            output: {
                code: 0;
                data: {
                    transactionHash: string;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets/transactions/claim-check": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: boolean;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    createdAt: string;
                    userId: string;
                    addressIndex: number;
                    address: string | null;
                    dailyPowerToken: string;
                    cashablePowerToken: string;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $post: {
            input: {};
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/wallets/refresh": {
        $post: {
            input: {};
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/subscriptions": {
        $get: {
            input: {
                query: {
                    userId?: string | string[] | undefined;
                    view?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: ({
                    title: string | null;
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    };
                    feedId: string;
                    isPrivate: boolean;
                } | {
                    title: string | null;
                    userId: string;
                    view: number;
                    feedId: string;
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
                                emailVerified: string | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: string | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                            }[] | null | undefined;
                        }[] | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                    };
                    isPrivate: boolean;
                    listId: string;
                    lastViewedAt: string | null;
                    category?: string | undefined;
                } | {
                    title: string | null;
                    userId: string;
                    view: number;
                    category: string | null;
                    feedId: string;
                    inboxId: string;
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                    };
                })[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    view: number;
                    title?: string | null | undefined;
                    category?: string | null | undefined;
                    url?: string | undefined;
                    isPrivate?: boolean | undefined;
                    listId?: string | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $delete: {
            input: {
                json: {
                    url?: string | undefined;
                    feedId?: string | undefined;
                    listId?: string | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/subscriptions/export": {
        $get: {
            input: {};
            output: {};
            outputFormat: string;
            status: 200;
        };
    };
    "/subscriptions/import": {
        $post: {
            input: {};
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/settings": {
        $get: {
            input: {
                query: {
                    tab?: string | string[] | undefined;
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/settings/:tab": {
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/reads": {
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
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    view?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    [x: string]: number;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/reads/all": {
        $post: {
            input: {
                json: {
                    view?: number | undefined;
                    feedIdList?: string[] | undefined;
                    feedId?: string | undefined;
                    inboxId?: string | undefined;
                    listId?: string | undefined;
                    startTime?: number | undefined;
                    endTime?: number | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/reads/total-count": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: {
                    count: number;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/profiles": {
        $get: {
            input: {
                query: {
                    id?: string | string[] | undefined;
                    handle?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    name: string | null;
                    id: string;
                    emailVerified: string | null;
                    image: string | null;
                    handle: string | null;
                    createdAt: string;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/metrics": {
        $get: {
            input: {
                query: {
                    type?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    data: number[];
                    meta: {
                        count: number;
                        prevTS: number;
                        prevCount: number;
                    };
                    count: number;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/invitations/new": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/invitations/use": {
        $post: {
            input: {
                json: {
                    code: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/invitations": {
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
                    toUserId: string | null;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/invitations/limitation": {
        $get: {
            input: {};
            output: {
                code: 0;
                data: number;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/feeds/claim/message": {
        $get: {
            input: {
                query: {
                    feedId: string | string[];
                };
            };
            output: {
                code: 0;
                data: {
                    json: string;
                    description: string;
                    xml: string;
                    content: string;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/feeds/claim/challenge": {
        $post: {
            input: {
                json: {
                    feedId: string;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/feeds/claim/list": {
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    };
                    subscriptionCount: number;
                    tipAmount: number;
                    entryCount: number;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/feeds": {
        $get: {
            input: {
                query: {
                    id?: string | string[] | undefined;
                    url?: string | string[] | undefined;
                };
            };
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    };
                    subscriptionCount: number;
                    readCount: number;
                    subscription?: {
                        title: string | null;
                        userId: string;
                        view: number;
                        category: string | null;
                        feedId: string;
                        isPrivate: boolean;
                    } | undefined;
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/feeds/refresh": {
        $get: {
            input: {
                query: {
                    id: string | string[];
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/entries/inbox": {
        $post: {
            input: {
                json: {
                    inboxId: string;
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
                    settings?: {
                        summary?: boolean | undefined;
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        readability?: boolean | undefined;
                        silence?: boolean | undefined;
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
            outputFormat: "json" | "text";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    id: string | string[];
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                    };
                } | undefined;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/entries/read-histories/:id": {
        $get: {
            input: {
                param: {
                    id?: string | undefined;
                };
            } & {
                query: {
                    page?: string | string[] | undefined;
                    size?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    total: number;
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
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/entries/check-new": {
        $get: {
            input: {
                query: {
                    insertedAfter: string | string[];
                    view?: string | string[] | undefined;
                    feedIdList?: string | string[] | undefined;
                    feedId?: string | string[] | undefined;
                    read?: string | string[] | undefined;
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/entries": {
        $post: {
            input: {
                json: {
                    view?: number | undefined;
                    feedIdList?: string[] | undefined;
                    feedId?: string | undefined;
                    read?: boolean | undefined;
                    limit?: number | undefined;
                    publishedAfter?: string | undefined;
                    publishedBefore?: string | undefined;
                    listId?: string | undefined;
                    collected?: boolean | undefined;
                    isCollection?: boolean | undefined;
                    isArchived?: boolean | undefined;
                    withContent?: boolean | undefined;
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
                    settings?: {
                        summary?: boolean | undefined;
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        readability?: boolean | undefined;
                        silence?: boolean | undefined;
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
            outputFormat: "json" | "text";
            status: 200;
        };
        $get: {
            input: {
                query: {
                    id: string | string[];
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        }[] | null | undefined;
                    };
                } | undefined;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/entries/preview": {
        $get: {
            input: {
                query: {
                    id: string | string[];
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/discover": {
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
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                        tipUsers?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
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
                                emailVerified: string | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                            } | null | undefined;
                            tipUsers?: {
                                name: string | null;
                                id: string;
                                emailVerified: string | null;
                                image: string | null;
                                handle: string | null;
                                createdAt: string;
                            }[] | null | undefined;
                        }[] | undefined;
                        ownerUserId?: string | null | undefined;
                        owner?: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null | undefined;
                    } | undefined;
                    docs?: string | undefined;
                    isSubscribed?: boolean | undefined;
                    subscriptionCount?: number | undefined;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/discover/rsshub": {
        $get: {
            input: {
                query: {
                    category?: string | string[] | undefined;
                    namespace?: string | string[] | undefined;
                };
            };
            output: {
                data: {
                    [x: string]: {
                        description: string;
                        name: string;
                        url: string;
                        routes: {
                            [x: string]: {
                                description: string;
                                parameters: {
                                    [x: string]: string;
                                };
                                path: string;
                                example: string;
                                name: string;
                                categories: string[];
                                maintainers: string[];
                                location: string;
                                view?: number | undefined;
                            };
                        };
                    };
                };
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/collections": {
        $get: {
            input: {
                query: {
                    entryId: string | string[];
                };
            };
            output: {
                code: 0;
                data: boolean;
            };
            outputFormat: "json" | "text";
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
            outputFormat: "json" | "text";
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/categories": {
        $get: {
            input: {
                query: {
                    view?: string | string[] | undefined;
                };
            };
            output: {
                data?: string[] | undefined;
            };
            outputFormat: "json" | "text";
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
            outputFormat: "json" | "text";
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/auth-app/new-session": {
        $post: {
            input: {};
            output: {
                code: 0;
                data: {
                    userId: string;
                    sessionToken: string;
                    expires: string;
                };
            };
            outputFormat: "json" | "text";
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/ai/translation": {
        $get: {
            input: {
                query: {
                    id: string | string[];
                    language: string | string[];
                    fields: string | string[];
                    part?: string | string[] | undefined;
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/ai/summary": {
        $get: {
            input: {
                query: {
                    id: string | string[];
                    language?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data?: string | undefined;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/ai/daily": {
        $get: {
            input: {
                query: {
                    view: string | string[];
                    startDate: string | string[];
                };
            };
            output: {
                code: 0;
                data: string;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/actions": {
        $get: {
            input: {};
            output: {
                code: 0;
                data?: {
                    userId: string;
                    rules?: {
                        name: string;
                        result: {
                            summary?: boolean | undefined;
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            readability?: boolean | undefined;
                            silence?: boolean | undefined;
                            newEntryNotification?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "all" | "content" | "author" | "url" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                            webhooks?: string[] | undefined;
                        };
                        condition: {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[];
                    }[] | null | undefined;
                } | undefined;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $put: {
            input: {
                json: {
                    rules?: {
                        name: string;
                        result: {
                            summary?: boolean | undefined;
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            readability?: boolean | undefined;
                            silence?: boolean | undefined;
                            newEntryNotification?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "all" | "content" | "author" | "url" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                            webhooks?: string[] | undefined;
                        };
                        condition: {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[];
                    }[] | null | undefined;
                };
            };
            output: {
                code: 0;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
    };
} & {
    "/achievement": {
        $get: {
            input: {
                query: {
                    type?: string | string[] | undefined;
                };
            };
            output: {
                code: number;
                data: {
                    type: "received" | "checking" | "completed" | "incomplete";
                    id: string;
                    userId: string;
                    actionId: number;
                    progress: number;
                    progressMax: number;
                    done: boolean;
                    doneAt: string | null;
                    power: string;
                }[];
                done: number;
                total: number;
            };
            outputFormat: "json" | "text";
            status: 200;
        };
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
    "/achievement/check": {
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
            outputFormat: "json" | "text";
            status: 200;
        };
    };
}, "/">;
type AppType = typeof _routes;

export { type ActionsModel, type AppType, type AttachmentsModel, CommonEntryFields, type EntriesModel, type EntryReadHistoriesModel, type ExtraModel, type FeedModel, type MediaModel, type MessagingData, MessagingType, type SettingsModel, accounts, achievements, achievementsOpenAPISchema, actions, actionsItemOpenAPISchema, actionsOpenAPISchema, actionsRelations, attachmentsZodSchema, collections, collectionsOpenAPISchema, collectionsRelations, entries, entriesOpenAPISchema, entriesRelations, entryReadHistories, entryReadHistoriesOpenAPISchema, entryReadHistoriesRelations, extraZodSchema, feedPowerTokens, feedPowerTokensOpenAPISchema, feedPowerTokensRelations, feeds, feedsOpenAPISchema, feedsRelations, inboxHandleSchema, inboxes, inboxesEntries, inboxesEntriesInsertOpenAPISchema, type inboxesEntriesModel, inboxesEntriesOpenAPISchema, inboxesEntriesRelations, inboxesOpenAPISchema, inboxesRelations, invitations, invitationsOpenAPISchema, invitationsRelations, languageSchema, lists, listsOpenAPISchema, listsRelations, listsSubscriptions, listsSubscriptionsOpenAPISchema, listsSubscriptionsRelations, listsTimeline, listsTimelineOpenAPISchema, listsTimelineRelations, mediaZodSchema, messaging, messagingOpenAPISchema, messagingRelations, sessions, settings, subscriptions, subscriptionsOpenAPISchema, subscriptionsRelations, timeline, timelineOpenAPISchema, timelineRelations, transactionType, transactions, transactionsOpenAPISchema, transactionsRelations, users, usersOpenApiSchema, usersRelations, verificationTokens, wallets, walletsOpenAPISchema, walletsRelations };
