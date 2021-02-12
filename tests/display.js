import { Decimal } from 'decimal.js';
import { display } from '@/display.js'

const maxlen = 10;
const numbers = [
  "0",
  "123",
  "1234567891234567",
  "1e20",
  "1e80",
  "1e99",
  "0.1",
  "0.00001",
  "0.00000000000001",
  "0.0000000000001234567891234",
  "0.333333333333333333",
  "1e-10",
  "1e-20",
  "1e-40"
]

describe('Decimal display', () => {
  it.each(numbers)('respects max length for %s', (n) => {
    expect(display(Decimal(n), maxlen).length).toBeLessThanOrEqual(maxlen);
  })
  it.each(numbers)('respects max length for -%s', (n) => {
    expect(display(Decimal('-' + n), maxlen).length).toBeLessThanOrEqual(maxlen);
  })
  it.each(numbers)('produces similar numbers except for sign %s', (n) => {
    const a = display(Decimal(n), maxlen);
    const b = display(Decimal('-' + n), maxlen);
    expect(a.length).toBe(b.length);
    expect(a.slice(1)).toBe(b.slice(1));
  })
})
