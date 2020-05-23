const PACKAGE_NAME = '[Y-For-Table]'

const Log = {
  help: (...args) => {
    if (process && process.env && process.env.NODE_ENV === 'development') {
      console.log(`${PACKAGE_NAME} debug:`, ...args)
    }
  },
  success: (...args) => console.log(`${PACKAGE_NAME}:`, ...args),
  warn: (...args) => console.warn(`${PACKAGE_NAME}:`, ...args),
  error: (...args) => console.error(`${PACKAGE_NAME}:`, ...args),
  table: (...args) => console.table(`${PACKAGE_NAME}:`, ...args),
}

export default Log