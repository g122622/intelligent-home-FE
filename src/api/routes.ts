type Result = {
  success: boolean;
  data: Array<any>;
};

export const getAsyncRoutes = () => {
  return Promise.resolve({
    success: true,
    data: []
  }) as Promise<Result>;
};
