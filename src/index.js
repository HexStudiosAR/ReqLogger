/**
 * Estilos de registro válidos para el middleware de registro.
 * Los estilos disponibles son: "minified", "inline", "agent" y "default".
 */
const validLogStyles = ["minified", "inline", "agent", "error", "default"];

/**
 *
 * Estilo de registro predeterminado.
 * Si no se proporciona un estilo válido, se utilizará este estilo por defecto.
 */
const defaultLogStyle = "default";

/**
 * Middleware para el registro de solicitudes en un servidor.
 *
 * @param {string} options - Opción para el estilo de registro.
 * @returns {Function} - Función de middleware.
 */
function loggerMiddleware(options) {
  const logStyle = validLogStyles.includes(options) ? options : defaultLogStyle;

  /**
   * Códigos de escape ANSI para los colores utilizados en el registro.
   *
   * @type {Object}
   */
  const colorCodes = {
    reset: "\x1b[0m",
    bright: "\x1b[1m",
    dim: "\x1b[2m",
    underscore: "\x1b[4m",
    yellow: "\x1b[33m",
    green: "\x1b[32m",
    blue: "\x1b[34m",
    red: "\x1b[31m",
    cyan: "\x1b[36m",
  };

  const { reset, yellow, green, blue, cyan, red } = colorCodes;

  /**
   * Imprime un mensaje de registro en la consola con el color de reinicio.
   *
   * @param {string} message - Mensaje a imprimir.
   */
  const logMessage = (message) => console.log(`${reset}${message}${reset}`);

  /**
   * Inicia un grupo de registro en la consola.
   *
   * @param {string} groupName - Nombre del grupo.
   */
  const logGroupStart = (groupName) => console.groupCollapsed(`${groupName}`);

  /**
   * Finaliza un grupo de registro en la consola.
   */
  const logGroupEnd = () => console.groupEnd();

  if (!validLogStyles.includes(logStyle)) {
    logMessage(
      `${yellow}** Invalid style option: ${options} **\n` +
        `** Logger middleware will use the default log style. **${reset}`
    );
  }

  /**
   * Función de middleware que se ejecuta cuando se realiza una solicitud al servidor.
   *
   * @param {Object} req - Objeto de solicitud.
   * @param {Object} res - Objeto de respuesta.
   * @param {Function} next - Función para pasar la solicitud al siguiente middleware.
   */
  return function (req, res, next) {
    const start = process.hrtime();
    const { method, originalUrl, ip, headers } = req;

    res.on("finish", () => {
      const end = process.hrtime(start);
      const milliseconds = Math.round((end[0] * 1000 + end[1]) / 1e6);

      const timestamp = new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
      });

      const status = res.statusCode;
      const contentLength = res.getHeader("content-length") || 0;
      const userAgent = headers["user-agent"];
      const referer = headers.referer || "Unknown";

      const logPrefix = `${green}[${timestamp}] ${reset}|`;

      switch (logStyle) {
        case "minified":
          logMessage(
            `${method} ${green}${originalUrl} ${cyan}${status} ${reset}${milliseconds}ms`
          );
          break;
        case "agent":
          logGroupStart(`${logPrefix} ${cyan}AGENT LOG`);
          logMessage(`${yellow}IP:${reset} ${ip}`);
          logMessage(`${yellow}User Agent:${reset} ${userAgent}`);
          logMessage(`${yellow}Referer:${reset} ${referer}`);
          logGroupEnd();
          break;
        case "inline":
          logMessage(
            `${green}[${timestamp}]${reset} ${method} ${green}${originalUrl} ${cyan}${status} ${reset}${milliseconds}ms ${yellow}${contentLength}${reset}`
          );
          break;
        case "error":
          if(status >= 400) {
            logMessage(
              `${red}[${timestamp}]${reset} ${method} ${green}${originalUrl} ${red}${status} ${reset}${milliseconds}ms ${yellow}${contentLength}${reset}`
            );
          }
          break;
        default:
          logGroupStart(`${logPrefix} ${blue}REQUEST LOG`);
          logMessage(`${yellow}Timestamp:${reset} ${timestamp}`);
          logMessage(`${yellow}Method:${reset} ${method}`);
          logMessage(`${yellow}URL:${reset} ${originalUrl}`);
          logMessage(`${yellow}Status:${reset} ${status}`);
          logMessage(`${yellow}Time:${reset} ${milliseconds}ms`);
          logMessage(`${yellow}IP:${reset} ${ip}`);
          logMessage(`${yellow}Size:${reset} ${contentLength}`);
          logMessage(`${yellow}User Agent:${reset} ${userAgent}`);
          logMessage(`${yellow}Referer:${reset} ${referer}`);
          logGroupEnd();
      }
    });

    next();
  };
}

module.exports = loggerMiddleware;
