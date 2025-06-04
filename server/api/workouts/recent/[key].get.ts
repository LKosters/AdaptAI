export default defineEventHandler(async (event) => {
  try {
    const config = useRuntimeConfig();
    const apiKey = getRouterParam(event, "key");

    if (!apiKey) {
      throw createError({
        statusCode: 400,
        message: "API key is required",
      });
    }

    const [page1Response, page2Response] = await Promise.all([
      $fetch(
        `${config.hevyAPIEndpoint}workouts?page=1&pageSize=10&apiKey=${apiKey}`,
        {
          retry: 1,
          timeout: 5000,
        },
      ),
      $fetch(
        `${config.hevyAPIEndpoint}workouts?page=2&pageSize=10&apiKey=${apiKey}`,
        {
          retry: 1,
          timeout: 5000,
        },
      ),
    ]);

    const page1Data = page1Response as any;
    const page2Data = page2Response as any;

    const combinedResponse = {
      ...page1Data,
      workouts: [...(page1Data.workouts || []), ...(page2Data.workouts || [])],
    };

    return combinedResponse;
  } catch (error: any) {
    if (error.statusCode === 400) {
      throw error;
    }

    console.error("Failed to fetch workouts:", error);

    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || "Failed to fetch workouts",
    });
  }
});
