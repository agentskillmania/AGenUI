cmake_minimum_required(VERSION 3.14)
project(agenui-web-parser)

# Emscripten toolchain should be set externally via emcmake
if(NOT EMSCRIPTEN)
    message(FATAL_ERROR "This CMakeLists.txt must be used with Emscripten. Run with emcmake.")
endif()

set(CMAKE_CXX_STANDARD 17)
set(CMAKE_CXX_STANDARD_REQUIRED ON)

# Resolve AGenUI core root
if(NOT DEFINED AGENUI_REPO_ROOT)
    set(AGENUI_REPO_ROOT "${CMAKE_CURRENT_SOURCE_DIR}/../../..")
endif()
get_filename_component(AGENUI_REPO_ROOT "${AGENUI_REPO_ROOT}" ABSOLUTE)

set(CORE_SRC_DIR "${AGENUI_REPO_ROOT}/core/src")
set(CORE_INCLUDE_DIR "${AGENUI_REPO_ROOT}/core/include")

# Source files for the protocol stream parser (minimal subset)
set(PARSER_SOURCES
    ${CMAKE_CURRENT_SOURCE_DIR}/agenui_web_bindings.cpp
    ${CMAKE_CURRENT_SOURCE_DIR}/agenui_log_stub.cpp
    ${CORE_SRC_DIR}/stream/agenui_protocol_stream_extractor.cpp
    ${CORE_SRC_DIR}/stream/agenui_composite_stream_plugin.cpp
    ${CORE_SRC_DIR}/stream/agenui_markdown_stream_plugin.cpp
    ${CORE_SRC_DIR}/stream/agenui_text_stream_plugin.cpp
)

# Include paths
include_directories(
    ${CORE_INCLUDE_DIR}
    ${CORE_SRC_DIR}
    ${CORE_SRC_DIR}/third_party
)

# Emscripten compatibility: add cstdarg for va_list functions
add_compile_definitions(__EMSCRIPTEN__=1)

# Emscripten build options
set(EMSCRIPTEN_FLAGS
    "-s WASM=1"
    "-s EXPORT_ES6=1"
    "-s MODULARIZE=1"
    "-s EXPORT_NAME='AGenUIParserModule'"
    "-s ALLOW_MEMORY_GROWTH=1"
    "-s INITIAL_MEMORY=16MB"
    "-s MAXIMUM_MEMORY=256MB"
    "-s STACK_SIZE=2MB"
    "-s EXPORTED_RUNTIME_METHODS=['ccall','cwrap','UTF8ToString','stringToUTF8','lengthBytesUTF8']"
    "-s ENVIRONMENT=web"
    "-s FILESYSTEM=0"
    "-s SINGLE_FILE=1"
    "-O3"
    "-flto"
)

# Join flags for CMake
set(EMSCRIPTEN_FLAGS_STR "")
foreach(flag ${EMSCRIPTEN_FLAGS})
    set(EMSCRIPTEN_FLAGS_STR "${EMSCRIPTEN_FLAGS_STR} ${flag}")
endforeach()

set(CMAKE_CXX_FLAGS "${CMAKE_CXX_FLAGS} ${EMSCRIPTEN_FLAGS_STR}")
set(CMAKE_C_FLAGS "${CMAKE_C_FLAGS} ${EMSCRIPTEN_FLAGS_STR}")
set(CMAKE_EXE_LINKER_FLAGS "${CMAKE_EXE_LINKER_FLAGS} ${EMSCRIPTEN_FLAGS_STR} -lembind")

# Build the WASM module as a "executable" (Emscripten standard approach)
add_executable(agenui_parser ${PARSER_SOURCES})

set_target_properties(agenui_parser PROPERTIES
    SUFFIX ".js"
    RUNTIME_OUTPUT_DIRECTORY "${CMAKE_CURRENT_BINARY_DIR}"
    LINK_FLAGS "-lembind"
)

# Post-build: copy JS output to the web SDK src directory
add_custom_command(TARGET agenui_parser POST_BUILD
    COMMAND ${CMAKE_COMMAND} -E copy
        "${CMAKE_CURRENT_BINARY_DIR}/agenui_parser.js"
        "${CMAKE_CURRENT_SOURCE_DIR}/../src/bridge/agenui_parser.js"
    COMMENT "Copying WASM JS glue to bridge directory"
)
