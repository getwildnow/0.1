export const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
export const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
export const ALLOWED_DOCUMENT_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  ...ALLOWED_IMAGE_TYPES,
];

export function validateFile(file: File, allowedTypes: string[]): { valid: boolean; error?: string } {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File size must be less than ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
    };
  }

  // Check file type
  if (!allowedTypes.includes(file.type)) {
    return {
      valid: false,
      error: `File type not allowed. Allowed types: ${allowedTypes.join(", ")}`,
    };
  }

  return { valid: true };
}

export function validateImage(file: File): { valid: boolean; error?: string } {
  return validateFile(file, ALLOWED_IMAGE_TYPES);
}

export function validateDocument(file: File): { valid: boolean; error?: string } {
  return validateFile(file, ALLOWED_DOCUMENT_TYPES);
}

