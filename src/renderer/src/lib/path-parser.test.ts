import { compile, pathToRegexp } from "path-to-regexp"
import { describe, expect, test } from "vitest"

import { MissingOptionalParamError, MissingRequiredParamError, parseFullPathParams, parseRegexpPathParams, regexpPathToPath, transformUriPath } from "./path-parser"

describe("test `transformUriPath()`", () => {
  test("normal path", () => {
    expect(transformUriPath("/issues/all")).toMatchInlineSnapshot(
      `"/issues/all"`,
    )
  })

  test("has tailing optional params", () => {
    const path = transformUriPath("/issues/:id?")
    expect(path).toMatchInlineSnapshot(`"/issues{/:id}?"`)
    expect(compile(path)({})).toMatchInlineSnapshot(`"/issues"`)
    const regexp = pathToRegexp(path)
    expect(regexp.keys).toMatchInlineSnapshot(`
      [
        {
          "modifier": "?",
          "name": "id",
          "pattern": undefined,
          "prefix": "/",
          "separator": "/",
          "suffix": "",
        },
      ]
    `)
  })

  test("has tailing optional params and with value", () => {
    const path = transformUriPath("/issues/:id?")

    expect(
      compile(path)({
        id: "1111111",
      }),
    ).toMatchInlineSnapshot(`"/issues/1111111"`)
    const regexp = pathToRegexp(path)
    expect(regexp.keys).toMatchInlineSnapshot(`
      [
        {
          "modifier": "?",
          "name": "id",
          "pattern": undefined,
          "prefix": "/",
          "separator": "/",
          "suffix": "",
        },
      ]
    `)
  })

  test("has many optional params", () => {
    const path = transformUriPath("/issue/:user/:repo/:state?/:labels?")
    expect(path).toMatchInlineSnapshot(
      `"/issue{/:user}{/:repo}{/:state}?{/:labels}?"`,
    )
    expect(
      compile(path)({
        user: "user",
        repo: "repo",
      }),
    ).toMatchInlineSnapshot(`"/issue/user/repo"`)
    expect(pathToRegexp(path).keys).toMatchInlineSnapshot(`
      [
        {
          "modifier": "",
          "name": "user",
          "pattern": undefined,
          "prefix": "/",
          "separator": "/",
          "suffix": "",
        },
        {
          "modifier": "",
          "name": "repo",
          "pattern": undefined,
          "prefix": "/",
          "separator": "/",
          "suffix": "",
        },
        {
          "modifier": "?",
          "name": "state",
          "pattern": undefined,
          "prefix": "/",
          "separator": "/",
          "suffix": "",
        },
        {
          "modifier": "?",
          "name": "labels",
          "pattern": undefined,
          "prefix": "/",
          "separator": "/",
          "suffix": "",
        },
      ]
    `)
  })

  test("catch all path", () => {
    const path = transformUriPath("/:path{.+}?")
    expect(path).toMatchInlineSnapshot(`"{/:path}*"`)
    expect(
      compile(path)({
        path: ["a", "b", "c"],
      }),
    ).toMatchInlineSnapshot(`"/a/b/c"`)
  })

  test("catch all path with leading route", () => {
    const path = transformUriPath("/issues/:path{.+}?")
    expect(path).toMatchInlineSnapshot(`"/issues{/:path}*"`)
    expect(
      compile(path)({
        path: ["a", "b", "c"],
      }),
    ).toMatchInlineSnapshot(`"/issues/a/b/c"`)
  })

  test("catch all path but value is query search string", () => {
    const path = transformUriPath("/issues/:path{.+}?")
    expect(path).toMatchInlineSnapshot(`"/issues{/:path}*"`)
    expect(
      compile(path)({
        path: ["a=1&b=2"],
      }),
    ).toMatchInlineSnapshot(`"/issues/a%3D1%26b%3D2"`)
  })

  test("catch all route via `*`", () => {
    expect(transformUriPath("/issues/*")).toMatchInlineSnapshot(`"/issues{/:__catchAll__}"`)
    expect(transformUriPath("*")).toMatchInlineSnapshot(`"{/:__catchAll__}"`)
  })
})

