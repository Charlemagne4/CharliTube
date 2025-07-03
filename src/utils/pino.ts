import pino from 'pino';

export const logger = pino({
  formatters: {
    bindings() {
      return { pid: undefined, hostname: undefined };
    },
  },
  // transport:
  //   process.env.NODE_ENV === 'development'
  //     ? {
  //         target: 'pino-pretty',
  //         options: { colorize: true },
  //       }
  //     : undefined,
  level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
});
