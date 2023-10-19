export const badRequest = (res, message = "Bad Request Found") => {
  res.status(400).send({ message, success: false });
};

export const unProcessableEntity = (res, message = "Unproccessable Entity") => {
  res.status(422).send({ message, success: false });
};

export const serverError = (res, message = "Internal Server Error") => {
  res.status(500).send({ message, success: false });
};

export const unAuthorized = (res, message = "Credentials not found") => {
  res.status(401).send({ message, success: false });
};

export const successRequest = (res, status, message, data) => {
  res.status(status).send({
    success: true,
    ...(data && { data }),
    ...(message && { message })
  });
};

export const notFound = (res, message = "Not Found") => {
  res.status(404).send({ success: false, message });
};

export const sendRequest = (res, status, success, message, data) => {
  const dto = { success, message };
  if (data) dto.data = data;
  res.status(status).send(dto);
};
