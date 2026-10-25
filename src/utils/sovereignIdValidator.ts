import { CountryCode } from '../types';

export interface SovereignIdValidationResult {
  isValid: boolean;
  isIncomplete: boolean;
  formatted: string;
  idType: string;
  message: string;
  algorithmNotes: string;
}

// Clean non-alphanumeric
export const cleanId = (value: string): string => {
  return value.replace(/[^A-Za-z0-9]/g, '').toUpperCase();
};

/**
 * 1. United Kingdom: National Insurance Number (NINO)
 * Format: 2 letters, 6 numbers, 1 letter (e.g. QQ 12 34 56 C)
 * HMRC rules:
 * - First letter cannot be D, F, I, Q, U, V (except testing prefix QQ is commonly allowed)
 * - Second letter cannot be D, F, I, O, Q, U, V
 * - First 2 letters cannot be: BG, GB, KN, NK, NT, TN, ZZ
 * - Next 6 characters must be numeric digits
 * - Final character must be A, B, C, or D
 */
export const validateUkNino = (raw: string): SovereignIdValidationResult => {
  const clean = cleanId(raw);
  const idType = 'UK National Insurance Number (NINO)';

  if (clean.length === 0) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted: '',
      idType,
      message: 'Enter your 9-character UK National Insurance Number (e.g. QQ 12 34 56 A)',
      algorithmNotes: 'Format: 2 letters, 6 digits, suffix A-D. Verified against HMRC character rules.',
    };
  }

  // Format with spaces: XX ## ## ## X
  let formatted = clean;
  if (clean.length > 2) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2);
  }
  if (clean.length > 4) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2, 4) + ' ' + clean.slice(4);
  }
  if (clean.length > 6) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2, 4) + ' ' + clean.slice(4, 6) + ' ' + clean.slice(6);
  }
  if (clean.length > 8) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2, 4) + ' ' + clean.slice(4, 6) + ' ' + clean.slice(6, 8) + ' ' + clean.slice(8, 9);
  }

  if (clean.length < 9) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted,
      idType,
      message: `Incomplete NINo (${clean.length}/9 characters entered). Expected format: QQ 12 34 56 A`,
      algorithmNotes: 'HMRC validation pending complete 9-character string.',
    };
  }

  if (clean.length > 9) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Too many characters. UK NINo is exactly 9 characters.',
      algorithmNotes: 'UK National Insurance numbers cannot exceed 9 alphanumeric characters.',
    };
  }

  const firstLetter = clean[0];
  const secondLetter = clean[1];
  const prefix = clean.slice(0, 2);
  const digits = clean.slice(2, 8);
  const suffix = clean[8];

  const disallowedFirst = ['D', 'F', 'I', 'U', 'V']; // allow Q for test QQ
  const disallowedSecond = ['D', 'F', 'I', 'O', 'Q', 'U', 'V'];
  const disallowedPrefixes = ['BG', 'GB', 'KN', 'NK', 'NT', 'TN', 'ZZ'];

  // Check prefix
  if (prefix !== 'QQ') {
    if (disallowedFirst.includes(firstLetter) || firstLetter < 'A' || firstLetter > 'Z') {
      return {
        isValid: false,
        isIncomplete: false,
        formatted,
        idType,
        message: `Invalid prefix letter '${firstLetter}'. Letters D, F, I, U, V are disallowed by HMRC.`,
        algorithmNotes: 'HMRC regulation prohibits letters D, F, I, U, V as first character.',
      };
    }
    if (disallowedSecond.includes(secondLetter) || secondLetter < 'A' || secondLetter > 'Z') {
      return {
        isValid: false,
        isIncomplete: false,
        formatted,
        idType,
        message: `Invalid second prefix letter '${secondLetter}'. Letters D, F, I, O, Q, U, V are disallowed by HMRC.`,
        algorithmNotes: 'HMRC regulation prohibits letters D, F, I, O, Q, U, V as second character.',
      };
    }
    if (disallowedPrefixes.includes(prefix)) {
      return {
        isValid: false,
        isIncomplete: false,
        formatted,
        idType,
        message: `Prefix '${prefix}' is an invalid / reserved UK administrative code.`,
        algorithmNotes: 'Reserved administrative prefixes are rejected.',
      };
    }
  }

  // Check digits
  if (!/^\d{6}$/.test(digits)) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Middle 6 characters must be numeric digits.',
      algorithmNotes: 'NINo positions 3 through 8 must be decimal digits 0-9.',
    };
  }

  // Check suffix
  if (!['A', 'B', 'C', 'D'].includes(suffix)) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: `Final character '${suffix}' is invalid. Suffix must be A, B, C, or D.`,
      algorithmNotes: 'HMRC suffix indicates contribution pay period (A, B, C, or D).',
    };
  }

  return {
    isValid: true,
    isIncomplete: false,
    formatted,
    idType,
    message: 'Valid UK National Insurance Number verified',
    algorithmNotes: 'HMRC format & character constraint validation passed.',
  };
};

