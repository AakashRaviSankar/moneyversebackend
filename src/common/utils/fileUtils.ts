import * as fs from 'fs';
import path from 'path';
/**
 * Reads and parses a JSON file with a specified encoding.
 *
 * @param {string} filePath - The path to the JSON file. This should be an absolute path or relative to the current working directory.
 * @param {BufferEncoding} encoding - The character encoding to use when reading the file. Defaults to 'utf-8'.
 * @returns {any} The parsed JSON data from the file. The type of data depends on the JSON structure.
 * @throws {Error} If the file cannot be read or the JSON is invalid, an error is thrown.
 */

/**
 * Ensures a directory exists, creating it if necessary.
 *
 * @param {string} dirPath - The path to the directory.
 */
export const ensureDirectoryExists = (dirPath: string): void => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

/**
 * Saves an uploaded file to the server.
 *
 * @param {Express.Multer.File} file - The file object from multer.
 * @param {string} destination - The directory to save the file in.
 * @returns {string} The path to the saved file.
 */
export const saveFile = (
  file: Express.Multer.File,
  destination: string,
): string => {
  ensureDirectoryExists(destination);

  const filePath = path.join(destination, file.originalname);
  fs.writeFileSync(filePath, file.buffer); // Using buffer for in-memory file storage

  return filePath;
};

/**
 * Validates the file type based on its extension.
 *
 * @param {string} filename - The name of the file.
 * @param {string[]} validTypes - Array of valid file extensions.
 * @returns {boolean} True if valid, false otherwise.
 */
export const validateFileType = (
  filename: string,
  validTypes: string[],
): boolean => {
  const ext = path.extname(filename).toLowerCase();
  return validTypes.includes(ext);
};

/**
 * Validates the file size.
 *
 * @param {number} fileSize - The size of the file in bytes.
 * @param {number} maxSize - The maximum allowed size in bytes.
 * @returns {boolean} True if valid, false otherwise.
 */
export const validateFileSize = (
  fileSize: number,
  maxSize: number,
): boolean => {
  return fileSize <= maxSize;
};

/**
 * Deletes a file at the specified path.
 *
 * @param {string} filePath - The path to the file to be deleted.
 */
export const deleteFile = (filePath: string): void => {
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  } else {
    throw new Error(`File not found: ${filePath}`);
  }
};

/**
 * Lists all files in a directory.
 *
 * @param {string} dirPath - The path to the directory.
 * @returns {string[]} An array of file names in the directory.
 */
export const listFilesInDirectory = (dirPath: string): string[] => {
  return fs
    .readdirSync(dirPath)
    .filter((file) => fs.statSync(path.join(dirPath, file)).isFile());
};

/**
 * Copies a file from one location to another.
 *
 * @param {string} src - The source file path.
 * @param {string} dest - The destination file path.
 */
export const copyFile = (src: string, dest: string): void => {
  ensureDirectoryExists(path.dirname(dest)); // Ensure destination directory exists
  fs.copyFileSync(src, dest);
};

/**
 * Moves a file from one location to another.
 *
 * @param {string} src - The source file path.
 * @param {string} dest - The destination file path.
 */
export const moveFile = (src: string, dest: string): void => {
  ensureDirectoryExists(path.dirname(dest)); // Ensure destination directory exists
  fs.renameSync(src, dest);
};
export const getDataFromJsonFile = (
  filePath: string,
  encoding: BufferEncoding = 'utf-8',
): any => {
  try {
    return JSON.parse(fs.readFileSync(filePath, encoding));
  } catch (error) {
    throw new Error(`Error reading or parsing file ${filePath}: ${error}`);
  }
};
