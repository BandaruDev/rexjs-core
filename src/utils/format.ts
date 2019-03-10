import chalk from 'chalk';

const errorLabel = 'Syntax error:';
const exportRegex = /\s*(.+?)\s*(")?export '(.+?)' was not found in '(.+?)'/;
const stackRegex = /^\s*at\s((?!webpack:).)*:\d+:\d+[\s\)]*(\n|$)/gm;

const isLikelyASyntaxError = (str: string) => str.includes(errorLabel);
function formatMessage(message: string, isError: boolean) {
  let lines = message.split('\n');

  if (lines.length > 2 && lines[1] === '') {
    lines.splice(1, 1); // Remove extra newline.
  }

  // Remove loader notation from filenames:
  //   `./~/css-loader!./src/App.css` ~~> `./src/App.css`
  if (lines[0].lastIndexOf('!') !== -1) {
    lines[0] = lines[0].substr(lines[0].lastIndexOf('!') + 1);
  }

  // Remove useless `entry` filename stack details
  lines = lines.filter(line => line.indexOf(' @ ') !== 0);

  // 0 ~> filename; 1 ~> main err msg
  if (!lines[0] || !lines[1]) {
    return lines.join('\n');
  }

  // Cleans up verbose "module not found" messages for files and packages.
  if (lines[1].startsWith('Module not found: ')) {
    lines = [
      lines[0],
      lines[1] // "Module not found: " is enough detail
        .replace("Cannot resolve 'file' or 'directory' ", '')
        .replace('Cannot resolve module ', '')
        .replace('Error: ', '')
        .replace('[CaseSensitivePathsPlugin] ', ''),
    ];
  }

  // Cleans up syntax error messages.
  if (lines[1].startsWith('Module build failed: ')) {
    lines[1] = lines[1].replace('Module build failed: SyntaxError:', errorLabel);
  }

  if (lines[1].match(exportRegex)) {
    lines[1] = lines[1].replace(exportRegex, "$1 '$4' does not contain an export named '$3'.");
  }

  lines[0] = chalk.inverse(lines[0]);

  // Reassemble & Strip internal tracing, except `webpack:` -- (create-react-app/pull/1050)
  return lines
    .join('\n')
    .replace(stackRegex, '')
    .trim();
}

export function processJSON(stats: any) {
  const json = stats;

  const result = {
    errors: json.errors.map((msg: string) => formatMessage(msg, true)),
    warnings: json.warnings.map((msg: string) => formatMessage(msg, false)),
  };
  if (result.errors.some(isLikelyASyntaxError)) {
    result.errors = result.errors.filter(isLikelyASyntaxError);
  }

  if (result.errors.length > 1) {
    result.errors.length = 1;
  }

  return result;
}
