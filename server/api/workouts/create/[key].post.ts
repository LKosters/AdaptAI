export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig();
  const apiKey = getRouterParam(event, "key");
  const body = await readBody(event);

  const response = await $fetch(
    `${config.hevyAPIEndpoint}routines?apiKey=${apiKey}`,
    {
      method: "POST",
      body: body,
    },
  );

  return response;
});
