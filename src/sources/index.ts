import type { Source } from '../types.js';
import { contestkorea } from './contestkorea.js';
import { dacon } from './dacon.js';
import { okky } from './okky.js';
import { thinkyou } from './thinkyou.js';
import { wevity } from './wevity.js';

export const sources: Source[] = [wevity, dacon, okky, thinkyou, contestkorea];
