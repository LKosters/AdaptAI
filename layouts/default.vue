<template>
  <div>
    <div class="py-8 px-5">
      <template v-if="isLoggedIn">
        <slot />
      </template>
      <template v-else>
        <div class="flex justify-center items-center h-screen clerk-btn">
          <SignInButton />
        </div>
      </template>
    </div>
    <svg
      class="fixed top-0 left-0 w-full h-full -z-10 animate-pulse-slow"
      width="1920"
      height="3414"
      viewBox="0 0 1920 3414"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect
        y="3413.33"
        width="3413.33"
        height="1920"
        transform="rotate(-90 0 3413.33)"
        fill="url(#paint0_radial_2_68)"
      />
      <defs>
        <radialGradient
          id="paint0_radial_2_68"
          cx="0"
          cy="0"
          r="1"
          gradientUnits="userSpaceOnUse"
          gradientTransform="translate(1731.36 4373.33) rotate(-180) scale(1681.98 1695.93)"
        >
          <stop stop-color="#F47816" stop-opacity="0.55" />
          <stop offset="0.438364" stop-color="#F47816" />
          <stop
            offset="0.684744"
            stop-color="#F47816"
            stop-opacity="0.630512"
          />
          <stop offset="1" stop-color="#F47816" stop-opacity="0" />
        </radialGradient>
      </defs>
    </svg>
    <UiNav v-if="isLoggedIn" />
  </div>
</template>

<script lang="ts" setup>
const { isSignedIn, userId } = useAuth();
const integrationStore = useIntegrationStore();

const isLoggedIn = computed(() => isSignedIn.value);

watch(
  [isLoggedIn, userId],
  async ([newIsLoggedIn, newUserId]) => {
    if (newIsLoggedIn && newUserId) {
      await integrationStore.fetchHevyApiKey(newUserId);
    } else {
      integrationStore.clearHevyApiKey();
    }
  },
  { immediate: true },
);
</script>

<style scoped>
.animate-pulse-slow {
  animation: pulse-slow 25s ease-in-out infinite;
}

@keyframes pulse-slow {
  0% {
    transform: translateY(70%) scale(1.05);
  }
  15% {
    transform: translateY(70%) scale(1.08);
  }
  30% {
    transform: translateY(70%) scale(0.99);
  }
  45% {
    transform: translateY(70%) scale(1.03);
  }
  60% {
    transform: translateY(70%) scale(1.05);
  }
  75% {
    transform: translateY(70%) scale(0.98);
  }
  90% {
    transform: translateY(70%) scale(1.01);
  }
  100% {
    transform: translateY(70%) scale(1.03);
  }
}
</style>
