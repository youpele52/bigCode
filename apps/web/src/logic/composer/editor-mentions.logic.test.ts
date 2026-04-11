import { describe, expect, it } from "vitest";

import { splitPromptIntoComposerSegments } from "./editor-mentions.logic";
import { INLINE_TERMINAL_CONTEXT_PLACEHOLDER } from "../../lib/terminalContext";

describe("splitPromptIntoComposerSegments", () => {
  it("splits mention tokens followed by whitespace into mention segments", () => {
    expect(splitPromptIntoComposerSegments("Inspect @AGENTS.md please")).toEqual([
      { type: "text", text: "Inspect " },
      {
        type: "mention",
        rawValue: "AGENTS.md",
        displayLabel: "AGENTS.md",
        mentionKind: "path",
      },
      { type: "text", text: " please" },
    ]);
  });

  it("does not convert an incomplete trailing mention token", () => {
    expect(splitPromptIntoComposerSegments("Inspect @AGENTS.md")).toEqual([
      { type: "text", text: "Inspect @AGENTS.md" },
    ]);
  });

  it("keeps newlines around mention tokens", () => {
    expect(splitPromptIntoComposerSegments("one\n@src/index.ts \ntwo")).toEqual([
      { type: "text", text: "one\n" },
      {
        type: "mention",
        rawValue: "src/index.ts",
        displayLabel: "index.ts",
        mentionKind: "path",
      },
      { type: "text", text: " \ntwo" },
    ]);
  });

  it("keeps inline terminal context placeholders at their prompt positions", () => {
    expect(
      splitPromptIntoComposerSegments(
        `Inspect ${INLINE_TERMINAL_CONTEXT_PLACEHOLDER}@AGENTS.md please`,
      ),
    ).toEqual([
      { type: "text", text: "Inspect " },
      { type: "terminal-context", context: null },
      {
        type: "mention",
        rawValue: "AGENTS.md",
        displayLabel: "AGENTS.md",
        mentionKind: "path",
      },
      { type: "text", text: " please" },
    ]);
  });

  it("parses agent mentions with a short display label", () => {
    expect(splitPromptIntoComposerSegments("Use @agent::clarifier please")).toEqual([
      { type: "text", text: "Use " },
      {
        type: "mention",
        rawValue: "agent::clarifier",
        displayLabel: "clarifier",
        mentionKind: "agent",
      },
      { type: "text", text: " please" },
    ]);
  });

  it("parses skill mentions with a short display label", () => {
    expect(splitPromptIntoComposerSegments("Use @skill::review please")).toEqual([
      { type: "text", text: "Use " },
      {
        type: "mention",
        rawValue: "skill::review",
        displayLabel: "review",
        mentionKind: "skill",
      },
      { type: "text", text: " please" },
    ]);
  });

  it("keeps a trailing path mention as plain text", () => {
    expect(splitPromptIntoComposerSegments("Inspect @AGENTS.md")).toEqual([
      { type: "text", text: "Inspect @AGENTS.md" },
    ]);
  });

  it("parses a trailing agent mention when explicitly allowed", () => {
    expect(
      splitPromptIntoComposerSegments("Use @agent::clarifier", [], {
        allowTrailingAgentAndSkillMentions: true,
      }),
    ).toEqual([
      { type: "text", text: "Use " },
      {
        type: "mention",
        rawValue: "agent::clarifier",
        displayLabel: "clarifier",
        mentionKind: "agent",
      },
    ]);
  });

  it("parses a trailing skill mention when explicitly allowed", () => {
    expect(
      splitPromptIntoComposerSegments("Use @skill::review", [], {
        allowTrailingAgentAndSkillMentions: true,
      }),
    ).toEqual([
      { type: "text", text: "Use " },
      {
        type: "mention",
        rawValue: "skill::review",
        displayLabel: "review",
        mentionKind: "skill",
      },
    ]);
  });
});
