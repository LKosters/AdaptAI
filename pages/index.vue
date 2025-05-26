<template>
  <div>
    <BlockHero logo :title="welcomeMessage" />
  </div>
</template>

<script lang="ts" setup>
const { isLoaded, isSignedIn, user } = useUser();

const capitalizeFirstLetter = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

const welcomeMessage = computed(() => {
  if (!isLoaded.value) {
    return "Laden...";
  }
  
  if (!isSignedIn.value) {
    return "Welkom";
  }
  
  const displayName = user.value?.firstName || 
                     user.value?.fullName || 
                     user.value?.primaryEmailAddress?.emailAddress || 
                     "gebruiker";
  
  return `Welkom terug, ${capitalizeFirstLetter(displayName)}`;
});
</script>
