import type { PendingApproval } from "../../../logic/session";

export function describePendingApproval(approval: PendingApproval): {
  summary: string;
  description: string;
} {
  switch (approval.requestKind) {
    case "command":
      return {
        summary: "Command approval requested",
        description: "The agent wants to run a command that requires your approval.",
      };
    case "file-read":
      return {
        summary: "File-read approval requested",
        description: "The agent wants to read a file or directory that requires your approval.",
      };
    case "file-change":
      return {
        summary: "File-change approval requested",
        description: "The agent wants to modify files and needs your approval before continuing.",
      };
    case "tool":
      return {
        summary: "Tool approval requested",
        description: "The agent wants to use a tool that requires your approval before continuing.",
      };
  }
}
