/**
 * Custom Client-Side Python Execution Sandbox for PyFlow.
 * Transpiles simple Python constructs into clean, sandbox-executed JavaScript.
 * Captures variables, print outputs, assertions, and mocks popular python modules
 * like numpy, pandas, requests, beautifulsoup, sqlite3, scikit-learn, etc.
 */

// Helper to translate a single python line to javascript
function translateExpression(expr: string): string {
  let res = expr.trim();
  
  // Replace Python basic boolean keywords with margins
  res = res.replace(/\bTrue\b/g, 'true');
  res = res.replace(/\bFalse\b/g, 'false');
  res = res.replace(/\bNone\b/g, 'null');
  res = res.replace(/\band\b/g, '&&');
  res = res.replace(/\bor\b/g, '||');
  res = res.replace(/\bnot\b/g, '!');

  // Match items(), keys(), values()
  res = res.replace(/\b([a-zA-Z0-9_]+)\.items\(\)/g, 'Object.entries($1)');
  res = res.replace(/\b([a-zA-Z0-9_]+)\.keys\(\)/g, 'Object.keys($1)');
  res = res.replace(/\b([a-zA-Z0-9_]+)\.values\(\)/g, 'Object.values($1)');

  return res;
}

export function transpilePythonToJS(pythonCode: string): { jsCode: string; lineMap: Record<number, number> } {
  const lines = pythonCode.split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [0];
  const lineMap: Record<number, number> = {}; // Maps JS line index (1-based) to Python line index (1-based)
  
  let inClass = false;
  let jsLineCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const orig = lines[i];
    const pythonLineNumber = i + 1;

    // Ignore completely empty lines
    if (orig.trim() === '') {
      jsLines.push('');
      lineMap[jsLineCounter] = pythonLineNumber;
      jsLineCounter++;
      continue;
    }

    // Indentation analysis (tabs treated as 4 spaces)
    let indent = 0;
    for (let char of orig) {
      if (char === ' ') indent++;
      else if (char === '\t') indent += 4;
      else break;
    }

    // Check if we exited a block
    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      const currentIndentSpace = ' '.repeat(indentStack[indentStack.length - 1]);
      jsLines.push(`${currentIndentSpace}}`);
      // Assign this brace to the previous python line or current
      lineMap[jsLineCounter] = pythonLineNumber;
      jsLineCounter++;
    }

    let line = orig.trim();

    // Reset class context
    if (line.startsWith('class ')) {
      inClass = true;
    } else if (indent === 0 && !line.startsWith('def ') && !line.startsWith('#') && line !== '') {
      inClass = false;
    }

    // Handle comments
    let inSingleQuote = false;
    let inDoubleQuote = false;
    let commentIndex = -1;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      if (char === "'" && line[j - 1] !== '\\') inSingleQuote = !inSingleQuote;
      if (char === '"' && line[j - 1] !== '\\') inDoubleQuote = !inDoubleQuote;
      if (char === '#' && !inSingleQuote && !inDoubleQuote) {
        commentIndex = j;
        break;
      }
    }

    let comment = '';
    if (commentIndex !== -1) {
      comment = ' // ' + line.substring(commentIndex + 1).trim();
      line = line.substring(0, commentIndex).trim();
    }

    if (line === '') {
      jsLines.push(' '.repeat(indent) + comment);
      lineMap[jsLineCounter] = pythonLineNumber;
      jsLineCounter++;
      continue;
    }

    // Block start detection via ending colon
    let isBlockStart = false;
    if (line.endsWith(':')) {
      isBlockStart = true;
      line = line.substring(0, line.length - 1).trim();
    }

    // Replace f-strings
    line = line.replace(/\bf"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_, content) => {
      return '`' + content.replace(/\{/g, '${') + '`';
    });
    line = line.replace(/\bf'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, content) => {
      return '`' + content.replace(/\{/g, '${') + '`';
    });

    // Replace other string replacements or values
    // self. -> this.
    line = line.replace(/\bself\./g, 'this.');

    let translated = '';

    // Class definition
    if (line.startsWith('class ')) {
      const classMatch = line.match(/^class\s+([a-zA-Z0-9_]+)(?:\(([a-zA-Z0-9_]+)\))?$/);
      if (classMatch) {
         const className = classMatch[1];
         const baseClass = classMatch[2];
         translated = baseClass ? `class ${className} extends ${baseClass}` : `class ${className}`;
      } else {
         translated = line; // fallback
      }
    }
    // Function definition
    else if (line.startsWith('def ')) {
      const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\((.*)\)$/);
      if (defMatch) {
        let funcName = defMatch[1];
        let paramsStr = defMatch[2].trim();

        // Strip self
        if (paramsStr.startsWith('self,') || paramsStr === 'self') {
          paramsStr = paramsStr.substring(5).trim();
        } else if (paramsStr.startsWith('self ,')) {
          paramsStr = paramsStr.substring(6).trim();
        }

        // Python constructor __init__ maps to JS constructor
        if (funcName === '__init__') {
          translated = `constructor(${paramsStr})`;
        } else {
          translated = inClass ? `${funcName}(${paramsStr})` : `function ${funcName}(${paramsStr})`;
        }
      } else {
        translated = line;
      }
    }
    // Loop processing
    else if (line.startsWith('for ')) {
      const forMatch = line.match(/^for\s+(.+?)\s+in\s+(.+)$/);
      if (forMatch) {
        let loopVars = forMatch[1].trim();
        let iterable = forMatch[2].trim();

        // Handle list unpack variables e.g. key, val -> [key, val]
        if (loopVars.includes(',') && !loopVars.startsWith('[') && !loopVars.startsWith('(')) {
          loopVars = `[${loopVars}]`;
        }

        // Handle range translation
        if (iterable.startsWith('range(')) {
          iterable = iterable.replace('range(', '_range(');
        } else {
          iterable = translateExpression(iterable);
        }

        translated = `for (let ${loopVars} of ${iterable})`;
      } else {
        translated = line;
      }
    }
    // While loop
    else if (line.startsWith('while ')) {
      const cond = translateExpression(line.substring(6).trim());
      translated = `while (${cond})`;
    }
    // If/ elif/ else statements
    else if (line.startsWith('if ')) {
      const cond = translateExpression(line.substring(3).trim());
      translated = `if (${cond})`;
    } else if (line.startsWith('elif ')) {
      const cond = translateExpression(line.substring(5).trim());
      translated = `} else if (${cond})`;
    } else if (line === 'else') {
      translated = `} else`;
    }
    // Assert statements
    else if (line.startsWith('assert ')) {
      const assertion = translateExpression(line.substring(7).trim());
      translated = `if (!(${assertion})) { throw new Error('AssertionError'); }`;
    }
    // Library Imports (safe mock imports)
    else if (line.startsWith('import ') || line.startsWith('from ')) {
      // Keep import lines but treat as mock assignments/silent actions in sandbox
      translated = `// Import: ${line}`;
    }
    // Ordinary statements
    else {
      translated = translateExpression(line);
    }

    const spaces = ' '.repeat(indent);
    if (isBlockStart) {
      // Find what code indent level the next line will have to push to stack
      let nextIndent = indent + 4; // default jump
      for (let k = i + 1; k < lines.length; k++) {
        if (lines[k].trim() !== '') {
          let nextLineIndent = 0;
          for (let char of lines[k]) {
            if (char === ' ') nextLineIndent++;
            else if (char === '\t') nextLineIndent += 4;
            else break;
          }
          if (nextLineIndent > indent) {
            nextIndent = nextLineIndent;
          }
          break;
        }
      }
      indentStack.push(nextIndent);
      jsLines.push(`${spaces}${translated} {${comment}`);
    } else {
      jsLines.push(`${spaces}${translated};${comment}`);
    }

    lineMap[jsLineCounter] = pythonLineNumber;
    jsLineCounter++;
  }

  // Close any stray open blocks
  while (indentStack.length > 1) {
    indentStack.pop();
    const currentIndentSpace = ' '.repeat(indentStack[indentStack.length - 1]);
    jsLines.push(`${currentIndentSpace}}`);
    lineMap[jsLineCounter] = lines.length;
    jsLineCounter++;
  }

  return {
    jsCode: jsLines.join('\n'),
    lineMap
  };
}

