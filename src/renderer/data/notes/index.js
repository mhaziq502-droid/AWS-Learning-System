// Aggregates the detailed per-module notes into a single map keyed by module id.
// Each module file exports an array of sections (see ./README.md for the block
// format). All content is original to this project.

import clf from './clf.js';
import aif from './aif.js';
import saa from './saa.js';
import dva from './dva.js';
import soa from './soa.js';
import mls from './mls.js';
import sap from './sap.js';
import devops from './devops.js';
import ans from './ans.js';
import scs from './scs.js';

export const NOTES = {
  'clf-c02': clf,
  'aif-c01': aif,
  'saa-c03': saa,
  'dva-c02': dva,
  'soa-c02': soa,
  'mls-c01': mls,
  'sap-c02': sap,
  'devops-c02': devops,
  'ans-c01': ans,
  'scs-c02': scs,
};

export function getNotes(moduleId) {
  return NOTES[moduleId] || [];
}
