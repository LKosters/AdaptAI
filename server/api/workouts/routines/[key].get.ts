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

    const response = await $fetch(
      `${config.hevyAPIEndpoint}routines?page=1&pageSize=10&apiKey=${apiKey}`,
      {
        retry: 1,
        timeout: 5000,
      },
    );

    return response;
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
