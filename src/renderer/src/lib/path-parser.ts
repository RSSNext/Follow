import type { CompileOptions } from "path-to-regexp"
import { compile, pathToRegexp } from "path-to-regexp"

const CATCH_ALL_GROUP_KEY = "__catchAll__"
export function transformUriPath(uri: string): string {
  let result = ""
  const parts = uri.split("/")

  for (const part of parts) {
    if (!part) continue
    if (part.startsWith(":")) {
      if (part.includes("{") && part.includes("}")) {
        result += `{/:${part.slice(1, part.indexOf("{"))}}*`
      } else if (part.endsWith("?")) {
        result += `{/:${part.slice(1, -1)}}?`
      } else {
        result += `{/:${part.slice(1)}}`
      }
    } else if (part === "*") {
      result += `{/:${CATCH_ALL_GROUP_KEY}}`
    } else {
      result += `/${part}`
    }
  }
  return result
}

export class MissingOptionalParamError extends Error {
  constructor(public param: string) {
    super(`You used the optional parameter ${param}, but there are other optional parameters before the optional parameter ${param} that you did not fill in.`)
  }
}

export class MissingRequiredParamError extends Error {
  constructor(param: string) {
    super(`Missing required param ${param}`)
  }
}
export const regexpPathToPath = (
  regexpPath: string,
  params: {
    catchAll?: string
    [key: string]: string | string[] | undefined
  },
  options?: Omit<CompileOptions, "validate">,
): string => {
  const transformedPath = transformUriPath(regexpPath)

  const paramsKeys = pathToRegexp(transformedPath).keys
  const inputtedKeys = new Set(Object.keys(params))
  let prevKeyIsOptional = false
  let prevKeyIsInputted = false
  for (const key of paramsKeys) {
    if (key.name === CATCH_ALL_GROUP_KEY) {
      params[CATCH_ALL_GROUP_KEY] = params.catchAll
      break
    }
    const isOptional = key.modifier === "?"
    const userInputted = inputtedKeys.has(key.name)
    if (!isOptional && !userInputted) {
      throw new MissingRequiredParamError(key.name)
    }

    if (prevKeyIsOptional && !isOptional) {
      throw new Error("Required param after optional param")
    }

    if (prevKeyIsOptional && !prevKeyIsInputted && userInputted) {
      throw new MissingOptionalParamError(key.name)
    }

    prevKeyIsOptional = isOptional
    prevKeyIsInputted = userInputted
  }
  return compile(transformedPath, {
    validate: false,

    ...options,
  })(params)
}

export type PathParams = {
  name: string
  optional: boolean
  isCatchAll: boolean

}
export const parseRegexpPathParams = (regexpPath: string) => {
  const transformedPath = transformUriPath(regexpPath)
  const array: PathParams[] = []

  for (const item of pathToRegexp(transformedPath).keys) {
    array.push({
      name: item.name,
      optional: item.modifier === "?" || item.modifier === "*",
      isCatchAll: item.name === CATCH_ALL_GROUP_KEY || item.modifier === "*",
    })
  }

  const map = array.reduce((acc, { name, optional, isCatchAll }) => {
    acc[name] = { name, optional, isCatchAll }
    return acc
  }, {}) as Record<string, PathParams>
  return {
    array,
    map,
    length: array.length,
  }
}
export const parseFullPathParams = (path: string, regexpPath: string) => {
  // path: /user/123344
  // regexpPath: /user/:id
  // return {id: '123344'}
  const transformedPath = transformUriPath(regexpPath)
  const { keys } = pathToRegexp(transformedPath)
  const result = pathToRegexp(transformedPath).exec(path)
  if (!result) return {}
  return keys.reduce((acc, key, index) => {
    acc[key.name] = result[index + 1]
    return acc
  }, {} as Record<string, string>)
}
