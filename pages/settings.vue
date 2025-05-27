<template>
  <div>
    <NuxtLink class="flex items-center gap-2 mb-5" to="/routines">
      <Icon name="line-md:arrow-left" class="!size-5" />
      Terug naar overzicht
    </NuxtLink>
    <BlockHero title="Instellingen" />
    <p class="text-lg font-bold mb-5">
      Vul hier je Hevy API key in als je de integratie wilt gebruiken.
    </p>
    <input
      placeholder="API key"
      class="input !h-max mb-3"
      type="text"
      v-model="input"
    />
    <button
      @click="invoke()"
      :class="{ 'opacity-50 pointer-events-none': isLoading }"
      class="btn-primary mb-5"
      :disabled="isLoading"
    >
      <Icon v-if="isLoading" name="line-md:loading-twotone-loop" />
      <span v-else>Toevoegen</span>
    </button>
    <div v-if="successMessage" class="text-green-500 mb-3">
      {{ successMessage }}
    </div>
    <div v-if="errorMessage" class="text-red-500 mb-3">
      {{ errorMessage }}
    </div>
  </div>
</template>

<script lang="ts" setup>
import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
} from "firebase/firestore";

const { userId } = useAuth();
const integrationStore = useIntegrationStore();
const nuxtApp = useNuxtApp();

const input = ref("");
const isLoading = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const existingDocId = ref("");

watch(
  () => integrationStore.hevyApiKey,
  (newApiKey) => {
    input.value = newApiKey;
  },
  { immediate: true },
);

async function fetchExistingApiKey() {
  if (!userId.value) return;

  try {
    const firebase = nuxtApp.$firebase as any;
    const q = query(
      collection(firebase.db, "Integration"),
      where("userId", "==", userId.value),
    );

    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const doc = querySnapshot.docs[0];
      existingDocId.value = doc.id;
    }
  } catch (error) {
    console.error("Error fetching existing API key:", error);
  }
}

onMounted(() => {
  fetchExistingApiKey();
});

async function invoke() {
  if (!input.value.trim()) {
    errorMessage.value = "Voer een geldige API key in";
    return;
  }

  if (!userId.value) {
    errorMessage.value = "Je moet ingelogd zijn om een API key toe te voegen";
    return;
  }

  isLoading.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    const firebase = nuxtApp.$firebase as any;

    if (existingDocId.value) {
      await updateDoc(doc(firebase.db, "Integration", existingDocId.value), {
        hevyApiKey: input.value.trim(),
        updatedAt: new Date(),
      });
      successMessage.value = "API key succesvol bijgewerkt!";
    } else {
      const integrationData = {
        hevyApiKey: input.value.trim(),
        userId: userId.value,
        createdAt: new Date(),
      };

      const docRef = await addDoc(
        collection(firebase.db, "Integration"),
        integrationData,
      );
      existingDocId.value = docRef.id;
      successMessage.value = "API key succesvol toegevoegd!";
    }

    integrationStore.setHevyApiKey(input.value.trim());
  } catch (error) {
    console.error("Error saving API key:", error);
    errorMessage.value =
      "Er is een fout opgetreden bij het opslaan van de API key";
  } finally {
    isLoading.value = false;
  }
}
</script>
