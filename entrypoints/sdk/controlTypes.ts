// Stub: SDK control protocol types
import type { z } from 'zod/v4'
import * as S from './controlSchemas.js'

export type SDKControlRequest = z.infer<ReturnType<(typeof S)[keyof typeof S]>>
export type SDKControlResponse = Record<string, any>