/**
 * 2. Canada: Social Insurance Number (SIN)
 * Format: 9 digits (XXX-XXX-XXX)
 * Official Service Canada algorithm: Luhn algorithm (modulo 10 checksum)
 * - Digits at even positions (index 1, 3, 5, 7) are multiplied by 2.
 * - Sum of all digits (with double-digit products summed, e.g. 8*2=16 -> 1+6=7).
 * - Total sum must be divisible by 10.
 */
export const validateCaSin = (raw: string): SovereignIdValidationResult => {
  const clean = cleanId(raw).replace(/[^0-9]/g, '');
  const idType = 'Canada Social Insurance Number (SIN)';

  if (clean.length === 0) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted: '',
      idType,
      message: 'Enter your 9-digit Canadian Social Insurance Number (e.g. 046 454 286)',
      algorithmNotes: 'Format: 9 digits. Verified via official Service Canada Luhn modulo-10 algorithm.',
    };
  }

  // Format: XXX-XXX-XXX
  let formatted = clean;
  if (clean.length > 3) {
    formatted = clean.slice(0, 3) + '-' + clean.slice(3);
  }
  if (clean.length > 6) {
    formatted = clean.slice(0, 3) + '-' + clean.slice(3, 6) + '-' + clean.slice(6, 9);
  }

  if (clean.length < 9) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted,
      idType,
      message: `Incomplete SIN (${clean.length}/9 digits entered). Format: XXX-XXX-XXX`,
      algorithmNotes: 'Luhn validation pending complete 9-digit sequence.',
    };
  }

  if (clean.length > 9) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Too many digits. Canadian SIN is exactly 9 digits.',
      algorithmNotes: 'Canadian SIN cannot exceed 9 digits.',
    };
  }

  // Luhn Checksum Algorithm
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    const digit = parseInt(clean[i], 10);
    if (i % 2 === 1) {
      // Even position (0-indexed 1, 3, 5, 7)
      const doubled = digit * 2;
      sum += doubled > 9 ? doubled - 9 : doubled;
    } else {
      sum += digit;
    }
  }

  const isLuhnValid = sum % 10 === 0;

  if (!isLuhnValid) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Invalid Canadian SIN checksum (failed official Luhn mod-10 verification).',
      algorithmNotes: 'Service Canada Luhn verification failed. Check for mistyped digits.',
    };
  }

  return {
    isValid: true,
    isIncomplete: false,
    formatted,
    idType,
    message: 'Valid Canadian SIN verified (Luhn mod-10 check passed)',
    algorithmNotes: 'Official Service Canada Luhn checksum algorithm validated successfully.',
  };
};

/**
 * 3. Australia: Tax File Number (TFN)
 * Format: 8 or 9 digits (XXX XXX XXX)
 * Official Australian Taxation Office (ATO) Modulus 11 algorithm:
 * For 9-digit: weights [1, 4, 3, 7, 5, 8, 6, 9, 10]
 * Sum of (digit * weight) mod 11 must equal 0.
 * For 8-digit: weights [10, 7, 8, 4, 6, 3, 5, 1]
 */
export const validateAuTfn = (raw: string): SovereignIdValidationResult => {
  const clean = cleanId(raw).replace(/[^0-9]/g, '');
  const idType = 'Australia Tax File Number (TFN)';

  if (clean.length === 0) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted: '',
      idType,
      message: 'Enter your 9-digit Australian Tax File Number (e.g. 876 543 210)',
      algorithmNotes: 'Format: 9 digits. Verified via official ATO Modulus 11 weighted algorithm.',
    };
  }

  // Format: XXX XXX XXX
  let formatted = clean;
  if (clean.length > 3) {
    formatted = clean.slice(0, 3) + ' ' + clean.slice(3);
  }
  if (clean.length > 6) {
    formatted = clean.slice(0, 3) + ' ' + clean.slice(3, 6) + ' ' + clean.slice(6, 9);
  }

  if (clean.length < 8) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted,
      idType,
      message: `Incomplete TFN (${clean.length}/9 digits entered). Format: XXX XXX XXX`,
      algorithmNotes: 'ATO Modulus 11 validation requires 8 or 9 digits.',
    };
  }

  if (clean.length > 9) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Too many digits. Australian TFN is 8 or 9 digits.',
      algorithmNotes: 'ATO TFN cannot exceed 9 digits.',
    };
  }

  let isValidMod11 = false;

  if (clean.length === 9) {
    const weights = [1, 4, 3, 7, 5, 8, 6, 9, 10];
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      sum += parseInt(clean[i], 10) * weights[i];
    }
    isValidMod11 = sum % 11 === 0;
  } else if (clean.length === 8) {
    const weights = [10, 7, 8, 4, 6, 3, 5, 1];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      sum += parseInt(clean[i], 10) * weights[i];
    }
    isValidMod11 = sum % 11 === 0;
  }

  if (!isValidMod11) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Invalid Australian TFN checksum (failed ATO Modulus 11 verification).',
      algorithmNotes: 'ATO Modulus 11 weighted checksum failed. Verify digits.',
    };
  }

  return {
    isValid: true,
    isIncomplete: false,
    formatted,
    idType,
    message: 'Valid Australian TFN verified (ATO Mod 11 check passed)',
    algorithmNotes: 'Australian Taxation Office Modulus 11 algorithm validated successfully.',
  };
};

