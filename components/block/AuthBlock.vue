<template>
  <div
    class="min-h-screen flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8"
  >
    <div class="max-w-md w-full space-y-8 text-center">
      <div>
        <h1 class="text-4xl font-bold text-white mb-2">Welcome to AdaptAI</h1>
        <p class="text-xl text-white/80 mb-8">
          Your AI-powered fitness companion
        </p>
        <div class="space-y-4">
          <p class="text-white/80">Sign in to:</p>
          <ul class="text-left space-y-6 mb-12">
            <li class="flex items-center">
              <Icon
                name="line-md:confirm-circle"
                class="!size-8 text-[#f47816] mr-4"
              />
              <span class="text-white">Track your workouts seamlessly</span>
            </li>
            <li class="flex items-center">
              <Icon
                name="line-md:confirm-circle"
                class="!size-8 text-[#f47816] mr-4"
              />
              <span class="text-white">Get AI-powered workout insights</span>
            </li>
            <li class="flex items-center">
              <Icon
                name="line-md:confirm-circle"
                class="!size-8 text-[#f47816] mr-4"
              />
              <span class="text-white">Achieve your fitness goals faster</span>
            </li>
          </ul>
          <div
            class="bg-black/70 rounded-[20px] p-5 transform hover:scale-105 transition-transform duration-200"
          >
            <SignInButton />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Component uses SignInButton from Clerk
</script>
