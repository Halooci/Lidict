import React, { useEffect, useRef, useState } from 'react';
import Navbar from './komponen/Navbar';

const TextEditor = () => {
  const editorRef = useRef(null);
  const editorInstanceRef = useRef(null); // <-- ref untuk instance CodeMirror
  const outputRef = useRef(null);
  const fileInputRef = useRef(null);
  const [isPyodideReady, setIsPyodideReady] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [output, setOutput] = useState('');

  // Helper load script
  const loadScript = (src) => {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Gagal memuat ${src}`));
      document.head.appendChild(script);
    });
  };

  const loadStylesheet = (href) => {
    if (!document.querySelector(`link[href="${href}"]`)) {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = href;
      document.head.appendChild(link);
    }
  };

  // Inisialisasi
  useEffect(() => {
    const init = async () => {
      // Load CodeMirror
      if (!window.CodeMirror) {
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js');
        await loadScript('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/mode/python/python.min.js');
        loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css');
        loadStylesheet('https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/theme/material-darker.min.css');
        await new Promise(r => setTimeout(r, 100));
      }

      // Buat instance CodeMirror
      if (editorRef.current && !editorInstanceRef.current) {
        const cm = window.CodeMirror(editorRef.current, {
          value: `# Python Text Editor\n# Mulai menulis kode Anda di sini\n\nprint("Hello, World!")\n`,
          mode: 'python',
          theme: 'material-darker',
          lineNumbers: true,
          indentUnit: 4,
          tabSize: 4,
          lineWrapping: true,
          autoCloseBrackets: true,
          matchBrackets: true,
          extraKeys: {
            'Ctrl-S': () => exportCode(),
            'Cmd-S': () => exportCode(),
            'Ctrl-Enter': () => runCode(),
            'Cmd-Enter': () => runCode(),
          },
        });
        editorInstanceRef.current = cm; // simpan ke ref
      }

      // Load Pyodide
      if (!window.pyodide) {
        await loadScript('https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js');
        window.pyodide = await window.loadPyodide({
          indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/',
        });
        setIsPyodideReady(true);
        setOutput('Pyodide siap. Silakan tulis kode Python.\n');
      } else {
        setIsPyodideReady(true);
      }
    };

    init().catch(console.error);
  }, []);

  // Fungsi menjalankan kode
  const runCode = async () => {
    const editor = editorInstanceRef.current;
    if (!editor || !window.pyodide) {
      console.warn('Editor atau Pyodide belum siap');
      return;
    }
    setIsRunning(true);
    const code = editor.getValue();
    console.log('Kode yang dijalankan:', code); // untuk debug

    try {
      // Redirect stdout
      window.pyodide.runPython(`
import sys
from io import StringIO
sys.stdout = StringIO()
      `);

      // Jalankan kode
      await window.pyodide.runPythonAsync(code);
      
      // Ambil output
      const stdout = window.pyodide.runPython('sys.stdout.getvalue()');
      setOutput((prev) => prev + `\n> ${new Date().toLocaleTimeString()}\n${stdout || 'Tidak ada output.'}\n`);
    } catch (err) {
      setOutput((prev) => prev + `\n> ${new Date().toLocaleTimeString()}\n❌ Error: ${err.message || err}\n`);
    } finally {
      setIsRunning(false);
      // Reset stdout
      window.pyodide.runPython(`
import sys
sys.stdout = sys.__stdout__
      `);
    }
  };

  // Export
  const exportCode = () => {
    const editor = editorInstanceRef.current;
    if (!editor) return;
    const code = editor.getValue();
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'script.py';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setOutput((prev) => prev + `\n📤 Kode diekspor ke script.py\n`);
  };

  // Import
  const importCode = (event) => {
    const editor = editorInstanceRef.current;
    const file = event.target.files?.[0];
    if (!file || !editor) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target.result;
      editor.setValue(content);
      setOutput((prev) => prev + `\n📥 Kode diimpor dari ${file.name}\n`);
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleImportClick = () => fileInputRef.current?.click();
  const clearOutput = () => setOutput('Output dibersihkan.\n');

  return (
    <>
      <Navbar />
      <div className="text-editor-container">
        <div className="toolbar">
          <div className="toolbar-left">
            <span className="toolbar-title">🐍 Python Editor</span>
            <span className="toolbar-status">
              {isPyodideReady ? '✅ Siap' : '⏳ Memuat...'}
            </span>
          </div>
          <div className="toolbar-right">
            <button className="btn btn-import" onClick={handleImportClick} title="Import file .py">
              📂 Import
            </button>
            <input
              type="file"
              ref={fileInputRef}
              accept=".py"
              style={{ display: 'none' }}
              onChange={importCode}
            />
            <button className="btn btn-export" onClick={exportCode} title="Export ke file .py">
              💾 Export
            </button>
            <button
              className="btn btn-run"
              onClick={runCode}
              disabled={isRunning || !isPyodideReady}
            >
              {isRunning ? '⏳ Running...' : '▶️ Run'}
            </button>
            <button className="btn btn-clear" onClick={clearOutput} title="Clear output">
              🗑️ Clear
            </button>
          </div>
        </div>

        <div className="editor-wrapper">
          <div className="editor-area" ref={editorRef} />
          <div className="output-area">
            <div className="output-header">
              <span>📋 Output</span>
              <span className="output-badge">Python {isPyodideReady ? '✓' : '⏳'}</span>
            </div>
            <div className="output-content" ref={outputRef}>
              <pre>{output}</pre>
            </div>
          </div>
        </div>

        <div className="footer-shortcuts">
          <span>⌨️ Ctrl+Enter / Cmd+Enter: Run</span>
          <span>Ctrl+S / Cmd+S: Export</span>
        </div>

        <style>{`
          .text-editor-container {
            display: flex;
            flex-direction: column;
            height: calc(100vh - 64px);
            margin-top: 64px;
            background: #1e1e2a;
            color: #cdd6f4;
            font-family: 'Segoe UI', 'Fira Code', monospace;
            overflow: hidden;
          }
          .toolbar {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 12px 20px;
            background: #16161f;
            border-bottom: 1px solid #313244;
            flex-shrink: 0;
            flex-wrap: wrap;
            gap: 8px;
          }
          .toolbar-left {
            display: flex;
            align-items: center;
            gap: 16px;
          }
          .toolbar-title {
            font-size: 1.1rem;
            font-weight: 600;
            color: #a6e3a1;
            letter-spacing: 0.5px;
          }
          .toolbar-status {
            font-size: 0.8rem;
            color: #89b4fa;
            background: #1e1e2a;
            padding: 2px 12px;
            border-radius: 12px;
            border: 1px solid #45475a;
          }
          .toolbar-right {
            display: flex;
            gap: 8px;
            flex-wrap: wrap;
          }
          .btn {
            padding: 6px 16px;
            border: none;
            border-radius: 6px;
            font-size: 0.85rem;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s ease;
            background: #313244;
            color: #cdd6f4;
            display: inline-flex;
            align-items: center;
            gap: 6px;
          }
          .btn:hover:not(:disabled) {
            transform: translateY(-1px);
            filter: brightness(1.2);
          }
          .btn:active:not(:disabled) {
            transform: translateY(0);
          }
          .btn:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            transform: none;
          }
          .btn-import { background: #45475a; color: #89b4fa; }
          .btn-export { background: #45475a; color: #a6e3a1; }
          .btn-run {
            background: #a6e3a1;
            color: #1e1e2a;
            font-weight: 600;
          }
          .btn-run:hover:not(:disabled) { background: #94d58b; }
          .btn-clear { background: #45475a; color: #f38ba8; }

          .editor-wrapper {
            display: flex;
            flex: 1;
            min-height: 0;
            gap: 0;
            background: #16161f;
          }
          .editor-area {
            flex: 2;
            height: 100%;
            overflow: hidden;
            background: #1e1e2a;
            border-right: 1px solid #313244;
          }
          .editor-area .CodeMirror {
            height: 100% !important;
            font-size: 14px;
            line-height: 1.6;
            background: #1e1e2a;
            color: #cdd6f4;
          }
          .editor-area .CodeMirror-gutters {
            background: #16161f;
            border-right: 1px solid #313244;
          }
          .editor-area .CodeMirror-linenumber {
            color: #6c7086;
          }
          .editor-area .CodeMirror-cursor {
            border-left: 2px solid #a6e3a1;
          }
          .output-area {
            flex: 1;
            min-width: 280px;
            display: flex;
            flex-direction: column;
            background: #1e1e2a;
          }
          .output-header {
            display: flex;
            justify-content: space-between;
            padding: 8px 16px;
            background: #16161f;
            border-bottom: 1px solid #313244;
            font-size: 0.85rem;
            font-weight: 500;
            color: #a6adc8;
            flex-shrink: 0;
          }
          .output-badge {
            font-size: 0.7rem;
            background: #313244;
            padding: 2px 10px;
            border-radius: 12px;
            color: #a6e3a1;
          }
          .output-content {
            flex: 1;
            padding: 12px 16px;
            overflow-y: auto;
            background: #16161f;
            font-family: 'Fira Code', 'Consolas', monospace;
            font-size: 13px;
            line-height: 1.5;
            color: #cdd6f4;
            white-space: pre-wrap;
            word-break: break-all;
          }
          .output-content pre {
            margin: 0;
            white-space: pre-wrap;
            word-break: break-all;
          }
          .output-content::-webkit-scrollbar,
          .editor-area .CodeMirror-scroll::-webkit-scrollbar {
            width: 6px;
            height: 6px;
          }
          .output-content::-webkit-scrollbar-track,
          .editor-area .CodeMirror-scroll::-webkit-scrollbar-track {
            background: #16161f;
          }
          .output-content::-webkit-scrollbar-thumb,
          .editor-area .CodeMirror-scroll::-webkit-scrollbar-thumb {
            background: #45475a;
            border-radius: 4px;
          }
          .output-content::-webkit-scrollbar-thumb:hover,
          .editor-area .CodeMirror-scroll::-webkit-scrollbar-thumb:hover {
            background: #6c7086;
          }
          .footer-shortcuts {
            display: flex;
            justify-content: center;
            gap: 32px;
            padding: 6px 20px;
            background: #16161f;
            border-top: 1px solid #313244;
            font-size: 0.75rem;
            color: #6c7086;
            flex-shrink: 0;
            flex-wrap: wrap;
          }
          @media (max-width: 768px) {
            .text-editor-container {
              height: calc(100vh - 56px);
              margin-top: 56px;
            }
            .editor-wrapper {
              flex-direction: column;
            }
            .editor-area {
              flex: 1;
              border-right: none;
              border-bottom: 1px solid #313244;
              min-height: 200px;
            }
            .output-area {
              flex: 1;
              min-height: 150px;
            }
            .toolbar {
              flex-direction: column;
              align-items: stretch;
              gap: 6px;
            }
            .toolbar-left,
            .toolbar-right {
              justify-content: center;
              flex-wrap: wrap;
            }
            .footer-shortcuts {
              gap: 12px;
              font-size: 0.65rem;
            }
          }
        `}</style>
      </div>
    </>
  );
};

export default TextEditor;