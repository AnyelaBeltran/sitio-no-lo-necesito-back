const successResponse = (message, code, data) => {
  return {
    status: 'OK',
    code: code,
    messages: message,
    response: true,
    data: data
  };

 
}

module.exports = successResponse;