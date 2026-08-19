<script setup lang="ts">
interface Book {
  id: string;
  title: string;
  authors?: string[];
  publishedDate?: string;
  cover?: string;
  description?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

const props = defineProps<{
  book: Book;
  isShortlisted: boolean;
  showRemove?: boolean;
}>();

const emit = defineEmits<{
  shortlist: [book: Book];
  remove: [book: Book];
}>();

const publishedYear = computed(function () {
  return props.book.publishedDate?.slice(0, 4) || "Unknown";
});

// Open Book Details

function openBookDetails() {
  if (!import.meta.client) {
    return;
  }

  // Save complete book details
  sessionStorage.setItem(
    `book-${props.book.id}`,
    JSON.stringify(props.book)
  );

  navigateTo(`/books/${encodeURIComponent(props.book.id)}`);
}

// Shortlist

function handleShortlist() {
  emit("shortlist", props.book);
}

// Remove

function handleRemove() {
  emit("remove", props.book);
}
</script>

<template>
  <article
    class="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-slate-200 transition duration-300 hover:-translate-y-1 hover:shadow-lg"
  >
    <!-- Book Cover -->

    <button
      type="button"
      class="block h-64 w-full bg-slate-100 text-left"
      :aria-label="`View details for ${book.title}`"
      @click="openBookDetails"
    >
      <img
        v-if="book.cover"
        :src="book.cover"
        :alt="`${book.title} cover`"
        class="h-full w-full object-contain"
      />

      <div
        v-else
        class="flex h-full items-center justify-center text-sm text-slate-400"
      >
        No Cover Available
      </div>
    </button>

    <!-- Book Details -->

    <div class="p-4">
      <!-- Title -->

      <button
        type="button"
        class="block w-full text-left"
        @click="openBookDetails"
      >
        <h2
          class="line-clamp-2 min-h-12 text-lg font-semibold text-slate-900 transition hover:text-[#4f46e5]"
        >
          {{ book.title }}
        </h2>
      </button>

      <!-- Author -->

      <p class="mt-2 line-clamp-1 text-sm text-slate-600">
        {{ book.authors?.join(", ") || "Unknown Author" }}
      </p>

      <!-- Published -->

      <p class="mt-1 text-sm text-slate-500">Published: {{ publishedYear }}</p>

      <!-- Already Shortlisted -->

      <button
        v-if="isShortlisted && !showRemove"
        type="button"
        disabled
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-[#4f46e5] px-4 py-2 text-sm font-medium text-white"
      >
        <span class="text-lg text-yellow-400"> ★ </span>

        Shortlisted
      </button>

      <!-- Remove -->

      <button
        v-else-if="showRemove"
        type="button"
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:border-[#4f46e5] hover:bg-indigo-50 hover:text-[#4f46e5]"
        @click.stop="handleRemove"
      >
       
<svg
  xmlns="http://www.w3.org/2000/svg"
  viewBox="0 0 24 24"
  fill="none"
  stroke="currentColor"
  stroke-width="2"
  class="h-5 w-5"
  aria-hidden="true"
>
  <path
    stroke-linecap="round"
    stroke-linejoin="round"
    d="M6 3.75A1.75 1.75 0 0 1 7.75 2h8.5A1.75 1.75 0 0 1 18 3.75v16.5l-6-3.5-6 3.5V3.75Z"
  />
  <path
    stroke-linecap="round"
    d="m9 8 6 6M15 8l-6 6"
  />
</svg>
Remove from Shortlist
      </button>

      <!-- Shortlist -->

      <button
        v-else
        type="button"
        class="mt-4 flex w-full items-center justify-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-[#4f46e5]"
        @click.stop="handleShortlist"
      >
        Shortlist
      </button>
    </div>
  </article>
</template>
