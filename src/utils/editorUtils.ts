import React from 'react';

/**
 * Custom historical record for code changes.
 */
interface HistoryEntry {
  code: string;
  selectionStart: number;
  selectionEnd: number;
}

/**
 * Editor history context structure per textarea.
 */
interface EditorHistory {
  past: HistoryEntry[];
  future: HistoryEntry[];
  lastSavedCode: string;
  lastSavedTime: number;
}

// Holds history separately for each editor textarea in the view.
// This prevents cross-component history contamination and handles memory cleanup automatically.
const historyMap = new WeakMap<HTMLTextAreaElement, EditorHistory>();

/**
 * Retrieves or instantiates the history tracking context for a textarea.
 */
function getOrCreateHistory(textarea: HTMLTextAreaElement, currentCode: string): EditorHistory {
  let hist = historyMap.get(textarea);
  if (!hist) {
    hist = {
      past: [],
      future: [],
      lastSavedCode: currentCode,
      lastSavedTime: Date.now()
    };
    historyMap.set(textarea, hist);
  }
  return hist;
}

/**
 * Saves a snapshot of edit history to the past list if changes occurred.
 * Groups small character changes by a chronological 1.2-second debounce rule.
 */
function saveHistory(textarea: HTMLTextAreaElement, currentCode: string, force = false) {
  const hist = getOrCreateHistory(textarea, currentCode);
  const now = Date.now();
  const isTimeThreshold = now - hist.lastSavedTime > 1200;

  if (currentCode !== hist.lastSavedCode) {
    if (force || isTimeThreshold || hist.past.length === 0) {
      hist.past.push({
        code: hist.lastSavedCode,
        selectionStart: textarea.selectionStart,
        selectionEnd: textarea.selectionEnd
      });

      // Keep past history limited to last 100 snapshots
      if (hist.past.length > 100) {
        hist.past.shift();
      }

      // Overwrite potential future redos on fresh interaction edits
      hist.future = [];
      hist.lastSavedCode = currentCode;
      hist.lastSavedTime = now;
    }
  }
}

/**
 * Enhanced keyboard event handler for code editor textareas.
 * Integrates:
 * 1. Ctrl+Z / Cmd+Z: Undo last change.
 * 2. Ctrl+Y / Cmd+Y / Ctrl+Shift+Z / Cmd+Shift+Z: Redo undone change.
 * 3. Ctrl+A / Cmd+A: Robustly selects all code in the workspace.
 * 4. Tab: Inserts 4 spaces at cursor or indents selected lines block.
 * 5. Shift+Tab: Unindents selected lines block or current line.
 * 6. Enter: Automatically matches the current line's indentation level.
 *    If the current line ends with a colon (:), adds an extra 4 spaces of indentation.
 */
