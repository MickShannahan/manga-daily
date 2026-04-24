const dev = window.origin.includes('localhost')

function log(type, content) {
  if (dev) {
     
    console[type](`[${type}] ${new Date().toLocaleTimeString()}\n`, ...content)
  } else {
    switch (type) {
      case 'log':
      case 'assert':
        return
    }
    // TODO SEND LOGS TO EXTERNAL SERVICE
     
    console[type](`[${type}] ${new Date().toLocaleTimeString()}\n`, ...content)
  }
}

export const logger = {
  log(...args) {
    log('log', args)
  },
  error(...args) {
    log('error', args)
  },
  warn(...args) {
    log('warn', args)
  },
  assert(...args) {
    log('assert', args)
  },
  trace(...args) {
    log('trace', args)
  },
  groupCollapsed(...args) {
    log('groupCollapsed', args)
  },
  groupEnd(...args) {
    log('groupEnd', args)
  },
}