describe("test `regexpPathToPath()`", () => {
  test("normal path", () => {
    expect(regexpPathToPath("/issues/all", {})).toMatchInlineSnapshot(
      `"/issues/all"`,
    )
  })
  test("path with optional params", () => {
    expect(regexpPathToPath("/issues/:id?", {})).toMatchInlineSnapshot(
      `"/issues"`,
    )
    expect(regexpPathToPath("/issues/:id?", { id: "1" })).toMatchInlineSnapshot(
      `"/issues/1"`,
    )
  })

  test("path with many optional params", () => {
    expect(
      regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
        user: "rssnext",
        repo: "follow",
      }),
    ).toMatchInlineSnapshot(`"/issue/rssnext/follow"`)
  })

  test("path with many optional params, but when using the optional parameter(s) after the optional parameter(s), the previous optional parameter(s) is/are not filled in.", () => {
    expect(
      () => regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
        user: "rssnext",
        repo: "follow",
        labels: "rss",
      }),
    ).toThrowError(MissingOptionalParamError)
  })
  test("path with many optional params, but when using the optional parameter(s) after the optional parameter(s), the previous optional parameter(s) is/are not filled in.", () => {
    expect(
      () => regexpPathToPath("/ranking/:rid?/:day?/:arc_type?/:disableEmbed?", {
        day: "1",
      }),
    ).toThrowError(MissingOptionalParamError)
  })

  test("missing required param", () => {
    expect(() => regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {})).toThrow(MissingRequiredParamError)
  })

  test("catch all path", () => {
    expect(regexpPathToPath("*", {
      catchAll: "a/b/c",
    })).toMatchInlineSnapshot(`"/a%2Fb%2Fc"`)
  })

  test("path with many optional params and all inputted", () => {
    expect(regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
      user: "rssnext",
      repo: "follow",
      state: "open",
      labels: "rss",
    })).toMatchInlineSnapshot(`"/issue/rssnext/follow/open/rss"`)
  })

  test("omit empty string and nil value", () => {
    expect(regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
      user: "rssnext",
      repo: "follow",
      state: "open",
      labels: "",
    }, {
      omitNilAndEmptyString: true,
    })).toMatchInlineSnapshot(`"/issue/rssnext/follow/open"`)
  })

  test("omit empty string and nil value will throw", () => {
    expect(() => regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
      user: "rssnext",
      repo: "follow",
      state: "",
      labels: "l",
    }, {
      omitNilAndEmptyString: true,
    })).toThrow(MissingOptionalParamError)
  })

  test("omit empty string and nil value will throw (default behavior)", () => {
    expect(() => regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
      user: "rssnext",
      repo: "follow",
      state: "",
      labels: "l",
    })).toThrow(MissingOptionalParamError)
  })

  test("empty string will pass", () => {
    expect(regexpPathToPath("/issue/:user/:repo/:state?/:labels?", {
      user: "rssnext",
      repo: "follow",
      state: "",
      labels: "l",
    }, { omitNilAndEmptyString: false })).toMatchInlineSnapshot(`"/issue/rssnext/follow//l"`)
  })
})

describe("test `parseRegexpPathParams()`", () => {
  test("normal path", () => {
    expect(parseRegexpPathParams("/issues/all")).toMatchInlineSnapshot(`
      {
        "array": [],
        "length": 0,
        "map": {},
      }
    `)
  })

  test("path with optional params", () => {
    expect(parseRegexpPathParams("/issues/:id?")).toMatchInlineSnapshot(`
      {
        "array": [
          {
            "isCatchAll": false,
            "name": "id",
            "optional": true,
          },
        ],
        "length": 1,
        "map": {
          "id": {
            "isCatchAll": false,
            "name": "id",
            "optional": true,
          },
        },
      }
    `)
  })

  test("path with many optional params", () => {
    expect(parseRegexpPathParams("/issue/:user/:repo/:state?/:labels?")).toMatchInlineSnapshot(`
      {
        "array": [
          {
            "isCatchAll": false,
            "name": "user",
            "optional": false,
          },
          {
            "isCatchAll": false,
            "name": "repo",
            "optional": false,
          },
          {
            "isCatchAll": false,
            "name": "state",
            "optional": true,
          },
          {
            "isCatchAll": false,
            "name": "labels",
            "optional": true,
          },
        ],
        "length": 4,
        "map": {
          "labels": {
            "isCatchAll": false,
            "name": "labels",
            "optional": true,
          },
          "repo": {
            "isCatchAll": false,
            "name": "repo",
            "optional": false,
          },
          "state": {
            "isCatchAll": false,
            "name": "state",
            "optional": true,
          },
          "user": {
            "isCatchAll": false,
            "name": "user",
            "optional": false,
          },
        },
      }
    `)
  })

  test("catch all path", () => {
    expect(parseRegexpPathParams("/:path{.+}?")).toMatchInlineSnapshot(`
      {
        "array": [
          {
            "isCatchAll": true,
            "name": "path",
            "optional": true,
          },
        ],
        "length": 1,
        "map": {
          "path": {
            "isCatchAll": true,
            "name": "path",
            "optional": true,
          },
        },
      }
    `)
  })

  test("catch all path via `*`", () => {
    expect(parseRegexpPathParams("*")).toMatchInlineSnapshot(`
      {
        "array": [
          {
            "isCatchAll": true,
            "name": "__catchAll__",
            "optional": false,
          },
        ],
        "length": 1,
        "map": {
          "__catchAll__": {
            "isCatchAll": true,
            "name": "__catchAll__",
            "optional": false,
          },
        },
      }
    `)
  })

  test("with excludeNames", () => {
    expect(parseRegexpPathParams("/issue/:user/:repo/:state?/:labels?/:routeParams?", {
      excludeNames: ["state", "routeParams"],
    })).toMatchInlineSnapshot(`
      {
        "array": [
          {
            "isCatchAll": false,
            "name": "user",
            "optional": false,
          },
          {
            "isCatchAll": false,
            "name": "repo",
            "optional": false,
          },
          {
            "isCatchAll": false,
            "name": "labels",
            "optional": true,
          },
        ],
        "length": 3,
        "map": {
          "labels": {
            "isCatchAll": false,
            "name": "labels",
            "optional": true,
          },
          "repo": {
            "isCatchAll": false,
            "name": "repo",
            "optional": false,
          },
          "user": {
            "isCatchAll": false,
            "name": "user",
            "optional": false,
          },
        },
      }
    `)
  })
})

describe("test `parseFullPathParams()`", () => {
  test("case 1", () => {
    expect(parseFullPathParams("/user/123344", "/user/:id")).toMatchInlineSnapshot(`
      {
        "id": "123344",
      }
    `)
  })
  test("case 2", () => {
    expect(parseFullPathParams("/build/wangqiru/ttrss", "/build/:user/:name")).toMatchInlineSnapshot(`
      {
        "name": "ttrss",
        "user": "wangqiru",
      }
    `)
  })
})
