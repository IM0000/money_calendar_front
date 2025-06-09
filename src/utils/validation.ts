// Slack 웹훅 URL 정규식 (백엔드와 동일)
export const SLACK_WEBHOOK_URL_REGEX =
  /^https:\/\/hooks\.slack\.com\/services\/[A-Z0-9]+\/[A-Z0-9]+\/[A-Za-z0-9]+$/;

/**
 * Slack 웹훅 URL 형식을 검증합니다.
 * @param url 검증할 URL
 * @returns 유효하면 true, 그렇지 않으면 false
 */
export const isValidSlackWebhookUrl = (url: string): boolean => {
  return SLACK_WEBHOOK_URL_REGEX.test(url.trim());
};

/**
 * Slack 웹훅 URL을 검증하고 에러 메시지를 반환합니다.
 * @param url 검증할 URL
 * @param required URL이 필수인지 여부
 * @returns 에러 메시지 (유효하면 빈 문자열)
 */
export const validateSlackWebhookUrl = (
  url: string,
  required: boolean = true,
): string => {
  const trimmedUrl = url.trim();

  if (!trimmedUrl) {
    return required ? 'Slack 웹훅 URL을 입력해주세요.' : '';
  }

  if (!isValidSlackWebhookUrl(trimmedUrl)) {
    return '올바른 Slack 웹훅 URL 형식이 아닙니다.';
  }

  return '';
};
