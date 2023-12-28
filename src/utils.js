/**
 * Generates a random string of the give length made up of the allowed characters.
 * @param {number} [length=10] - Length of resulting string.
 * @param {string} [allowed=ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789] - Characters allowed in the results.
 * @return {string}
 */
export function randomString(length = 10, allowed = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789") {
  let result = ""
  for (let i = 0; i < length; i++) {
    result += allowed.charAt(Math.floor(Math.random() * allowed.length))
  }
  return result
}

/**
 * @param {HTMLFormElement} form 
 */
export function jsFormSubmit(form) {
  const url = new URL(form.action)
  const formData = new FormData(form)
  // @ts-ignore
  const searchParameters = new URLSearchParams(formData)

  /** @type {Parameters<typeof fetch>[1]} */
  const fetchOptions = {
    method: form.method
  }

  if (form.method.toLowerCase() === 'post') {
    fetchOptions.body = form.enctype === 'multipart/form-data' ? formData : searchParameters
  } else {
    // @ts-ignore
    url.search = searchParameters
  }

  return fetch(url, fetchOptions)
}