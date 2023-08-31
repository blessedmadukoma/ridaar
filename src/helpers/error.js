const handleError = (error) => {
  let errMsg = error.response ? error.response.data.message : error.message

  if (typeof errMsg === 'undefined' || errMsg === null) {
    errMsg = 'Network Error 😪 Give us a few minutes 🙏🏿!'
  }

  if (errMsg.includes('SQLSTATE[08006]') || errMsg.includes('not known (Connection')) {
    errMsg = 'Network error! Try again in a few minutes!'
  }

  return errMsg
}

export { handleError }
