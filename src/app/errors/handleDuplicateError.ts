import { TErrorSource, TGenericErrorResponse } from './../interface/error';

const handleDuplicateError = (err: string): TGenericErrorResponse => {
  const regex = /name: "([^"]+)"/;

  // Use the exec method to extract the matched value
  const match = regex.exec(err);

  // Check if there is a match and get the department name
  const duplicateError = match ? match[1] : null;

  const errorSource: TErrorSource = [
    {
      path: '',
      message: duplicateError
        ? `${duplicateError} is already exist`
        : 'This is a duplicate error',
    },
  ];

  const statusCode = 400;

  return {
    statusCode,
    message: 'Duplicate error',
    errorSource,
  };
};

export default handleDuplicateError;
