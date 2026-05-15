#include <emscripten/bind.h>
#include <string>
#include <vector>
#include <memory>

#include "stream/agenui_protocol_stream_extractor.h"
#include "stream/agenui_composite_stream_plugin.h"
#include "stream/agenui_markdown_stream_plugin.h"
#include "stream/agenui_text_stream_plugin.h"

using namespace emscripten;
using namespace agenui;

// Helper to convert ParseResult to a JSON string for JS consumption
static std::string parseResultToJson(const ProtocolStreamExtractor::ParseResult& result) {
    std::string json = "{";
    json += "\"type\":" + std::to_string(static_cast<int>(result.type)) + ",";
    json += "\"eventType\":" + std::to_string(static_cast<int>(result.eventType)) + ",";
    json += "\"eventJson\":" + nlohmann::json(result.eventJson).dump() + ",";
    json += "\"componentJson\":" + nlohmann::json(result.componentJson).dump() + ",";
    json += "\"surfaceId\":" + nlohmann::json(result.surfaceId).dump() + ",";
    json += "\"version\":" + nlohmann::json(result.version).dump();
    json += "}";
    return json;
}

// Wrapper that drives the parser and returns results as a JSON array string
static std::string driveParserAndReturnJson(ProtocolStreamExtractor& extractor) {
    auto results = extractor.driveParser();
    std::string jsonArray = "[";
    for (size_t i = 0; i < results.size(); ++i) {
        if (i > 0) jsonArray += ",";
        jsonArray += parseResultToJson(results[i]);
    }
    jsonArray += "]";
    return jsonArray;
}

// Factory that creates a fully-configured extractor with all plugins
static ProtocolStreamExtractor* createParser() {
    auto* extractor = new ProtocolStreamExtractor();
    auto* composite = new CompositeStreamPlugin();
    auto* markdown = new MarkdownStreamPlugin();
    auto* text = new TextStreamPlugin();
    composite->addPlugin(markdown);
    composite->addPlugin(text);
    extractor->setPlugin(composite);
    return extractor;
}

// Cleanup factory
static void destroyParser(ProtocolStreamExtractor* extractor) {
    if (!extractor) return;
    // The extractor doesn't own the plugin, so we need to clean up manually
    // This is a simplified approach; in production we'd track plugin ownership
    delete extractor;
}

EMSCRIPTEN_BINDINGS(agenui_parser) {
    // Expose EventType as integer values
    enum_<ProtocolStreamExtractor::EventType>("EventType")
        .value("Unknown", ProtocolStreamExtractor::EventType::Unknown)
        .value("CreateSurface", ProtocolStreamExtractor::EventType::CreateSurface)
        .value("UpdateComponents", ProtocolStreamExtractor::EventType::UpdateComponents)
        .value("UpdateDataModel", ProtocolStreamExtractor::EventType::UpdateDataModel)
        .value("AppendDataModel", ProtocolStreamExtractor::EventType::AppendDataModel)
        .value("DeleteSurface", ProtocolStreamExtractor::EventType::DeleteSurface);

    // Expose ParseResult::Type
    enum_<ProtocolStreamExtractor::ParseResult::Type>("ParseResultType")
        .value("NormalEvent", ProtocolStreamExtractor::ParseResult::Type::NormalEvent)
        .value("ComponentUpdate", ProtocolStreamExtractor::ParseResult::Type::ComponentUpdate);

    // Expose ParseResult (read-only from JS)
    value_object<ProtocolStreamExtractor::ParseResult>("ParseResult")
        .field("type", &ProtocolStreamExtractor::ParseResult::type)
        .field("eventType", &ProtocolStreamExtractor::ParseResult::eventType)
        .field("eventJson", &ProtocolStreamExtractor::ParseResult::eventJson)
        .field("componentJson", &ProtocolStreamExtractor::ParseResult::componentJson)
        .field("surfaceId", &ProtocolStreamExtractor::ParseResult::surfaceId)
        .field("version", &ProtocolStreamExtractor::ParseResult::version);

    // Expose ProtocolStreamExtractor methods
    class_<ProtocolStreamExtractor>("ProtocolStreamExtractor")
        .constructor()
        .function("appendData", &ProtocolStreamExtractor::appendData)
        .function("driveParser", &ProtocolStreamExtractor::driveParser)
        .function("hasUnprocessedData", &ProtocolStreamExtractor::hasUnprocessedData)
        .function("reset", &ProtocolStreamExtractor::reset)
        .function("driveParserJson", &driveParserAndReturnJson);

    // Factory functions
    function("createParser", &createParser, allow_raw_pointers());
    function("destroyParser", &destroyParser, allow_raw_pointers());
}
