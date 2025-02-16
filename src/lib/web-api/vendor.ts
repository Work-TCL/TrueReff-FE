export const checkVendorExist = async (axios: any, email: string) => {
  try {
    const response = await axios.get(`/vendor/check-exist/${email}`);
    return response?.data?.data;
  } catch (error) {
    throw error || new Error("profile get failed");
  }
};
