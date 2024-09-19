import * as hono_hono_base from 'hono/hono-base';
import { HttpBindings } from '@hono/node-server';
import * as drizzle_orm from 'drizzle-orm';
import { InferInsertModel } from 'drizzle-orm';
import * as drizzle_orm_pg_core from 'drizzle-orm/pg-core';
import * as zod from 'zod';
import { z } from 'zod';

type Env = {
    Bindings: HttpBindings;
};

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
                    rewriteRules?: {
                        from: string;
                        to: string;
                    }[];
                    blockRules?: {
                        field: z.infer<typeof ruleFieldSchema>;
                        operator: z.infer<typeof ruleOperatorSchema>;
                        value: string | number;
                    }[];
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
    }, "strip", z.ZodTypeAny, {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
    }, {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
    }>;
}, "strip", z.ZodTypeAny, {
    name: string;
    condition: {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[];
    result: {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
    };
}, {
    name: string;
    condition: {
        value: string;
        field: "title" | "view" | "site_url" | "feed_url" | "category";
        operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
    }[];
    result: {
        summary?: boolean | undefined;
        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
        readability?: boolean | undefined;
        rewriteRules?: {
            from: string;
            to: string;
        }[] | undefined;
        blockRules?: {
            value: string | number;
            field: "title" | "content" | "all" | "author" | "url" | "order";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[] | undefined;
    };
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
        }, "strip", z.ZodTypeAny, {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
        }, {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
        }>;
    }, "strip", z.ZodTypeAny, {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
        };
    }, {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
        };
    }>, "many">>>;
}>, "strip", z.ZodTypeAny, {
    userId: string;
    rules?: {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
        };
    }[] | null | undefined;
}, {
    userId: string;
    rules?: {
        name: string;
        condition: {
            value: string;
            field: "title" | "view" | "site_url" | "feed_url" | "category";
            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
        }[];
        result: {
            summary?: boolean | undefined;
            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
            readability?: boolean | undefined;
            rewriteRules?: {
                from: string;
                to: string;
            }[] | undefined;
            blockRules?: {
                value: string | number;
                field: "title" | "content" | "all" | "author" | "url" | "order";
                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
            }[] | undefined;
        };
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
            name: "feedId";
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
};
type AttachmentsModel = {
    url: string;
    duration_in_seconds?: number;
    mime_type?: string;
    size_in_bytes?: number;
    title?: string;
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
    };
    dialect: "pg";
}>;
declare const entriesOpenAPISchema: z.ZodObject<z.objectUtil.extendShape<Omit<{
    id: z.ZodString;
    feedId: z.ZodString;
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
}, "media" | "attachments">, {
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
    }, "strip", z.ZodTypeAny, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
    }, {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
    }>, "many">>>;
}>, "strip", z.ZodTypeAny, {
    description: string | null;
    title: string | null;
    content: string | null;
    id: string;
    author: string | null;
    url: string | null;
    feedId: string;
    guid: string;
    authorUrl: string | null;
    authorAvatar: string | null;
    insertedAt: string;
    publishedAt: string;
    categories: string[] | null;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
    }[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
}, {
    description: string | null;
    title: string | null;
    content: string | null;
    id: string;
    author: string | null;
    url: string | null;
    feedId: string;
    guid: string;
    authorUrl: string | null;
    authorAvatar: string | null;
    insertedAt: string;
    publishedAt: string;
    categories: string[] | null;
    media?: {
        type: "photo" | "video";
        url: string;
        width?: number | undefined;
        height?: number | undefined;
        preview_image_url?: string | undefined;
    }[] | null | undefined;
    attachments?: {
        url: string;
        title?: string | undefined;
        duration_in_seconds?: number | undefined;
        mime_type?: string | undefined;
        size_in_bytes?: number | undefined;
    }[] | null | undefined;
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
declare const feedsInputSchema: zod.ZodObject<{
    description: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    title: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    id: zod.ZodOptional<zod.ZodString>;
    image: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    url: zod.ZodString;
    siteUrl: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    checkedAt: zod.ZodString;
    lastModifiedHeader: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    etagHeader: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    ttl: zod.ZodOptional<zod.ZodNullable<zod.ZodNumber>>;
    errorMessage: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    errorAt: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
    ownerUserId: zod.ZodOptional<zod.ZodNullable<zod.ZodString>>;
}, zod.UnknownKeysParam, zod.ZodTypeAny, {
    url: string;
    checkedAt: string;
    description?: string | null | undefined;
    title?: string | null | undefined;
    id?: string | undefined;
    image?: string | null | undefined;
    siteUrl?: string | null | undefined;
    lastModifiedHeader?: string | null | undefined;
    etagHeader?: string | null | undefined;
    ttl?: number | null | undefined;
    errorMessage?: string | null | undefined;
    errorAt?: string | null | undefined;
    ownerUserId?: string | null | undefined;
}, {
    url: string;
    checkedAt: string;
    description?: string | null | undefined;
    title?: string | null | undefined;
    id?: string | undefined;
    image?: string | null | undefined;
    siteUrl?: string | null | undefined;
    lastModifiedHeader?: string | null | undefined;
    etagHeader?: string | null | undefined;
    ttl?: number | null | undefined;
    errorMessage?: string | null | undefined;
    errorAt?: string | null | undefined;
    ownerUserId?: string | null | undefined;
}>;
declare const feedsRelations: drizzle_orm.Relations<"feeds", {
    subscriptions: drizzle_orm.Many<"subscriptions">;
    entries: drizzle_orm.Many<"entries">;
    owner: drizzle_orm.One<"user", false>;
}>;
type FeedModel = InferInsertModel<typeof feeds>;

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
    collections: drizzle_orm.Many<"collections">;
    actions: drizzle_orm.One<"actions", true>;
    wallets: drizzle_orm.One<"wallets", true>;
    feeds: drizzle_orm.Many<"feeds">;
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
    address: string | null;
    addressIndex: number;
    dailyPowerToken: string;
    cashablePowerToken: string;
}, {
    createdAt: string;
    userId: string;
    address: string | null;
    addressIndex: number;
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
            input: {
                query: {
                    userId?: string | string[] | undefined;
                    address?: string | string[] | undefined;
                };
            };
            output: {
                code: 0;
                data: {
                    createdAt: string;
                    userId: string;
                    address: string | null;
                    addressIndex: number;
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
                data: {
                    title: string | null;
                    userId: string;
                    view: number;
                    category: string | null;
                    feedId: string;
                    feeds: {
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
                        owner: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null;
                    };
                    isPrivate: boolean;
                }[];
            };
            outputFormat: "json" | "text";
            status: 200;
        };
        $post: {
            input: {
                json: {
                    view: number;
                    url: string;
                    title?: string | null | undefined;
                    category?: string | null | undefined;
                    isPrivate?: boolean | undefined;
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
                    feedId: string;
                    title?: string | null | undefined;
                    category?: string | null | undefined;
                    isPrivate?: boolean | undefined;
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
                        url: string;
                        checkedAt: string;
                        description?: string | null | undefined;
                        title?: string | null | undefined;
                        id?: string | undefined;
                        image?: string | null | undefined;
                        siteUrl?: string | null | undefined;
                        lastModifiedHeader?: string | null | undefined;
                        etagHeader?: string | null | undefined;
                        ttl?: number | null | undefined;
                        errorMessage?: string | null | undefined;
                        errorAt?: string | null | undefined;
                        ownerUserId?: string | null | undefined;
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
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        categories: string[] | null;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                    };
                    feeds: {
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
                    };
                    read: boolean | null;
                    collections?: {
                        createdAt: string;
                    } | undefined;
                    settings?: {
                        summary?: boolean | undefined;
                        translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                        readability?: boolean | undefined;
                        rewriteRules?: {
                            from: string;
                            to: string;
                        }[] | undefined;
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
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        categories: string[] | null;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                    };
                    feeds: {
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
                        tipUsers: {
                            name: string | null;
                            id: string;
                            image: string | null;
                            handle: string | null;
                        }[];
                    };
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
                    authorUrl: string | null;
                    authorAvatar: string | null;
                    insertedAt: string;
                    publishedAt: string;
                    categories: string[] | null;
                    media?: {
                        type: "photo" | "video";
                        url: string;
                        width?: number | undefined;
                        height?: number | undefined;
                        preview_image_url?: string | undefined;
                    }[] | null | undefined;
                    attachments?: {
                        url: string;
                        title?: string | undefined;
                        duration_in_seconds?: number | undefined;
                        mime_type?: string | undefined;
                        size_in_bytes?: number | undefined;
                    }[] | null | undefined;
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
                        lastModifiedHeader: string | null;
                        etagHeader: string | null;
                        ttl: number | null;
                        errorMessage: string | null;
                        errorAt: string | null;
                        ownerUserId: string | null;
                        owner: {
                            name: string | null;
                            id: string;
                            emailVerified: string | null;
                            image: string | null;
                            handle: string | null;
                            createdAt: string;
                        } | null;
                    };
                    entries?: {
                        description: string | null;
                        title: string | null;
                        content: string | null;
                        id: string;
                        author: string | null;
                        url: string | null;
                        feedId: string;
                        guid: string;
                        authorUrl: string | null;
                        authorAvatar: string | null;
                        insertedAt: string;
                        publishedAt: string;
                        categories: string[] | null;
                        media?: {
                            type: "photo" | "video";
                            url: string;
                            width?: number | undefined;
                            height?: number | undefined;
                            preview_image_url?: string | undefined;
                        }[] | null | undefined;
                        attachments?: {
                            url: string;
                            title?: string | undefined;
                            duration_in_seconds?: number | undefined;
                            mime_type?: string | undefined;
                            size_in_bytes?: number | undefined;
                        }[] | null | undefined;
                    }[] | undefined;
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
                        condition: {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[];
                        result: {
                            summary?: boolean | undefined;
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            readability?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "content" | "all" | "author" | "url" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                        };
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
                        condition: {
                            value: string;
                            field: "title" | "view" | "site_url" | "feed_url" | "category";
                            operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                        }[];
                        result: {
                            summary?: boolean | undefined;
                            translation?: "en" | "ja" | "zh-CN" | "zh-TW" | undefined;
                            readability?: boolean | undefined;
                            rewriteRules?: {
                                from: string;
                                to: string;
                            }[] | undefined;
                            blockRules?: {
                                value: string | number;
                                field: "title" | "content" | "all" | "author" | "url" | "order";
                                operator: "contains" | "not_contains" | "eq" | "not_eq" | "gt" | "lt" | "regex";
                            }[] | undefined;
                        };
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
}, "/">;
type AppType = typeof _routes;

export { type ActionsModel, type AppType, type AttachmentsModel, type EntriesModel, type EntryReadHistoriesModel, type FeedModel, type MediaModel, type SettingsModel, accounts, actions, actionsItemOpenAPISchema, actionsOpenAPISchema, actionsRelations, collections, collectionsOpenAPISchema, collectionsRelations, entries, entriesOpenAPISchema, entriesRelations, entryReadHistories, entryReadHistoriesOpenAPISchema, entryReadHistoriesRelations, feedPowerTokens, feedPowerTokensOpenAPISchema, feedPowerTokensRelations, feeds, feedsInputSchema, feedsOpenAPISchema, feedsRelations, invitations, invitationsOpenAPISchema, invitationsRelations, languageSchema, sessions, settings, subscriptions, subscriptionsOpenAPISchema, subscriptionsRelations, timeline, timelineOpenAPISchema, timelineRelations, transactionType, transactions, transactionsOpenAPISchema, transactionsRelations, users, usersOpenApiSchema, usersRelations, verificationTokens, wallets, walletsOpenAPISchema, walletsRelations };
