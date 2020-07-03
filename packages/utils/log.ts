const PACKAGE_NAME = '[Y-Form]'

let isDebug = false

const Log = {
  getIsDebug: () => isDebug,
  help: (...args) => {
    if (isDebug) {
      console.log(`${PACKAGE_NAME} debug:`, ...args)
    }
  },
  success: (...args) => isDebug && console.log(`${PACKAGE_NAME}:`, ...args),
  warn: (...args) => isDebug && console.warn(`${PACKAGE_NAME}:`, ...args),
  error: (...args) => isDebug && console.error(`${PACKAGE_NAME}:`, ...args),
  table: (...args) => {
    if (!isDebug) return
    console.log(`${PACKAGE_NAME}:`)
    console.table(...args)
  },
}

export const useYFormLog = (b: boolean): void => {
  isDebug = b
}

export default Log