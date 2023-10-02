 const errorResponse = (message, code) => {
  return {
    status: 'error',
    code: code,
    messages: message,
    response: false,
    data: null
  };

 
}

module.exports = errorResponse;