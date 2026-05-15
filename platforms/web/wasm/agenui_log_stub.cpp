#include "agenui_logger.h"
#include <cstdarg>
#include <cstdio>
#include <string>

namespace agenui {

static class WebLogImpl : public ILogger {
public:
    void log(LogLevel level, const char* tag, const char* func, int line, const char* format, ...) override {
        (void)level;
        va_list args;
        va_start(args, format);
        char buffer[4096];
        vsnprintf(buffer, sizeof(buffer), format, args);
        va_end(args);
        printf("[AGenUI][%s@%d] %s\n", func ? func : "", line, buffer);
    }
} gWebLogger;

ILogger* gLogger = &gWebLogger;

} // namespace agenui
