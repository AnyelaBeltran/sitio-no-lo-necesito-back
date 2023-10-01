const successResponse = (message, code) => {
  return {
    status: 'OK',
    code: code,
    messages: message,
    response: true,
    result: []
  };

 
}

module.exports = successResponse;