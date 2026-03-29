/**
 * Env
 */
class Env {

  HTTP3_ALLOW_EMPTY_FILES = "true";
  HTTP3_BLOCK_SIZE_KB = "256";
  HTTP3_CERT_PEM = "certs/cert.pem";
  HTTP3_CHARSET = "utf-8";
  HTTP3_COMPRESSION = "true";
  HTTP3_KEEP_ALIVE = "30";
  HTTP3_KEEP_EXTENSIONS = "true";
  HTTP3_KEY_PEM = "certs/key.pem";
  HTTP3_MAX_FIELDS = "60";
  HTTP3_MAX_FIELDS_SIZE_TOTAL_MB = "1";
  HTTP3_MAX_FILES = "3";
  HTTP3_MAX_FILES_SIZE_TOTAL_MB = "60";
  HTTP3_MAX_FILE_SIZE_MB = "60";
  HTTP3_PORT = "3001";
  HTTP3_STORAGE_PATH = "storage/";
  HTTP3_THREAD_LIMIT = "4";
  WT_BLOCK_SIZE_KB = "256";
  WT_CERT_PEM = "certs/cert.pem";
  WT_COMPRESSION = "true";
  WT_HANDSHAKE_TIMEOUT = "30";
  WT_KEY_PEM = "cert/key.pem";
  WT_MAX_MESSAGE_SIZE_MB = "60";
  WT_PING_TIMEOUT = "15";
  WT_PORT = "4433";
  WT_SEND_TIMEOUT = "30";
  WT_THREAD_LIMIT = "4";
  UMQT_BLOCK_SIZE_KB = "256";
  UMQT_CERT_PEM = "certs/cert.pem";
  UMQT_COMPRESSION = "true";
  UMQT_KEY_PEM = "certs/key.pem";
  UMQT_PORT = "5533";
  UMQT_THREAD_LIMIT = "4";

}

const env = new Env();

export default env;