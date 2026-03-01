import { useAgent } from "agents/react";
import { useAgentChat } from "@cloudflare/ai-chat/react";

function Chat() {
  const agent = useAgent({ agent: "ChatAgent" });

  const {
    messages,
    sendMessage,
    clearHistory,
    addToolApprovalResponse,
    status,
  } = useAgentChat({
    agent,
    // Handle client-side tools (tools with no server execute function)
    onToolCall: async ({ toolCall, addToolOutput }) => {
      if (toolCall.toolName === "getUserTimezone") {
        addToolOutput({
          toolCallId: toolCall.toolCallId,
          output: {
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            localTime: new Date().toLocaleTimeString(),
          },
        });
      }
    },
  });

  return (
    <div style={{ maxWidth: 900, margin: "24px auto", fontFamily: "system-ui, sans-serif" }}>
      <h1 style={{ marginBottom: 8 }}>Chat Agent</h1>
      <p style={{ marginTop: 0, color: "#555" }}>
        Try: “What’s the weather in Tokyo?”, “What timezone am I in?”, “What is 5000 times 3?”
      </p>

      <div
        style={{
          border: "1px solid #ddd",
          borderRadius: 8,
          padding: 12,
          height: 460,
          overflow: "auto",
          background: "#fff",
        }}
      >
        {messages.map((msg) => (
          <div key={msg.id} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: 700, marginBottom: 4 }}>{msg.role}</div>

            {msg.parts.map((part, i) => {
              if (part.type === "text") {
                return (
                  <div key={i} style={{ whiteSpace: "pre-wrap" }}>
                    {part.text}
                  </div>
                );
              }

              // Approval UI for tools that need confirmation
              if (part.type === "tool" && part.state === "approval-required") {
                return (
                  <div
                    key={part.toolCallId}
                    style={{
                      border: "1px solid #f0c36d",
                      background: "#fff8e6",
                      padding: 10,
                      borderRadius: 8,
                      marginTop: 6,
                    }}
                  >
                    <div style={{ marginBottom: 8 }}>
                      Approve <strong>{part.toolName}</strong>?
                    </div>
                    <pre style={{ margin: 0, overflow: "auto" }}>
                      {JSON.stringify(part.input, null, 2)}
                    </pre>

                    <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
                      <button
                        type="button"
                        onClick={() =>
                          addToolApprovalResponse({
                            id: part.toolCallId,
                            approved: true,
                          })
                        }
                      >
                        Approve
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          addToolApprovalResponse({
                            id: part.toolCallId,
                            approved: false,
                          })
                        }
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              }

              // Completed tool results
              if (part.type === "tool" && part.state === "output-available") {
                return (
                  <details key={part.toolCallId} style={{ marginTop: 6 }}>
                    <summary style={{ cursor: "pointer" }}>{part.toolName} result</summary>
                    <pre style={{ overflow: "auto" }}>{JSON.stringify(part.output, null, 2)}</pre>
                  </details>
                );
              }

              return null;
            })}
          </div>
        ))}
      </div>

      <form
        style={{ display: "flex", gap: 8, marginTop: 12 }}
        onSubmit={(e) => {
          e.preventDefault();
          const input = e.currentTarget.elements.namedItem("message") as HTMLInputElement;
          const text = input.value.trim();
          if (!text) return;
          sendMessage({ text });
          input.value = "";
        }}
      >
        <input
          name="message"
          placeholder="Type a message…"
          style={{ flex: 1, padding: 10, borderRadius: 8, border: "1px solid #ccc" }}
        />
        <button type="submit" disabled={status === "streaming"}>
          {status === "streaming" ? "Streaming…" : "Send"}
        </button>
      </form>

      <div style={{ marginTop: 10 }}>
        <button type="button" onClick={clearHistory}>
          Clear history
        </button>
      </div>
    </div>
  );
}

export default function App() {
  return <Chat />;
}