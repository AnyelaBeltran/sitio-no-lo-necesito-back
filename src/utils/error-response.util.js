 const errorResponse = (message, code) => {
  return {
    status: 'error',
    code: code,
    messages: message,
    response: false,
    result: []
  };

 
}

module.exports = errorResponse;