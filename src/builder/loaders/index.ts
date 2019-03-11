import { RuleSetRule } from 'webpack';
import { POST_CSS_LOADER, SASS_LOADER, TS_LINT_LOADER, TS_LOADER } from './default-loaders';
/**
 *
 * @param Loaders
 */
export function registerLoaders(rules: RuleSetRule[]): RuleSetRule[] {
  const rexLoaders: RuleSetRule[] = [];
  rules.forEach(rule => rexLoaders.push(rule));
  return rexLoaders;
}
/**
 * Default Loaders
 */
export const RexLoaders = registerLoaders([
  // TS_LINT_LOADER,
  TS_LOADER,
  POST_CSS_LOADER,
  SASS_LOADER,
]);
