<template>
  <div
    class="bg-black/70 rounded-t-[20px] fixed bottom-0 left-0 right-0 max-w-[402px] mx-auto flex justify-between items-center p-5"
  >
  <NuxtLink to="/stats" class="nav-link">
    <Icon name="line-md:list" class="!size-10" />
  </NuxtLink>
    <NuxtLink to="/workouts" class="nav-link">
      <Icon name="line-md:clipboard-list" class="!size-10" />
    </NuxtLink>
    <NuxtLink to="/" class="nav-link">
      <Icon name="line-md:home" class="!size-10" />
    </NuxtLink>
    <NuxtLink to="/coach" class="nav-link">
      <Icon name="line-md:person-search-twotone" class="!size-10" />
    </NuxtLink>
    <NuxtLink to="#" class="nav-link">
      <Icon name="line-md:cog-filled" class="!size-10" />
    </NuxtLink>
  </div>
</template>

<script lang="ts" setup></script>

<style scoped>
.nav-link {
  @apply transition-all duration-300;
}

.nav-link.router-link-active svg,
.nav-link.router-link-exact-active svg {
  color: #F47816 !important;
  fill: #F47816 !important;
}

.nav-link.router-link-active svg path,
.nav-link.router-link-exact-active svg path {
  fill: #F47816 !important;
  stroke: #F47816 !important;
}

.nav-link.router-link-active,
.nav-link.router-link-exact-active {
  color: #F47816 !important;
}
</style>
