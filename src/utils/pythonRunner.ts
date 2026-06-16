/**
 * Safe client-side Python execution sandbox using Pyodide (WebAssembly).
 * Runs real CPython inside the browser and mocks popular libraries (numpy, pandas, etc.)
 * for lightweight and fast execution.
 * Includes a robust offline/timeout fallback to the lightweight PyFlow transpiler.
 */

declare global {
  interface Window {
    loadPyodide: (config: { indexURL: string }) => Promise<any>;
  }
}

let pyodideInstance: any = null;
let pyodideLoadingPromise: Promise<any> | null = null;
let useFallbackEngine = false;

// Python code to register mock modules in sys.modules
const MOCK_MODULES_CODE = `
import sys
from types import ModuleType

# 1. Mock numpy
np = ModuleType('numpy')
class MockArray:
    def __init__(self, data):
        self._data = data
    def mean(self):
        return sum(self._data) / len(self._data)
    def sum(self):
        return sum(self._data)
    def std(self):
        m = self.mean()
        return (sum((x - m)**2 for x in self._data) / len(self._data))**0.5
    def max(self):
        return max(self._data)
    def min(self):
        return min(self._data)
    def __str__(self):
        return f"array({self._data})"
    def __repr__(self):
        return self.__str__()
np.array = MockArray
np.mean = lambda arr: arr.mean() if hasattr(arr, 'mean') else sum(arr)/len(arr)
np.sum = lambda arr: arr.sum() if hasattr(arr, 'sum') else sum(arr)
np.std = lambda arr: arr.std() if hasattr(arr, 'std') else 0
sys.modules['numpy'] = np

# 2. Mock pandas
pd = ModuleType('pandas')
class MockSeries:
    def __init__(self, data, index=None):
        self._data = data
        self._index = index or list(range(len(data)))
    def mean(self):
        return sum(self._data) / len(self._data)
    def __str__(self):
        idx = self._index
        lines = [f"{idx[i]}    {x}" for i, x in enumerate(self._data)]
        lines.append(f"dtype: {type(self._data[0]).__name__}")
        return "\\n".join(lines)
    def __repr__(self):
        return self.__str__()
class MockDataFrame:
    def __init__(self, data):
        self._data = data
        self.keys = list(data.keys())
        self.rows_count = len(data[self.keys[0]]) if self.keys else 0
    def head(self, n=5):
        header = "   \\t" + "\\t".join(self.keys)
        rows = []
        for i in range(min(n, self.rows_count)):
            rows.append(f"{i}\\t" + "\\t".join(str(self._data[k][i]) for k in self.keys))
        return header + "\\n" + "\\n".join(rows)
    def describe(self):
        return f"Describe simulation:\\nColumns: {', '.join(self.keys)}\\nRows count: {self.rows_count}"
    def __str__(self):
        header = "   \\t" + "\\t".join(self.keys)
        rows = []
        for i in range(self.rows_count):
            rows.append(f"{i}\\t" + "\\t".join(str(self._data[k][i]) for k in self.keys))
        return header + "\\n" + "\\n".join(rows)
    def __repr__(self):
        return self.__str__()
pd.Series = MockSeries
pd.DataFrame = MockDataFrame
sys.modules['pandas'] = pd

# 3. Mock requests
requests = ModuleType('requests')
class MockResponse:
    def __init__(self, url):
        self.status_code = 200
        self.text = f"<html><body><h1>Bienvenue sur {url}</h1><p class='description'>Ceci est une simulation de scrap de page web.</p><div id='content'>Données extraites avec succès !</div><a href='/source-1'>Lien 1</a><a href='/source-2'>Lien 2</a></body></html>"
    def json(self):
        return {"status": "success", "data": "API Response Sim"}
requests.get = lambda url: MockResponse(url)
sys.modules['requests'] = requests

# 4. Mock BeautifulSoup
bs4 = ModuleType('bs4')
class MockBS4Node:
    def __init__(self, html_code):
        self.htmlCode = html_code
    def find(self, tag, attrs=None):
        import re
        if tag == 'h1':
            m = re.search(r'<h1>(.*?)</h1>', self.htmlCode)
            return type('Node', (), {'text': m.group(1), '__str__': lambda s: m.group(0), '__repr__': lambda s: m.group(0)})() if m else None
        if tag == 'p':
            m = re.search(r'<p.*?>(.*?)</p>', self.htmlCode)
            return type('Node', (), {'text': m.group(1), '__str__': lambda s: m.group(0), '__repr__': lambda s: m.group(0)})() if m else None
        return None
    def find_all(self, tag):
        import re
        results = []
        if tag == 'a':
            matches = re.finditer(r'<a href="(.*?)">(.*?)</a>', self.htmlCode)
            for m in matches:
                href, text = m.group(1), m.group(2)
                results.append(type('Node', (), {
                    'get': lambda s, attr: href if attr == 'href' else '',
                    'text': text,
                    '__str__': lambda s: m.group(0),
                    '__repr__': lambda s: m.group(0)
                })())
        return results
    @property
    def text(self):
        import re
        return re.sub(r'<[^>]*>', '', self.htmlCode).strip()
bs4.BeautifulSoup = lambda html, *args, **kwargs: MockBS4Node(html)
sys.modules['bs4'] = bs4

# 5. Mock sqlite3
sqlite3 = ModuleType('sqlite3')
class MockCursor:
    def execute(self, query): pass
    def fetchall(self): return [[1, "Alice", "alice@example.com"], [2, "Bob", "bob@example.com"]]
    def fetchone(self): return [1, "Alice", "alice@example.com"]
class MockConnection:
    def cursor(self): return MockCursor()
    def commit(self): pass
    def close(self): pass
sqlite3.connect = lambda dbname: MockConnection()
sys.modules['sqlite3'] = sqlite3

# 6. Mock sklearn.linear_model
sklearn = ModuleType('sklearn')
linear_model = ModuleType('sklearn.linear_model')
class MockLinearRegression:
    def __init__(self):
        self.coef_ = [0.85]
        self.intercept_ = 1.2
    def fit(self, X, y): return self
    def predict(self, X):
        return [x[0] * 0.85 + 1.2 if isinstance(x, (list, tuple)) else x * 0.85 + 1.2 for x in X]
linear_model.LinearRegression = MockLinearRegression
sys.modules['sklearn'] = sklearn
sys.modules['sklearn.linear_model'] = linear_model
`;

