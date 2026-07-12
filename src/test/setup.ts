import 'fake-indexeddb/auto'
import { webcrypto } from 'node:crypto'

if (!globalThis.crypto) {
  // @ts-expect-error polyfill do webcrypto em ambiente Node
  globalThis.crypto = webcrypto
}
