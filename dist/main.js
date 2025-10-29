"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("./app.module");
const common_1 = require("@nestjs/common");
const http_exception_filter_1 = require("./exceptions/http-exception.filter");
const logger_middleware_1 = require("./middleware/logger/logger.middleware");
const winston_logger_1 = require("./logger/winston.logger");
const cookieParser = require("cookie-parser");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule, {
        logger: winston_logger_1.winstonLogger,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true }));
    app.use(new logger_middleware_1.LoggerMiddleware().use);
    app.useGlobalFilters(new http_exception_filter_1.HttpExceptionFilter());
    app.use(cookieParser());
    app.enableCors({
        origin: 'http://localhost:8080',
        credentials: true,
    });
    app.useGlobalPipes(new common_1.ValidationPipe({
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: false,
        exceptionFactory: (validationErrors = []) => {
            const errors = validationErrors.map((error) => {
                const constraints = error.constraints
                    ? Object.values(error.constraints)
                    : ['Invalid input'];
                return {
                    field: error.property,
                    errors: constraints,
                };
            });
            return new common_1.BadRequestException({
                message: 'Validation failed',
                errors,
            });
        },
    }));
    await app.listen(process.env.PORT ?? 3000);
}
void bootstrap();
//# sourceMappingURL=main.js.map