/**
 * Initializes and loads Pyodide dynamically with safety timeouts.
 */
export async function getPyodide() {
  if (pyodideInstance) return pyodideInstance;

  if (pyodideLoadingPromise) {
    return pyodideLoadingPromise;
  }

  pyodideLoadingPromise = new Promise<any>(async (resolve, reject) => {
    // 4-second timeout to check if jsdelivr can be reached.
    const timeoutId = setTimeout(() => {
      useFallbackEngine = true;
      pyodideLoadingPromise = null;
      reject(new Error("Timeout: Pyodide took too long to load. Switching to PyFlow Lite."));
    }, 4000);

    try {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/pyodide.js";
        script.async = true;
        
        script.onerror = () => {
          clearTimeout(timeoutId);
          useFallbackEngine = true;
          pyodideLoadingPromise = null;
          reject(new Error("Network Error: Could not download Pyodide CDN. Switching to PyFlow Lite."));
        };
        
        document.head.appendChild(script);

        await new Promise((res, rej) => {
          script.onload = res;
          script.onerror = rej;
        });
      }

      const pyodide = await window.loadPyodide({
        indexURL: "https://cdn.jsdelivr.net/pyodide/v0.26.1/full/"
      });

      // Execute mock modules configuration
      await pyodide.runPythonAsync(MOCK_MODULES_CODE);

      clearTimeout(timeoutId);
      pyodideInstance = pyodide;
      resolve(pyodide);
    } catch (err) {
      clearTimeout(timeoutId);
      useFallbackEngine = true;
      pyodideLoadingPromise = null;
      reject(err);
    }
  });

  return pyodideLoadingPromise;
}