export interface PythonRunResult {
  stdout: string;
  success: boolean;
  error?: string;
  variables: Record<string, any>;
}

export function runPythonCode(pythonCode: string): PythonRunResult {
  const stdout: string[] = [];
  const log = (...args: any[]) => {
    stdout.push(args.join(' '));
  };

  // Pre-analyse Python code to detect any variables assigned globally so we can pre-declare or sandbox them cleanly
  const matches = pythonCode.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)\s*/g);
  const declaredVars = new Set<string>();
  const pythonKeywords = [
    'if', 'elif', 'else', 'for', 'while', 'def', 'class', 'import', 'from',
    'return', 'and', 'or', 'not', 'in', 'is', 'lambda', 'with', 'as',
    'try', 'except', 'pass', 'break', 'continue', 'True', 'False', 'None'
  ];

  for (const match of matches) {
    const varName = match[1];
    if (!pythonKeywords.includes(varName)) {
      declaredVars.add(varName);
    }
  }

  // Transpile Code
  const { jsCode, lineMap } = transpilePythonToJS(pythonCode);

  // Extend standard JS arrays with Python methods inside sandbox frame
  const arrayProtoBackup: Record<string, any> = {};
  const patchArrayPrototypes = () => {
    const arrProto = Array.prototype as any;
    
    arrayProtoBackup.append = arrProto.append;
    arrayProtoBackup.insert = arrProto.insert;
    arrayProtoBackup.remove = arrProto.remove;
    arrayProtoBackup.clear = arrProto.clear;

    arrProto.append = function(item: any) {
      this.push(item);
      return this;
    };
    arrProto.insert = function(index: number, item: any) {
      this.splice(index, 0, item);
      return this;
    };
    arrProto.remove = function(item: any) {
      const idx = this.indexOf(item);
      if (idx !== -1) {
        this.splice(idx, 1);
      } else {
        throw new Error(`ValueError: list.remove(x): x not in list`);
      }
      return this;
    };
    arrProto.clear = function() {
      this.length = 0;
      return this;
    };
  };

  const restoreArrayPrototypes = () => {
    const arrProto = Array.prototype as any;
    arrProto.append = arrayProtoBackup.append;
    arrProto.insert = arrayProtoBackup.insert;
    arrProto.remove = arrayProtoBackup.remove;
    arrProto.clear = arrayProtoBackup.clear;
  };

  // Build Python Environment Builtins & Mocks
  const printShim = (...args: any[]) => {
    const out = args.map(x => {
      if (x === null) return 'None';
      if (x === true) return 'True';
      if (x === false) return 'False';
      if (typeof x === 'object') {
        if (Array.isArray(x)) {
          return '[' + x.map(el => typeof el === 'string' ? `'${el}'` : String(el)).join(', ') + ']';
        }
        return JSON.stringify(x); // simplied dictionary
      }
      return String(x);
    }).join(' ');
    stdout.push(out);
  };

  const _range = (start: number, stop?: number, step?: number) => {
    let finalStart = start;
    let finalStop = stop;
    let finalStep = step === undefined ? 1 : step;

    if (stop === undefined) {
      finalStop = start;
      finalStart = 0;
    }

    const res: number[] = [];
    if (finalStep > 0) {
      for (let i = finalStart; i < (finalStop ?? 0); i += finalStep) {
        res.push(i);
      }
    } else {
      for (let i = finalStart; i > (finalStop ?? 0); i += finalStep) {
        res.push(i);
      }
    }
    return res;
  };

  const len = (x: any) => {
    if (x === null || x === undefined) return 0;
    if (typeof x === 'string' || Array.isArray(x)) return x.length;
    if (x instanceof Set || x instanceof Map) return x.size;
    if (typeof x === 'object') return Object.keys(x).length;
    return 0;
  };

  const sum = (iterable: number[]) => {
    if (!Array.isArray(iterable)) return 0;
    return iterable.reduce((a, b) => a + Number(b), 0);
  };

  const enumerate = (iterable: any) => {
    const arr = Array.isArray(iterable) ? iterable : Object.values(iterable);
    return arr.map((value, index) => [index, value]);
  };

  const abs = (x: number) => Math.abs(x);
  const min = (...args: any[]) => {
    if (args.length === 1 && Array.isArray(args[0])) {
      return Math.min(...args[0]);
    }
    return Math.min(...args);
  };
  const max = (...args: any[]) => {
    if (args.length === 1 && Array.isArray(args[0])) {
      return Math.max(...args[0]);
    }
    return Math.max(...args);
  };
  const round = (x: number, digits = 0) => {
    const factor = Math.pow(10, digits);
    return Math.round(x * factor) / factor;
  };

  const sorted = (iterable: any) => {
    if (!iterable) return [];
    const arr = Array.isArray(iterable) ? [...iterable] : (typeof iterable === 'string' ? iterable.split('') : Object.values(iterable));
    return arr.sort((a: any, b: any) => {
      if (typeof a === 'number' && typeof b === 'number') {
        return a - b;
      }
      return String(a).localeCompare(String(b));
    });
  };

  // MOCK MODULES
  const np = {
    array: (list: number[]) => ({
      _data: list,
      mean: () => list.reduce((a, b) => a + b, 0) / list.length,
      sum: () => list.reduce((a, b) => a + b, 0),
      std: () => {
        const m = list.reduce((a, b) => a + b, 0) / list.length;
        return Math.sqrt(list.map(x => Math.pow(x - m, 2)).reduce((a, b) => a + b, 0) / list.length);
      },
      max: () => Math.max(...list),
      min: () => Math.min(...list),
      toString: () => `array([${list.join(', ')}])`
    }),
    mean: (arr: any) => arr.mean ? arr.mean() : (arr.reduce((a:number,b:number)=>a+b, 0)/arr.length),
    sum: (arr: any) => arr.sum ? arr.sum() : (arr.reduce((a:number,b:number)=>a+b, 0)),
    std: (arr: any) => arr.std ? arr.std() : 0,
  };

  const pd = {
    Series: (list: any[], index?: any[]) => ({
      _data: list,
      _index: index || list.map((_, i) => i),
      mean: () => list.reduce((a, b) => a + b, 0) / list.length,
      toString: () => {
        const idx = index || list.map((_, i) => i);
        return list.map((x, i) => `${idx[i]}    ${x}`).join('\n') + `\ndtype: ${typeof list[0]}`;
      }
    }),
    DataFrame: (data: Record<string, any[]>) => {
      const keys = Object.keys(data);
      const rowsCount = data[keys[0]] ? data[keys[0]].length : 0;
      return {
        _data: data,
        head: (n = 5) => {
          const header = '   \t' + keys.join('\t');
          const rows = [];
          for (let i = 0; i < Math.min(n, rowsCount); i++) {
            rows.push(`${i}\t` + keys.map(k => data[k][i]).join('\t'));
          }
          return header + '\n' + rows.join('\n');
        },
        describe: () => {
          return `Describe simulation:\nColumns: ${keys.join(', ')}\nRows count: ${rowsCount}`;
        },
        toString: () => {
          const header = '   \t' + keys.join('\t');
          const rows = [];
          for (let i = 0; i < rowsCount; i++) {
            rows.push(`${i}\t` + keys.map(k => data[k][i]).join('\t'));
          }
          return header + '\n' + rows.join('\n');
        }
      };
    }
  };

  const requests = {
    get: (url: string) => ({
      status_code: 200,
      text: `<html><body><h1>Bienvenue sur ${url}</h1><p class="description">Ceci est une simulation de scrap de page web.</p><div id="content">Données extraites avec succès !</div><a href="/source-1">Lien 1</a><a href="/source-2">Lien 2</a></body></html>`,
      json: () => ({ status: "success", data: "API Response Sim" })
    })
  };

  class BS4Node {
    htmlCode = '';
    constructor(htmlCode: string) {
      this.htmlCode = htmlCode;
    }
    find(tag: string, attrs?: any) {
      if (tag === 'h1') {
        const match = this.htmlCode.match(/<h1>(.*?)<\/h1>/);
        return match ? { text: match[1], toString: () => match[0] } : null;
      }
      if (tag === 'p') {
        const match = this.htmlCode.match(/<p.*?>(.*?)<\/p>/);
        return match ? { text: match[1], toString: () => match[0] } : null;
      }
      return null;
    }
    find_all(tag: string) {
      const results: any[] = [];
      if (tag === 'a') {
        const regex = /<a href="(.*?)">(.*?)<\/a>/g;
        let match;
        while ((match = regex.exec(this.htmlCode)) !== null) {
          results.push({
            get: (attr: string) => attr === 'href' ? match![1] : '',
            text: match![2],
            toString: () => match![0]
          });
        }
      }
      return results;
    }
    get text() {
      return this.htmlCode.replace(/<[^>]*>/g, '').trim();
    }
  }

  const BeautifulSoup = (html: string) => new BS4Node(html);

  const sqlite3 = {
    connect: (dbname: string) => ({
      cursor: () => ({
        execute: (sql: string) => {},
        fetchall: () => [[1, "Alice", "alice@example.com"], [2, "Bob", "bob@example.com"]],
        fetchone: () => [1, "Alice", "alice@example.com"]
      }),
      commit: () => {},
      close: () => {}
    })
  };

  class LinearRegression {
    coef_ = [0.85];
    intercept_ = 1.2;
    fit(X: any, y: any) { return this; }
    predict(X: any) {
      return X.map((x: any) => (Array.isArray(x) ? x[0] : x) * 0.85 + 1.2);
    }
  }

  // Pre-declared variables block
  let preDeclarations = '';
  if (declaredVars.size > 0) {
    preDeclarations = `let ${Array.from(declaredVars).join(', ')};`;
  }

  // Final JS Execution Package
  // We place code inside immediately-invoked function expression (IIFE) 
  // and inject variables inside an execution wrapper.
  const completeExecutionCode = `
    const { log, print, _range, len, sum, enumerate, abs, min, max, round, sorted, np, pd, requests, BeautifulSoup, sqlite3, LinearRegression } = env;
    ${preDeclarations}
    try {
      ${jsCode}
      
      // Collect variables for outcome validation
      const finalVars = {};
      ${Array.from(declaredVars).map(v => `try { finalVars['${v}'] = ${v}; } catch(e){}`).join('\n')}
      return { success: true, variables: finalVars };
    } catch(err) {
      return { success: false, error: err };
    }
  `;

  patchArrayPrototypes();

  let executionResult: { success: boolean; variables: Record<string, any>; error?: any };
  try {
    const fn = new Function('env', completeExecutionCode);
    executionResult = fn({
      log,
      print: printShim,
      _range,
      len,
      sum,
      enumerate,
      abs,
      min,
      max,
      round,
      sorted,
      np,
      pd,
      requests,
      BeautifulSoup,
      sqlite3,
      LinearRegression
    });
  } catch (error: any) {
    executionResult = { success: false, variables: {}, error };
  } finally {
    restoreArrayPrototypes();
  }

  if (executionResult.success) {
    return {
      stdout: stdout.join('\n'),
      success: true,
      variables: executionResult.variables
    };
  } else {
    // Format beautiful Python SyntaxError or RuntimeError traceback!
    const err = executionResult.error;
    let originalLineNumber = 1;
    let message = err ? err.message : 'UnknownError';
    
    // Parse JS error stack to reconstruct python line number
    if (err && err.stack) {
      const matchesStack = err.stack.match(/<anonymous>:(\d+):(\d+)/) || err.stack.match(/eval:(\d+):(\d+)/);
      if (matchesStack) {
        const jsLineNo = parseInt(matchesStack[1], 10);
        // Map back to Python code line
        originalLineNumber = lineMap[jsLineNo] || originalLineNumber;
      }
    }

    // Format traceback
    const traceback = [
      `Traceback (most recent call last):`,
      `  File "<string>", line ${originalLineNumber}, in <module>`,
      `    ${pythonCode.split('\n')[originalLineNumber - 1]?.trim() || ''}`,
      `${err?.name || 'RuntimeError'}: ${message}`
    ].join('\n');

    return {
      stdout: stdout.join('\n'),
      success: false,
      error: traceback,
      variables: {}
    };
  }
}
