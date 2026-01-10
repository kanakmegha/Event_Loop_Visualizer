import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =========================
   TASK FACTORY
   ========================= */
function createTask(id, label, type, duration = null) {
  return {
    id,
    label,
    type,
    duration,
    createdAt: Date.now(),
    startedAt: null,
    endedAt: null
  };
}

export default function App() {
  /* =========================
     DEMO CODE
     ========================= */
  const codeLines = [
    'console.log("A")',
    'setTimeout(() => console.log("B"), 2000)',
    'Promise.resolve().then(() => console.log("C"))',
    'console.log("D")'
  ];

  /* =========================
     STATE
     ========================= */
  const [currentLine, setCurrentLine] = useState(0);

  const [callStack, setCallStack] = useState([]);
  const [microtasks, setMicrotasks] = useState([
    createTask("micro-1", "Promise Callback", "micro")
  ]);
  const [macrotasks, setMacrotasks] = useState([
    createTask("macro-1", "Timer Callback", "macro", 2000)
  ]);

  const [executed, setExecuted] = useState([]);
  const [logs, setLogs] = useState([]);

  /* =========================
     TIMER TICK
     ========================= */
  useEffect(() => {
    const interval = setInterval(() => {
      setMacrotasks((tasks) =>
        tasks.map((t) =>
          t.duration !== null && t.duration > 0
            ? { ...t, duration: t.duration - 500 }
            : t
        )
      );
    }, 500);

    return () => clearInterval(interval);
  }, []);

  /* =========================
     EVENT LOOP — NEXT STEP
     ========================= */
  function nextStep() {
    // 1️⃣ Finish execution
    if (callStack.length > 0) {
      const finished = {
        ...callStack[0],
        endedAt: Date.now()
      };

      setCallStack([]);
      setExecuted((e) => [...e, finished]);

      if (finished.label === "Print") {
        const prev = currentLine - 1;
        if (prev === 0) setLogs((l) => [...l, "A"]);
        if (prev === 3) setLogs((l) => [...l, "D"]);
        if (prev === 2) setLogs((l) => [...l, "C"]);
        if (prev === 1) setLogs((l) => [...l, "B"]);
      }

      return;
    }

    // 2️⃣ Execute main script
    if (currentLine < codeLines.length) {
      const line = codeLines[currentLine];
      setCurrentLine((l) => l + 1);

      if (line.includes("console.log")) {
        setCallStack([
          {
            ...createTask(
              `sync-${currentLine}`,
              "Print",
              "sync"
            ),
            startedAt: Date.now()
          }
        ]);
      }

      return;
    }

    // 3️⃣ Microtasks first
    if (microtasks.length > 0) {
      const task = {
        ...microtasks[0],
        startedAt: Date.now()
      };

      setMicrotasks((q) => q.slice(1));
      setCallStack([task]);
      return;
    }

    // 4️⃣ Macrotasks after timer expires
    const ready = macrotasks.find(
      (t) => t.duration !== null && t.duration <= 0
    );

    if (ready) {
      setMacrotasks((q) => q.filter((t) => t.id !== ready.id));
      setCallStack([
        {
          ...ready,
          startedAt: Date.now()
        }
      ]);
    }
  }

  /* =========================
     UI
     ========================= */
  return (
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        fontFamily: "system-ui"
      }}
    >
      {/* TOP SECTION */}
      <div style={{ display: "flex", padding: 20, gap: 20 }}>
        {/* CONSOLE */}
        <div style={{ flex: 1 }}>
          <h3>Console Output</h3>
          <div
            style={{
              background: "#0b0f14",
              color: "#00ff9c",
              padding: 16,
              minHeight: 160,
              fontFamily: "monospace",
              fontSize: 18,
              borderRadius: 8
            }}
          >
            {logs.length === 0 && (
              <div style={{ opacity: 0.4 }}>
                (no output yet)
              </div>
            )}
            {logs.map((l, i) => (
              <div key={i}>▶ {l}</div>
            ))}
          </div>
        </div>

        {/* CODE */}
        <div style={{ flex: 1 }}>
          <h3>Code (Execution Pointer)</h3>
          <pre
            style={{
              background: "#f7f7f7",
              padding: 16,
              fontFamily: "monospace",
              borderRadius: 8
            }}
          >
            {codeLines.map((line, i) => (
              <div
                key={i}
                style={{
                  background:
                    i === currentLine ? "#ffeaa7" : "transparent",
                  opacity: i === currentLine ? 1 : 0.5,
                  borderLeft:
                    i === currentLine
                      ? "4px solid red"
                      : "4px solid transparent",
                  paddingLeft: 8
                }}
              >
                {i + 1}. {line}
              </div>
            ))}
          </pre>
        </div>
      </div>

      {/* CONTROLS */}
      <div style={{ paddingLeft: 20 }}>
        <button onClick={nextStep}>▶ Next Step</button>
      </div>

      {/* EVENT LOOP STAGE */}
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <motion.div
          layout
          style={{
            width: "95%",
            height: "90%",
            background: "#eef2f7",
            borderRadius: 24,
            padding: 30,
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr",
            gap: 20
          }}
        >
          {/* CALL STACK */}
          <div>
            <h3 style={{ textAlign: "center" }}>Call Stack</h3>
            <AnimatePresence>
              {callStack.map((task) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  style={{
                    background: "#ff6fae",
                    padding: 14,
                    borderRadius: 14,
                    fontWeight: 600,
                    textAlign: "center"
                  }}
                >
                  {task.label}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {/* MICROTASK QUEUE */}
          <div>
            <h3 style={{ textAlign: "center" }}>
              Microtask Queue
            </h3>
            {microtasks.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#6c5ce7",
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 8,
                  color: "white",
                  textAlign: "center"
                }}
              >
                {t.label}
              </div>
            ))}
          </div>

          {/* CALLBACK QUEUE */}
          <div>
            <h3 style={{ textAlign: "center" }}>
              Callback Queue
            </h3>
            {macrotasks.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#fdcb6e",
                  padding: 12,
                  borderRadius: 12,
                  marginBottom: 8,
                  textAlign: "center"
                }}
              >
                {t.label}
                <div style={{ fontSize: 12, opacity: 0.7 }}>
                  ⏱ {Math.max(t.duration, 0)} ms
                </div>
              </div>
            ))}
          </div>

          {/* EXECUTED */}
          <div>
            <h3 style={{ textAlign: "center" }}>Executed</h3>
            {executed.map((t) => (
              <div
                key={t.id}
                style={{
                  background: "#b2bec3",
                  padding: 10,
                  borderRadius: 10,
                  marginBottom: 6,
                  fontSize: 13
                }}
              >
                {t.label}
                <div style={{ fontSize: 11, opacity: 0.6 }}>
                  waited:{" "}
                  {t.startedAt && t.createdAt
                    ? `${t.startedAt - t.createdAt} ms`
                    : "-"}
                  , ran:{" "}
                  {t.endedAt && t.startedAt
                    ? `${t.endedAt - t.startedAt} ms`
                    : "-"}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
