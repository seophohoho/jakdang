import { describe, expect, it } from 'vitest';
import type { SourceConfig } from '../../src/collectors/types.js';
import { selectSources, sourceFingerprint, SOURCES, validateSources } from '../../src/sources.js';

const base = SOURCES[0] as SourceConfig;

describe('소스 설정', () => {
  it('운영 소스는 3개이며 모두 검증을 통과한다', () => {
    expect(SOURCES.map((source) => source.id)).toEqual(['wevity-it', 'dacon', 'oss-notice']);
    expect(SOURCES.every((source) => source.enabled)).toBe(true);
  });

  it('listUrl 호스트가 allowedHosts에 없거나 html 소스에 selectors가 없으면 거부한다', () => {
    expect(() => validateSources([{ ...base, allowedHosts: ['example.com'] }])).toThrow(/allowedHosts/);
    expect(() => validateSources([{ ...base, selectors: undefined }])).toThrow(/selectors/);
    expect(() => validateSources([{ ...base, listUrl: 'ftp://www.wevity.com/' }])).toThrow();
    expect(() => validateSources([base, base])).toThrow(/중복/);
  });

  it('키워드·파서 버전이 바뀌면 지문이 바뀐다', () => {
    const changed = { ...base, keywords: [...(base.keywords ?? []), '컨퍼런스'] };
    expect(sourceFingerprint(changed)).not.toBe(sourceFingerprint(base));
    expect(sourceFingerprint({ ...base, parserVersion: base.parserVersion + 1 })).not.toBe(sourceFingerprint(base));
    expect(sourceFingerprint({ ...base, enabled: false })).toBe(sourceFingerprint(base));
  });

  it('소스를 지정하지 않으면 활성 소스만, 지정하면 그 소스만 고른다', () => {
    const disabled = { ...base, id: 'off', enabled: false };
    expect(selectSources([base, disabled], []).map((source) => source.id)).toEqual([base.id]);
    expect(selectSources([base, disabled], ['off']).map((source) => source.id)).toEqual(['off']);
    expect(() => selectSources([base], ['nope'])).toThrow(/알 수 없는 소스/);
  });
});
