const PACKAGE_NAME = '[Y-Form]'

const Log = {
  help: (...args) => {
    if (process && process.env && process.env.NODE_ENV === 'development') {
      console.log(`${PACKAGE_NAME} debug:`, ...args)
    }
  },
  success: (...args) => console.log(`${PACKAGE_NAME}:`, ...args),
  warn: (...args) => console.warn(`${PACKAGE_NAME}:`, ...args),
  error: (...args) => console.error(`${PACKAGE_NAME}:`, ...args),
  table: (...args) => {
    console.log(`${PACKAGE_NAME}:`)
    console.table(...args)
  },
}

export default Log