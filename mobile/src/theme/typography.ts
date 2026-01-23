const size = {
  h1: 24,
  h2: 20,
  h3: 18,
  body: 16,
  caption: 14,
  small: 12,
};

const weight = {
  bold: '700',
  semiBold: '600',
  medium: '500',
  regular: '400',
} as const;

export const TYPOGRAPHY = {
  fontFamily: 'Inter',
  size,
  weight,
  h1: { fontSize: size.h1, fontWeight: weight.bold },
  h2: { fontSize: size.h2, fontWeight: weight.semiBold },
  h3: { fontSize: size.h3, fontWeight: weight.semiBold },
  body1: { fontSize: size.body, fontWeight: weight.regular },
  body2: { fontSize: size.caption, fontWeight: weight.regular },
  caption: { fontSize: size.small, fontWeight: weight.regular },
  button: { fontSize: size.body, fontWeight: weight.medium },
  subtitle1: { fontSize: size.body, fontWeight: weight.semiBold },
  subtitle2: { fontSize: size.caption, fontWeight: weight.semiBold },
};