export function handleEditorKeyDown(
  e: React.KeyboardEvent<HTMLTextAreaElement>,
  code: string,
  setCode: (newCode: string) => void
) {
  const textarea = e.currentTarget;
  const start = textarea.selectionStart;
  const end = textarea.selectionEnd;

  // Let's first track regular keystrokes to group history frames dynamically
  saveHistory(textarea, code, false);

  const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
  const isCmdOrCtrl = isMac ? e.metaKey : e.ctrlKey;

  // 1. CTRL + Z / CMD + Z (Undo)
  if (isCmdOrCtrl && e.key.toLowerCase() === 'z' && !e.shiftKey) {
    e.preventDefault();
    const hist = getOrCreateHistory(textarea, code);

    // Save any pending uncommitted typed changes before we undo
    if (code !== hist.lastSavedCode) {
      hist.past.push({
        code: hist.lastSavedCode,
        selectionStart: start,
        selectionEnd: end
      });
      hist.lastSavedCode = code;
    }

    if (hist.past.length > 0) {
      const previous = hist.past.pop()!;
      hist.future.push({
        code: code,
        selectionStart: start,
        selectionEnd: end
      });

      setCode(previous.code);
      hist.lastSavedCode = previous.code;
      hist.lastSavedTime = Date.now();

      // Restore past cursor position and selection nicely
      setTimeout(() => {
        textarea.selectionStart = previous.selectionStart;
        textarea.selectionEnd = previous.selectionEnd;
      }, 0);
    }
    return;
  }

  // 2. CTRL + Y / CMD + Y or CTRL + SHIFT + Z / CMD + SHIFT + Z (Redo)
  const isRedoRequested =
    (isCmdOrCtrl && e.key.toLowerCase() === 'y') ||
    (isCmdOrCtrl && e.shiftKey && e.key.toLowerCase() === 'z');

  if (isRedoRequested) {
    e.preventDefault();
    const hist = getOrCreateHistory(textarea, code);

    if (hist.future.length > 0) {
      const next = hist.future.pop()!;
      hist.past.push({
        code: code,
        selectionStart: start,
        selectionEnd: end
      });

      setCode(next.code);
      hist.lastSavedCode = next.code;
      hist.lastSavedTime = Date.now();

      // Restore future cursor position and selection nicely
      setTimeout(() => {
        textarea.selectionStart = next.selectionStart;
        textarea.selectionEnd = next.selectionEnd;
      }, 0);
    }
    return;
  }

  // 3. CTRL + A / CMD + A (Select All)
  if (isCmdOrCtrl && e.key.toLowerCase() === 'a') {
    e.preventDefault();
    textarea.select();
    return;
  }

  // 4. Tab Key Handling (Indentation)
  if (e.key === 'Tab') {
    e.preventDefault();
    const isShift = e.shiftKey;

    // Force save history before modify
    saveHistory(textarea, code, true);

    if (start === end) {
      // Single cursor case
      if (!isShift) {
        const newCode = code.substring(0, start) + "    " + code.substring(end);
        setCode(newCode);
        
        // Update history internal tracker with new reference
        const hist = getOrCreateHistory(textarea, newCode);
        hist.lastSavedCode = newCode;

        setTimeout(() => {
          textarea.selectionStart = textarea.selectionEnd = start + 4;
        }, 0);
      } else {
        // Shift+Tab single cursor: unindent the current line
        const beforeCursor = code.substring(0, start);
        const linesBefore = beforeCursor.split('\n');
        const currentLine = linesBefore[linesBefore.length - 1];

        const spacesMatch = currentLine.match(/^(\s{0,4})/);
        const spacesToRemove = spacesMatch ? spacesMatch[1].length : 0;

        if (spacesToRemove > 0) {
          const updatedLine = currentLine.slice(spacesToRemove);
          linesBefore[linesBefore.length - 1] = updatedLine;
          const newBefore = linesBefore.join('\n');
          const newCode = newBefore + code.substring(end);
          setCode(newCode);

          const hist = getOrCreateHistory(textarea, newCode);
          hist.lastSavedCode = newCode;

          setTimeout(() => {
            textarea.selectionStart = textarea.selectionEnd = Math.max(0, start - spacesToRemove);
          }, 0);
        }
      }
    } else {
      // Multiple lines / Block selection case
      const beforeSelection = code.substring(0, start);
      const afterSelection = code.substring(end);

      const linesBefore = beforeSelection.split('\n');
      const firstLineFragment = linesBefore[linesBefore.length - 1];
      const startOfFirstLine = start - firstLineFragment.length;

      const fullSelection = code.substring(startOfFirstLine, end);
      const selLines = fullSelection.split('\n');

      let deltaStart = 0;
      let deltaEnd = 0;

      const processedLines = selLines.map((line, idx) => {
        if (!isShift) {
          const indented = "    " + line;
          if (idx === 0) deltaStart += 4;
          deltaEnd += 4;
          return indented;
        } else {
          const match = line.match(/^(\s{0,4})/);
          const spacesToRemove = match ? match[1].length : 0;
          const unindented = line.slice(spacesToRemove);
          if (idx === 0) deltaStart -= spacesToRemove;
          deltaEnd -= spacesToRemove;
          return unindented;
        }
      });

      const newCode = code.substring(0, startOfFirstLine) + processedLines.join('\n') + afterSelection;
      setCode(newCode);

      const hist = getOrCreateHistory(textarea, newCode);
      hist.lastSavedCode = newCode;

      setTimeout(() => {
        textarea.selectionStart = Math.max(startOfFirstLine, start + deltaStart);
        textarea.selectionEnd = Math.max(startOfFirstLine, end + deltaEnd);
      }, 0);
    }
    return;
  }

  // 5. Enter Key Handling (Auto-indentation)
  if (e.key === 'Enter') {
    e.preventDefault();

    // Force save history before modify
    saveHistory(textarea, code, true);

    const beforeCursor = code.substring(0, start);
    const afterCursor = code.substring(end);
    const lines = beforeCursor.split('\n');
    const currentLine = lines[lines.length - 1];

    const match = currentLine.match(/^(\s*)/);
    let indent = match ? match[1] : '';

    if (currentLine.trim().endsWith(':')) {
      indent += '    ';
    }

    const replacement = '\n' + indent;
    const newCode = beforeCursor + replacement + afterCursor;
    setCode(newCode);

    const hist = getOrCreateHistory(textarea, newCode);
    hist.lastSavedCode = newCode;

    setTimeout(() => {
      textarea.selectionStart = textarea.selectionEnd = start + replacement.length;
    }, 0);
    return;
  }
}