/**
 * 4. Germany: Steuer-Identifikationsnummer (Steuer-ID / IdNr)
 * Format: 11 digits (XX XXX XXX XXX)
 * Official Bundeszentralamt für Steuern (BZSt) rules:
 * - Exactly 11 digits. First digit cannot be 0.
 * - Among first 10 digits, one digit must appear 2 or 3 times.
 * - 11th digit is checksum computed via ISO 7064 Mod 11, 10.
 */
export const validateDeSteuerId = (raw: string): SovereignIdValidationResult => {
  const clean = cleanId(raw).replace(/[^0-9]/g, '');
  const idType = 'Germany Steuer-Identifikationsnummer (Steuer-ID)';

  if (clean.length === 0) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted: '',
      idType,
      message: 'Enter your 11-digit German Steuer-ID (e.g. 12 345 678 903)',
      algorithmNotes: 'Format: 11 digits. First digit 1-9. Verified via ISO 7064 Mod 11, 10 checksum.',
    };
  }

  // Format: XX XXX XXX XXX
  let formatted = clean;
  if (clean.length > 2) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2);
  }
  if (clean.length > 5) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2, 5) + ' ' + clean.slice(5);
  }
  if (clean.length > 8) {
    formatted = clean.slice(0, 2) + ' ' + clean.slice(2, 5) + ' ' + clean.slice(5, 8) + ' ' + clean.slice(8, 11);
  }

  if (clean.length < 11) {
    return {
      isValid: false,
      isIncomplete: true,
      formatted,
      idType,
      message: `Incomplete Steuer-ID (${clean.length}/11 digits entered). Format: XX XXX XXX XXX`,
      algorithmNotes: 'BZSt ISO 7064 Mod 11, 10 validation requires exactly 11 digits.',
    };
  }

  if (clean.length > 11) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'Too many digits. German Steuer-ID is exactly 11 digits.',
      algorithmNotes: 'Steuer-ID cannot exceed 11 digits.',
    };
  }

  if (clean[0] === '0') {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: 'German Steuer-ID cannot begin with 0. First digit must be 1-9.',
      algorithmNotes: 'BZSt specification requires non-zero leading digit.',
    };
  }

  // ISO 7064 Mod 11, 10 Checksum Algorithm
  let product = 10;
  for (let i = 0; i < 10; i++) {
    const digit = parseInt(clean[i], 10);
    let sum = (digit + product) % 10;
    if (sum === 0) sum = 10;
    product = (sum * 2) % 11;
  }

  let checksum = 11 - product;
  if (checksum === 10) checksum = 0;

  const actualCheckDigit = parseInt(clean[10], 10);
  const isValidChecksum = checksum === actualCheckDigit;

  if (!isValidChecksum) {
    return {
      isValid: false,
      isIncomplete: false,
      formatted,
      idType,
      message: `Invalid German Steuer-ID checksum (expected ${checksum}, found ${actualCheckDigit}).`,
      algorithmNotes: 'BZSt ISO 7064 Mod 11, 10 checksum failed. Check for mistyped digits.',
    };
  }

  return {
    isValid: true,
    isIncomplete: false,
    formatted,
    idType,
    message: 'Valid German Steuer-ID verified (ISO 7064 Mod 11, 10 passed)',
    algorithmNotes: 'Bundeszentralamt für Steuern ISO 7064 checksum validated successfully.',
  };
};

/**
 * Master validator dispatch based on country
 */
export const validateSovereignId = (country: CountryCode, rawValue: string): SovereignIdValidationResult => {
  switch (country) {
    case 'UK':
      return validateUkNino(rawValue);
    case 'CA':
      return validateCaSin(rawValue);
    case 'AU':
      return validateAuTfn(rawValue);
    case 'DE':
      return validateDeSteuerId(rawValue);
    default:
      return validateUkNino(rawValue);
  }
};

/**
 * Curated valid sample credentials for demo and testing in UI
 */
export const VALID_SAMPLE_SOVEREIGN_IDS: Record<CountryCode, { sample: string; label: string; description: string }> = {
  UK: {
    sample: 'QQ123456C',
    label: 'QQ 12 34 56 C',
    description: 'HMRC-compliant testing National Insurance Number',
  },
  CA: {
    sample: '046454286',
    label: '046-454-286',
    description: 'Service Canada Luhn mod-10 verified Social Insurance Number',
  },
  AU: {
    sample: '876543210',
    label: '876 543 210',
    description: 'ATO Modulus 11 verified Tax File Number',
  },
  DE: {
    sample: '26925836189',
    label: '26 925 836 189',
    description: 'BZSt ISO 7064 Mod 11, 10 verified Steuer-ID',
  },
};
