// Utility functions to format API responses consistently

export const successResponse = (res, statusCode = 200, message = 'Success', data = null) => {
  const response = {
    success: true,
    message: message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

export const errorResponse = (res, statusCode = 500, message = 'Internal Server Error', data = null) => {
  const response = {
    success: false,
    message: message
  };

  if (data !== null) {
    response.data = data;
  }

  return res.status(statusCode).json(response);
};

// Helper for pagination response
export const paginatedResponse = (res, statusCode = 200, message = 'Success', data, pagination) => {
  return res.status(statusCode).json({
    success: true,
    message: message,
    data: data,
    pagination: pagination
  });
};
