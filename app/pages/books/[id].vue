<script setup lang="ts">
interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  cover: string;
  description: string;
  publisher: string;
  pageCount: number;
  categories: string[];
}

const SHORTLIST_KEY = "shortlisted-books";
const route = useRoute();
const book = ref<Book | null>(null);
const loading = ref(true);
const errorMessage = ref("");
const isShortlisted = ref(false);

// Get Book ID

const bookId = computed(function () {
  return String(route.params.id);
});

// Check Shortlist

function checkShortlisted() {
  if (!import.meta.client) {
    return;
  }

  try {
    const storedBooks = localStorage.getItem(SHORTLIST_KEY);

    if (!storedBooks) {
      isShortlisted.value = false;
      return;
    }

    const shortlistedBooks: Book[] = JSON.parse(storedBooks);

    isShortlisted.value = shortlistedBooks.some(function (item) {
      return item.id === bookId.value;
    });
  } catch (error) {
    console.error("Failed to check shortlist:", error);

    isShortlisted.value = false;
  }
}

// Load Book Details

async function loadBook() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<{
      total: number;
      books: Book[];
      source: string;
    }>("/api/books", {
      query: {
        q: bookId.value,
      },
    });

    // Find exact ID from returned books
    const foundBook = response.books.find(function (item) {
      return item.id === bookId.value;
    });

    if (!foundBook) {
      book.value = null;
      errorMessage.value = "Book details not found.";
      return;
    }

    book.value = foundBook;

    checkShortlisted();
  } catch (error) {
    console.error("Failed to load book:", error);

    book.value = null;
    errorMessage.value = "Failed to load book details.";
  } finally {
    loading.value = false;
  }
}

// Add To Shortlist

function addToShortlist() {
  if (!import.meta.client || !book.value) {
    return;
  }

  try {
    const storedBooks = localStorage.getItem(SHORTLIST_KEY);

    let shortlistedBooks: Book[] = storedBooks ? JSON.parse(storedBooks) : [];

    const alreadyExists = shortlistedBooks.some(function (item) {
      return item.id === book.value?.id;
    });

    if (alreadyExists) {
      isShortlisted.value = true;
      return;
    }

    shortlistedBooks.push(book.value);

    localStorage.setItem(SHORTLIST_KEY, JSON.stringify(shortlistedBooks));

    isShortlisted.value = true;
  } catch (error) {
    console.error("Failed to shortlist book:", error);
  }
}

// Remove From Shortlist

function removeFromShortlist() {
  if (!import.meta.client || !book.value) {
    return;
  }

  try {
    const storedBooks = localStorage.getItem(SHORTLIST_KEY);

    if (!storedBooks) {
      isShortlisted.value = false;
      return;
    }

    const shortlistedBooks: Book[] = JSON.parse(storedBooks);

    const updatedBooks = shortlistedBooks.filter(function (item) {
      return item.id !== book.value?.id;
    });

    localStorage.setItem(SHORTLIST_KEY, JSON.stringify(updatedBooks));

    isShortlisted.value = false;
  } catch (error) {
    console.error("Failed to remove shortlisted book:", error);
  }
}

// Back

function goBack() {
  navigateTo("/");
}

onMounted(function () {
  loadBook();
});
</script>

<template>
  <main class="min-h-screen bg-slate-50">
    <div class="mx-auto max-w-5xl px-6 py-10">
      <!-- Back Button -->

      <button
        type="button"
        class="mb-8 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-[#4f46e5]"
        @click="goBack"
      >
        <span>←</span>
        Discover Books
      </button>

      <!-- Loading -->

      <div
        v-if="loading"
        class="flex min-h-[400px] items-center justify-center"
      >
        <div class="text-center">
          <div
            class="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-[#4f46e5]"
          />

          <p class="mt-4 text-sm text-slate-500">Loading book details...</p>
        </div>
      </div>

      <!-- Error -->

      <div
        v-else-if="errorMessage"
        class="rounded-xl border border-slate-200 bg-white p-10 text-center"
      >
        <h1 class="text-xl font-semibold text-slate-900">
          {{ errorMessage }}
        </h1>

        <button
          type="button"
          class="mt-6 rounded-lg bg-[#4f46e5] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-700"
          @click="goBack"
        >
          Discover Books
        </button>
      </div>

      <!-- Book Details -->

      <article
        v-else-if="book"
        class="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-slate-200"
      >
        <div class="grid grid-cols-1 gap-8 p-6 md:grid-cols-[280px_1fr] md:p-8">
          <!-- Book Cover -->

          <div class="flex justify-center">
            <div
              class="h-[380px] w-[260px] overflow-hidden rounded-xl bg-slate-100 shadow-sm"
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
            </div>
          </div>

          <!-- Details -->

          <div>
            <!-- Title -->

            <h1 class="text-3xl font-bold leading-tight text-slate-900">
              {{ book.title }}
            </h1>

            <!-- Author -->

            <p class="mt-3 text-base text-slate-600">
              By
              <span class="font-medium text-slate-900">
                {{ book.authors?.join(", ") || "Unknown Author" }}
              </span>
            </p>

            <!-- Published -->

            <p v-if="book.publishedDate" class="mt-2 text-sm text-slate-500">
              Published: {{ book.publishedDate }}
            </p>

            <!-- Publisher -->

            <p v-if="book.publisher" class="mt-1 text-sm text-slate-500">
              Publisher: {{ book.publisher }}
            </p>

            <!-- Page Count -->

            <p v-if="book.pageCount" class="mt-1 text-sm text-slate-500">
              Pages: {{ book.pageCount }}
            </p>

            <!-- Categories -->

            <div
              v-if="book.categories?.length"
              class="mt-4 flex flex-wrap gap-2"
            >
              <span
                v-for="category in book.categories"
                :key="category"
                class="rounded-full bg-indigo-50 px-3 py-1 text-xs font-medium text-[#4f46e5]"
              >
                {{ category }}
              </span>
            </div>

            <!-- Shortlist Button -->

            <button
              v-if="isShortlisted"
              type="button"
              class="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#4f46e5] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-indigo-700"
              @click="removeFromShortlist"
            >
              <span class="text-lg text-yellow-300"> ★ </span>

              Shortlisted
            </button>

            <button
              v-else
              type="button"
              class="mt-6 inline-flex items-center gap-2 rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#4f46e5]"
              @click="addToShortlist"
            >
              <span> ★ </span>

              Shortlist
            </button>

            <!-- Description -->

            <div class="mt-8">
              <h2 class="text-lg font-semibold text-slate-900">
                About this book
              </h2>

              <p
                class="mt-3 whitespace-pre-line text-sm leading-7 text-slate-600"
              >
                {{ book.description }}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  </main>
</template>