export interface PythonRunResult {
  stdout: string;
  success: boolean;
  error?: string;
  variables: Record<string, any>;
}

/**
 * Runs Python code using Pyodide (asynchronously) with automatic transpiler fallback.
 */
export async function runPythonCode(pythonCode: string, isRepl = false): Promise<PythonRunResult> {
  if (useFallbackEngine) {
    const localRes = runPythonFallback(pythonCode);
    return {
      ...localRes,
      stdout: `[Mode Hors-ligne / PyFlow Lite]\n${localRes.stdout}`
    };
  }

  try {
    const pyodide = await getPyodide();

    // Prepare execution context in Pyodide
    pyodide.globals.set("__user_code__", pythonCode);
    pyodide.globals.set("__is_repl__", isRepl);

    // Wrapper python runner script to capture stdout, stderr, run exec in safe context, and format variables
    const wrapperScript = `
import sys, io, json, traceback

# Redirect standard outputs
sys.stdout = io.StringIO()
sys.stderr = io.StringIO()

# Handle persistent REPL state
if __is_repl__:
    if not hasattr(sys, 'repl_globals'):
        sys.repl_globals = globals().copy()
        sys.repl_globals['__name__'] = '__main__'
    student_globals = sys.repl_globals
else:
    student_globals = globals().copy()
    student_globals['__name__'] = '__main__'

success = True
error_msg = ""

try:
    exec(__user_code__, student_globals)
except Exception as e:
    success = False
    # Clean traceback to only show user code frame if possible
    tb_lines = traceback.format_exception(*sys.exc_info())
    if len(tb_lines) > 1:
        # Filter out the first traceback lines referencing exec wrapper
        tb_lines = [tb_lines[0]] + tb_lines[2:]
    error_msg = "".join(tb_lines)

captured_stdout = sys.stdout.getvalue()
captured_stderr = sys.stderr.getvalue()

# Extract student variables (excluding internals, modules, and functions)
variables = {}
for k, v in student_globals.items():
    if k.startswith('_') or k in ['sys', 'io', 'json', 'traceback', 'student_globals', 'user_code_to_run', '__user_code__', '__is_repl__']:
        continue
    # Exclude basic builtins
    if hasattr(v, '__module__') and v.__module__ == 'builtins':
        continue
    # Exclude function/class/module types
    if type(v).__name__ in ['module', 'function', 'class', 'type', 'method']:
        continue
        
    try:
        # Ensure it is JSON serializable
        json.dumps(v)
        variables[k] = v
    except:
        variables[k] = str(v)

# Return values back to JS
result_json = json.dumps({
    "stdout": captured_stdout + (f"\\n{captured_stderr}" if captured_stderr else ""),
    "success": success,
    "error": error_msg,
    "variables": variables
})
result_json
`;

    const jsonResult = await pyodide.runPythonAsync(wrapperScript);
    const result = JSON.parse(jsonResult);

    return {
      stdout: result.stdout,
      success: result.success,
      error: result.error,
      variables: result.variables
    };
  } catch (err: any) {
    console.warn("Pyodide failed to execute, falling back to local JS transpiler engine:", err);
    useFallbackEngine = true;
    const localRes = runPythonFallback(pythonCode);
    return {
      ...localRes,
      stdout: `[Attention : Moteur PyFlow Lite activé (mode hors-ligne)]\n${localRes.stdout}`
    };
  }
}

/* ==========================================================================
   BACKUP FALLBACK LIGHTWEIGHT PYFLOW TRANSPILER ENGINE (FOR OFFLINE / TIMEOUTS)
   ========================================================================== */

