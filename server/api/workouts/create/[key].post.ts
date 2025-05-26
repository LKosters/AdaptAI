export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = getRouterParam(event, "key");
  const body = await readBody(event);

  const response = await $fetch(`${config.hevyAPIEndpoint}routines`, {
    method: "POST",
    header: {
      "api-key": apiKey,
    },
    body: body,
  });

  return response;
});
