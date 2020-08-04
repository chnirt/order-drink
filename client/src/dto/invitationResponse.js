export const invitationResponse = (data = {}) => {
  const { _id, isPublic, ...rest } = data
  return { id: _id, public: isPublic, ...rest }
}

export const invitationsResponse = (data = {}) => {
  return data.map(element => invitationResponse(element))
}