function translateExpression(expr: string): string {
  let res = expr.trim();
  res = res.replace(/\bTrue\b/g, 'true');
  res = res.replace(/\bFalse\b/g, 'false');
  res = res.replace(/\bNone\b/g, 'null');
  res = res.replace(/\band\b/g, '&&');
  res = res.replace(/\bor\b/g, '||');
  res = res.replace(/\bnot\b/g, '!');
  res = res.replace(/\b([a-zA-Z0-9_]+)\.items\(\)/g, 'Object.entries($1)');
  res = res.replace(/\b([a-zA-Z0-9_]+)\.keys\(\)/g, 'Object.keys($1)');
  res = res.replace(/\b([a-zA-Z0-9_]+)\.values\(\)/g, 'Object.values($1)');
  return res;
}

export function transpilePythonToJS(pythonCode: string): { jsCode: string; lineMap: Record<number, number> } {
  const lines = pythonCode.split('\n');
  const jsLines: string[] = [];
  const indentStack: number[] = [0];
  const lineMap: Record<number, number> = {};
  
  let inClass = false;
  let jsLineCounter = 1;

  for (let i = 0; i < lines.length; i++) {
    const orig = lines[i];
    const pythonLineNumber = i + 1;

    if (orig.trim() === '') {
      jsLines.push('');
      lineMap[jsLineCounter] = pythonLineNumber;
      jsLineCounter++;
      continue;
    }

    let indent = 0;
    for (let char of orig) {
      if (char === ' ') indent++;
      else if (char === '\t') indent += 4;
      else break;
    }

    while (indentStack.length > 1 && indent < indentStack[indentStack.length - 1]) {
      indentStack.pop();
      const currentIndentSpace = ' '.repeat(indentStack[indentStack.length - 1]);
      jsLines.push(`${currentIndentSpace}}`);
      lineMap[jsLineCounter] = pythonLineNumber;
      jsLineCounter++;
    }

    let line = orig.trim();

    if (line.startsWith('class ')) {
      inClass = true;
    } else if (indent === 0 && !line.startsWith('def ') && !line.startsWith('#') && line !== '') {
      inClass = false;
    }

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

    let isBlockStart = false;
    if (line.endsWith(':')) {
      isBlockStart = true;
      line = line.substring(0, line.length - 1).trim();
    }

    line = line.replace(/\bf"([^"\\]*(?:\\.[^"\\]*)*)"/g, (_, content) => '`' + content.replace(/\{/g, '${') + '`');
    line = line.replace(/\bf'([^'\\]*(?:\\.[^'\\]*)*)'/g, (_, content) => '`' + content.replace(/\{/g, '${') + '`');
    line = line.replace(/\bself\./g, 'this.');

    let translated = '';

    if (line.startsWith('class ')) {
      const classMatch = line.match(/^class\s+([a-zA-Z0-9_]+)(?:\(([a-zA-Z0-9_]+)\))?$/);
      if (classMatch) {
         const className = classMatch[1];
         const baseClass = classMatch[2];
         translated = baseClass ? `class ${className} extends ${baseClass}` : `class ${className}`;
      } else {
         translated = line;
      }
    } else if (line.startsWith('def ')) {
      const defMatch = line.match(/^def\s+([a-zA-Z0-9_]+)\((.*)\)$/);
      if (defMatch) {
        let funcName = defMatch[1];
        let paramsStr = defMatch[2].trim();
        if (paramsStr.startsWith('self,') || paramsStr === 'self') {
          paramsStr = paramsStr.substring(5).trim();
        } else if (paramsStr.startsWith('self ,')) {
          paramsStr = paramsStr.substring(6).trim();
        }
        translated = funcName === '__init__' ? `constructor(${paramsStr})` : (inClass ? `${funcName}(${paramsStr})` : `function ${funcName}(${paramsStr})`);
      } else {
        translated = line;
      }
    } else if (line.startsWith('for ')) {
      const forMatch = line.match(/^for\s+(.+?)\s+in\s+(.+)$/);
      if (forMatch) {
        let loopVars = forMatch[1].trim();
        let iterable = forMatch[2].trim();
        if (loopVars.includes(',') && !loopVars.startsWith('[') && !loopVars.startsWith('(')) {
          loopVars = `[${loopVars}]`;
        }
        if (iterable.startsWith('range(')) {
          iterable = iterable.replace('range(', '_range(');
        } else {
          iterable = translateExpression(iterable);
        }
        translated = `for (let ${loopVars} of ${iterable})`;
      } else {
        translated = line;
      }
    } else if (line.startsWith('while ')) {
      translated = `while (${translateExpression(line.substring(6).trim())})`;
    } else if (line.startsWith('if ')) {
      translated = `if (${translateExpression(line.substring(3).trim())})`;
    } else if (line.startsWith('elif ')) {
      translated = `} else if (${translateExpression(line.substring(5).trim())})`;
    } else if (line === 'else') {
      translated = `} else`;
    } else if (line.startsWith('assert ')) {
      translated = `if (!(${translateExpression(line.substring(7).trim())})) { throw new Error('AssertionError'); }`;
    } else if (line.startsWith('import ') || line.startsWith('from ')) {
      translated = `// Import: ${line}`;
    } else {
      translated = translateExpression(line);
    }

    const spaces = ' '.repeat(indent);
    if (isBlockStart) {
      let nextIndent = indent + 4;
      for (let k = i + 1; k < lines.length; k++) {
        if (lines[k].trim() !== '') {
          let nextLineIndent = 0;
          for (let char of lines[k]) {
            if (char === ' ') nextLineIndent++;
            else if (char === '\t') nextLineIndent += 4;
            else break;
          }
          if (nextLineIndent > indent) nextIndent = nextLineIndent;
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

  while (indentStack.length > 1) {
    indentStack.pop();
    const currentIndentSpace = ' '.repeat(indentStack[indentStack.length - 1]);
    jsLines.push(`${currentIndentSpace}}`);
    lineMap[jsLineCounter] = lines.length;
    jsLineCounter++;
  }

  return { jsCode: jsLines.join('\n'), lineMap };
}

function runPythonFallback(pythonCode: string): PythonRunResult {
  const stdout: string[] = [];
  const log = (...args: any[]) => stdout.push(args.join(' '));

  const matches = pythonCode.matchAll(/\b([a-zA-Z_][a-zA-Z0-9_]*)\s*=(?!=)\s*/g);
  const declaredVars = new Set<string>();
  const pythonKeywords = [
    'if', 'elif', 'else', 'for', 'while', 'def', 'class', 'import', 'from',
    'return', 'and', 'or', 'not', 'in', 'is', 'lambda', 'with', 'as',
    'try', 'except', 'pass', 'break', 'continue', 'True', 'False', 'None'
  ];

  for (const match of matches) {
    const varName = match[1];
    if (!pythonKeywords.includes(varName)) declaredVars.add(varName);
  }

  const { jsCode, lineMap } = transpilePythonToJS(pythonCode);

  const arrayProtoBackup: Record<string, any> = {};
  const patchArrayPrototypes = () => {
    const arrProto = Array.prototype as any;
    arrayProtoBackup.append = arrProto.append;
    arrayProtoBackup.insert = arrProto.insert;
    arrayProtoBackup.remove = arrProto.remove;
    arrayProtoBackup.clear = arrProto.clear;

    arrProto.append = function(item: any) { this.push(item); return this; };
    arrProto.insert = function(idx: number, item: any) { this.splice(idx, 0, item); return this; };
    arrProto.remove = function(item: any) {
      const idx = this.indexOf(item);
      if (idx !== -1) this.splice(idx, 1);
      else throw new Error("ValueError: list.remove(x): x not in list");
      return this;
    };
    arrProto.clear = function() { this.length = 0; return this; };
  };

  const restoreArrayPrototypes = () => {
    const arrProto = Array.prototype as any;
    if (arrayProtoBackup.append !== undefined) arrProto.append = arrayProtoBackup.append;
    if (arrayProtoBackup.insert !== undefined) arrProto.insert = arrayProtoBackup.insert;
    if (arrayProtoBackup.remove !== undefined) arrProto.remove = arrayProtoBackup.remove;
    if (arrayProtoBackup.clear !== undefined) arrProto.clear = arrayProtoBackup.clear;
  };

  const printShim = (...args: any[]) => log(...args);
  const _range = (start: number, stop?: number, step = 1) => {
    let rStart = start;
    let rStop = stop;
    if (rStop === undefined) {
      rStop = start;
      rStart = 0;
    }
    const result = [];
    for (let i = rStart; step > 0 ? i < rStop : i > rStop; i += step) result.push(i);
    return result;
  };

  const len = (x: any) => x ? (x.length !== undefined ? x.length : Object.keys(x).length) : 0;
  const sum = (x: any) => Array.isArray(x) ? x.reduce((a, b) => a + b, 0) : 0;
  const enumerate = (iterable: any) => {
    const arr = Array.isArray(iterable) ? iterable : Object.values(iterable);
    return arr.map((value, index) => [index, value]);
  };

  const abs = (x: number) => Math.abs(x);
  const min = (...args: any[]) => args.length === 1 && Array.isArray(args[0]) ? Math.min(...args[0]) : Math.min(...args);
  const max = (...args: any[]) => args.length === 1 && Array.isArray(args[0]) ? Math.max(...args[0]) : Math.max(...args);
  const round = (x: number, digits = 0) => {
    const factor = Math.pow(10, digits);
    return Math.round(x * factor) / factor;
  };

  const sorted = (iterable: any) => {
    if (!iterable) return [];
    const arr = Array.isArray(iterable) ? [...iterable] : (typeof iterable === 'string' ? iterable.split('') : Object.values(iterable));
    return arr.sort((a: any, b: any) => typeof a === 'number' && typeof b === 'number' ? a - b : String(a).localeCompare(String(b)));
  };

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
        describe: () => `Describe simulation:\nColumns: ${keys.join(', ')}\nRows count: ${rowsCount}`,
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
    constructor(htmlCode: string) { this.htmlCode = htmlCode; }
    find(tag: string) {
      if (tag === 'h1') {
        const m = this.htmlCode.match(/<h1>(.*?)<\/h1>/);
        return m ? { text: m[1], toString: () => m[0] } : null;
      }
      if (tag === 'p') {
        const m = this.htmlCode.match(/<p.*?>(.*?)<\/p>/);
        return m ? { text: m[1], toString: () => m[0] } : null;
      }
      return null;
    }
    find_all(tag: string) {
      const results: any[] = [];
      if (tag === 'a') {
        const regex = /<a href="(.*?)">(.*?)<\/a>/g;
        let match;
        while ((match = regex.exec(this.htmlCode)) !== null) {
          results.push({ get: (attr: string) => attr === 'href' ? match![1] : '', text: match![2], toString: () => match![0] });
        }
      }
      return results;
    }
    get text() { return this.htmlCode.replace(/<[^>]*>/g, '').trim(); }
  }

  const BeautifulSoup = (html: string) => new BS4Node(html);

  const sqlite3 = {
    connect: () => ({
      cursor: () => ({
        execute: () => {},
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
    fit() { return this; }
    predict(X: any) { return X.map((x: any) => (Array.isArray(x) ? x[0] : x) * 0.85 + 1.2); }
  }

  let preDeclarations = '';
  if (declaredVars.size > 0) {
    preDeclarations = `let ${Array.from(declaredVars).join(', ')};`;
  }

  const completeExecutionCode = `
    const { log, print, _range, len, sum, enumerate, abs, min, max, round, sorted, np, pd, requests, BeautifulSoup, sqlite3, LinearRegression } = env;
    ${preDeclarations}
    try {
      ${jsCode}
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
    const err = executionResult.error;
    let originalLineNumber = 1;
    let message = err ? err.message : 'UnknownError';
    
    if (err && err.stack) {
      const matchesStack = err.stack.match(/<anonymous>:(\d+):(\d+)/) || err.stack.match(/eval:(\d+):(\d+)/);
      if (matchesStack) {
        const jsLineNo = parseInt(matchesStack[1], 10);
        originalLineNumber = lineMap[jsLineNo] || originalLineNumber;
      }
    }

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
