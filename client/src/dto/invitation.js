export const invitationRequest = (data = {}) => {
  const { id, isPublic, ...rest } = data
  return { id, isPublic, ...rest }
}

export const invitationResponse = (data = {}) => {
  const { _id, isPublic, ...rest } = data
  return { id: _id, isPublic, ...rest }
}

export const invitationsResponse = (data = {}) => {
  return data.map((element) => invitationResponse(element))
}
