import {
  transformerMetaHighlight,
  transformerNotationDiff,
  transformerNotationHighlight,
} from "@shikijs/transformers"
import type { ShikiTransformer } from "shiki"

export const shikiTransformers: ShikiTransformer[] = [
  transformerMetaHighlight(),
  transformerNotationDiff(),
  transformerNotationHighlight(),
]
