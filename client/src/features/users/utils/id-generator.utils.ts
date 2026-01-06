/**
 * Generate student code based on academic year and major
 * Format: B + 2-digit year (from academic year start) + 2-letter major code + 4-digit sequential number
 * Example: B21VT0001 (B + 21 + VT + 0001)
 */
export const generateStudentCode = (
  academicYear: string,
  majorName: string,
  sequenceNumber: number
): string => {
  // Extract the start year from academic year (e.g., "2021-2026" -> "2021")
  const startYear = academicYear.split("-")[0];

  // Get last 2 digits of the year
  const yearSuffix = startYear.slice(-2);

  // Extract first 2 letters from major name (uppercase, remove spaces and accents)
  const majorCode = extractMajorCode(majorName);

  // Format sequence number with leading zeros (4 digits)
  const sequence = sequenceNumber.toString().padStart(4, "0");

  return `B${yearSuffix}${majorCode}${sequence}`;
};

/**
 * Generate lecturer code based on current year and major
 * Format: G + 2-digit year (current year) + 2-letter major code + 4-digit sequential number
 * Example: G26BT0001 (G + 26 + BT + 0001)
 */
export const generateLecturerCode = (
  majorName: string,
  sequenceNumber: number
): string => {
  // Get current year
  const currentYear = new Date().getFullYear();

  // Get last 2 digits of the year
  const yearSuffix = currentYear.toString().slice(-2);

  // Extract first 2 letters from major name (uppercase, remove spaces and accents)
  const majorCode = extractMajorCode(majorName);

  // Format sequence number with leading zeros (4 digits)
  const sequence = sequenceNumber.toString().padStart(4, "0");

  return `G${yearSuffix}${majorCode}${sequence}`;
};

/**
 * Extract 2-letter code from major name
 * Removes spaces, accents, and takes first 2 letters (uppercase)
 */
const extractMajorCode = (majorName: string): string => {
  // Remove spaces and special characters, convert to uppercase
  const cleaned = majorName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .replace(/[^a-zA-Z]/g, "") // Keep only letters
    .toUpperCase();

  // Take first 2 letters, pad with 'X' if needed
  return cleaned.slice(0, 2).padEnd(2, "X");
};

/**
 * Validate academic year format (YYYY-YYYY)
 */
export const validateAcademicYear = (academicYear: string): boolean => {
  const regex = /^\d{4}-\d{4}$/;
  if (!regex.test(academicYear)) return false;

  const [startYear, endYear] = academicYear.split("-").map(Number);
  return endYear > startYear;
};

/**
 * Parse academic year to get start year
 */
export const parseAcademicYear = (academicYear: string): number => {
  const startYear = academicYear.split("-")[0];
  return parseInt(startYear, 10);
};
