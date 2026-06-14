import React from 'react';

// Python language specifications
const KEYWORDS = [
  'def', 'class', 'if', 'elif', 'else', 'while', 'for', 'in', 'and', 'or', 'not',
  'break', 'continue', 'return', 'import', 'from', 'as', 'try', 'except', 'finally',
  'raise', 'assert', 'with', 'global', 'nonlocal', 'lambda', 'pass', 'del', 'yield',
  'is'
];

const CONSTANTS = ['True', 'False', 'None'];

const BUILTINS = [
  'print', 'input', 'range', 'len', 'int', 'str', 'float', 'bool', 'list',
  'dict', 'set', 'tuple', 'sum', 'max', 'min', 'abs', 'open', 'type', 'enumerate',
  'zip', 'any', 'all', 'sorted', 'map', 'filter'
];

export interface Token {
  type: 'keyword' | 'constant' | 'builtin' | 'comment' | 'string' | 'number' | 'operator' | 'fnCall' | 'identifier' | 'text';
  text: string;
}

/**
 * Tokenize Python code into categorized tokens for styling
 */
export function tokenizePython(code: string): Token[] {
  const tokenRegex = new RegExp([
    // Comments
    `(?<comment>#[^\\r\\n]*)`,
    // Triple double-quoted strings
    `(?<multilineStringD>"""[\\s\\S]*?""")`,
    // Triple single-quoted strings
    `(?<multilineStringS>'''[\\s\\S]*?''')`,
    // Strings double-quotes (f-strings or standard strings)
    `(?<stringD>f?"(?:\\\\.|[^"\\\\])*")`,
    // Strings single-quotes (f-strings or standard strings)
    `(?<stringS>f?'(?:\\\\.|[^'\\\\])*')`,
    // Function calls or definitions before parentheses
    `(?<fnCall>\\b[a-zA-Z_][a-zA-Z0-9_]*(?=\\s*\\()\\b)`,
    // Numbers
    `(?<number>\\b\\d+(?:\\.\\d+)?\\b)`,
    // Word identifiers / keywords
    `(?<word>\\b[a-zA-Z_][a-zA-Z0-9_]*\\b)`,
    // Operators
    `(?<operator>[+\\-*/%=<>!&|^~]+)`
  ].join('|'), 'g');

  const tokens: Token[] = [];
  let lastIndex = 0;
  let match;

  while ((match = tokenRegex.exec(code)) !== null) {
    // Plain text before the match
    if (match.index > lastIndex) {
      tokens.push({
        type: 'text',
        text: code.slice(lastIndex, match.index)
      });
    }

    const groups = match.groups as Record<string, string | undefined>;
    if (groups.comment) {
      tokens.push({ type: 'comment', text: groups.comment });
    } else if (groups.multilineStringD) {
      tokens.push({ type: 'string', text: groups.multilineStringD });
    } else if (groups.multilineStringS) {
      tokens.push({ type: 'string', text: groups.multilineStringS });
    } else if (groups.stringD) {
      tokens.push({ type: 'string', text: groups.stringD });
    } else if (groups.stringS) {
      tokens.push({ type: 'string', text: groups.stringS });
    } else if (groups.fnCall) {
      const fnName = groups.fnCall;
      if (KEYWORDS.includes(fnName)) {
        tokens.push({ type: 'keyword', text: fnName });
      } else if (BUILTINS.includes(fnName)) {
        tokens.push({ type: 'builtin', text: fnName });
      } else {
        tokens.push({ type: 'fnCall', text: fnName });
      }
    } else if (groups.number) {
      tokens.push({ type: 'number', text: groups.number });
    } else if (groups.word) {
      const word = groups.word;
      if (KEYWORDS.includes(word)) {
        tokens.push({ type: 'keyword', text: word });
      } else if (CONSTANTS.includes(word)) {
        tokens.push({ type: 'constant', text: word });
      } else if (BUILTINS.includes(word)) {
        tokens.push({ type: 'builtin', text: word });
      } else {
        tokens.push({ type: 'identifier', text: word });
      }
    } else if (groups.operator) {
      tokens.push({ type: 'operator', text: groups.operator });
    }

    lastIndex = tokenRegex.lastIndex;
  }

  if (lastIndex < code.length) {
    tokens.push({
      type: 'text',
      text: code.slice(lastIndex)
    });
  }

  return tokens;
}

/**
 * Returns customized Tailwind utility CSS class depending on the token type and color scheme
 */
export function getTokenClass(type: Token['type'], isDark: boolean = true): string {
  if (isDark) {
    switch (type) {
      case 'keyword':
        return 'text-fuchsia-400 font-bold';
      case 'constant':
        return 'text-amber-400 font-semibold';
      case 'builtin':
        return 'text-sky-350 font-semibold';
      case 'fnCall':
        return 'text-blue-400';
      case 'comment':
        return 'text-slate-500 italic';
      case 'string':
        return 'text-emerald-400';
      case 'number':
        return 'text-amber-300';
      case 'operator':
        return 'text-pink-400';
      case 'identifier':
        return 'text-slate-100';
      default:
        return 'text-slate-300';
    }
  } else {
    // Light scheme (e.g. for light inline codes or text inputs if needed)
    switch (type) {
      case 'keyword':
        return 'text-fuchsia-700 font-bold';
      case 'constant':
        return 'text-amber-700 font-bold';
      case 'builtin':
        return 'text-sky-700 font-bold';
      case 'fnCall':
        return 'text-blue-700';
      case 'comment':
        return 'text-slate-500 italic';
      case 'string':
        return 'text-emerald-700';
      case 'number':
        return 'text-amber-600';
      case 'operator':
        return 'text-pink-600';
      case 'identifier':
        return 'text-slate-800';
      default:
        return 'text-slate-700';
    }
  }
}

interface PythonHighlighterProps {
  code: string;
  isDark?: boolean;
}

/**
 * React Component to render Python code with beautiful text highlighting
 */
export const PythonHighlighter: React.FC<PythonHighlighterProps> = ({ code, isDark = true }) => {
  const tokens = tokenizePython(code);

  return (
    <>
      {tokens.map((token, index) => {
        const className = getTokenClass(token.type, isDark);
        if (token.type === 'text' || !className) {
          return <span key={index}>{token.text}</span>;
        }
        return (
          <span key={index} className={className}>
            {token.text}
          </span>
        );
      })}
    </>
  );
};
