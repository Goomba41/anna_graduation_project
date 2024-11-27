import { isProxy, toRaw } from 'vue'

export default function toRawDeep<T>(observed: T): T {
  const val = isProxy(observed) ? toRaw(observed) : observed

  if (Array.isArray(val) && val.some((item) => isProxy(item))) {
    return val.map(toRawDeep) as T
  }

  if (val === null) return null as T

  if (typeof val === 'object' && Object.values(val).some((item) => isProxy(item))) {
    const entries = Object.entries(val).map(([key, val]) => [key, toRawDeep(val)])

    return Object.fromEntries(entries)
  }

  return val
}
