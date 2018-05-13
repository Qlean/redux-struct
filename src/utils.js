// eslint-disable-next-line import/prefer-default-export
export const getIsValidStructId = structId =>
  (typeof structId === 'number' && Number.isFinite(structId) && !(structId % 1)) ||
  (typeof structId === 'string' && Boolean(structId.length));
