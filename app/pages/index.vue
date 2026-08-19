<script setup lang="ts">
interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  cover: string;
  description?: string;
  publisher?: string;
  pageCount?: number;
  categories?: string[];
  language?: string;
  previewLink?: string;
  infoLink?: string;
}

interface BooksResponse {
  total: number;
  books: Book[];
  source: string;
}

const books = ref<Book[]>([]);
const loading = ref(false);
const errorMessage = ref("");
const searchInput = ref("");
const searchValue = ref("books");
const shortlistedIds = ref<string[]>([]);

// Component flag
const showShortlisted = ref(false);

// Load Books

async function loadBooks() {
  loading.value = true;
  errorMessage.value = "";

  try {
    const response = await $fetch<BooksResponse>("/api/books", {
      query: {
        q: searchValue.value,
      },
    });

    console.log("Books response:", response);

    books.value = response?.books || [];
  } catch (error) {
    console.error("Failed to load books:", error);

    books.value = [];
    errorMessage.value = "Failed to load books. Please try again.";
  } finally {
    loading.value = false;
  }
}

// Search

async function handleSearch() {
  const searchText = searchInput.value.trim();

  searchValue.value = searchText || "books";
  showShortlisted.value = false;

  await loadBooks();
}

// Clear Search

async function clearSearch() {
  searchInput.value = "";
  searchValue.value = "books";
  showShortlisted.value = false;

  await loadBooks();
}

// Show Shortlisted

function goToShortlist() {
  showShortlisted.value = true;
}

// Discover Books

function goToBooks() {
  showShortlisted.value = false;
}

// Shortlist Book

function handleShortlist(book: Book) {
  if (!import.meta.client) {
    return;
  }

  try {
    const storedBooks = localStorage.getItem("shortlisted-books");

    let shortlistedBooks: Book[] = [];

    if (storedBooks) {
      shortlistedBooks = JSON.parse(storedBooks);
    }

    // Prevent duplicate books

    const alreadyShortlisted = shortlistedBooks.some(function (item) {
      return item.id === book.id;
    });

    if (alreadyShortlisted) {
      return;
    }

    // Add complete book

    shortlistedBooks.push(book);

    // Save to localStorage

    localStorage.setItem("shortlisted-books", JSON.stringify(shortlistedBooks));

    // Update UI

    shortlistedIds.value = shortlistedBooks.map(function (item) {
      return item.id;
    });

    console.log("Shortlisted:", book.title);
  } catch (error) {
    console.error("Failed to save shortlisted book:", error);
  }
}

// Load Shortlisted IDs

function loadShortlistedBooks() {
  if (!import.meta.client) {
    return;
  }

  try {
    const storedBooks = localStorage.getItem("shortlisted-books");

    if (!storedBooks) {
      shortlistedIds.value = [];
      return;
    }

    const shortlistedBooks: Book[] = JSON.parse(storedBooks);

    shortlistedIds.value = shortlistedBooks.map(function (book) {
      return book.id;
    });
  } catch (error) {
    console.error("Failed to load shortlisted books:", error);

    shortlistedIds.value = [];
  }
}

// Go Back

function goBack() {
  showShortlisted.value = false;
  location.reload();
}

// Initial Load

onMounted(function () {
  loadShortlistedBooks();
  loadBooks();
});
</script>

<template>
  <main class="min-h-screen bg-slate-50 p-8">
    <div class="mx-auto max-w-7xl">
      <!-- TOP BAR -->

      <div
        v-if="!showShortlisted"
        class="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <!-- SEARCH -->

        <form
          class="w-full sm:max-w-xl"
          role="search"
          @submit.prevent="handleSearch"
        >
          <div
            class="relative w-full rounded-xl bg-white shadow-md ring-1 ring-slate-200 transition-all duration-200 focus-within:shadow-lg focus-within:ring-2 focus-within:ring-indigo-400"
          >
            <!-- Search Icon -->

            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              class="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-indigo-500"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />

              <path stroke-linecap="round" d="m20 20-4-4" />
            </svg>

            <!-- Search Input -->

            <input
              v-model="searchInput"
              type="text"
              placeholder="Search books, authors or year..."
              aria-label="Search books, authors or year"
              class="h-12 w-full rounded-xl border-0 bg-white pl-12 pr-32 text-sm font-medium text-slate-900 outline-none placeholder:text-slate-400 focus:ring-0"
            />

            <!-- Clear -->

            <button
              v-if="searchInput"
              type="button"
              aria-label="Clear search"
              class="absolute right-24 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-slate-100 text-lg leading-none text-slate-500 transition hover:bg-indigo-100 hover:text-indigo-600"
              @click="clearSearch"
            >
              ×
            </button>

            <!-- Search Button -->

            <button
              type="submit"
              :disabled="loading"
              class="absolute right-1.5 top-1.5 h-9 rounded-lg bg-indigo-600 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-60"
            >
              Search
            </button>
          </div>
        </form>

        <!-- SHORTLISTED BUTTON -->

        <button
          type="button"
          class="flex shrink-0 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-500 hover:bg-indigo-50 hover:text-indigo-600 hover:shadow-md"
          @click="goToShortlist"
        >
          <!-- Gold Star -->

          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          >
            <path
              d="m12 2.75 2.91 5.9 6.51.95-4.71 4.59 1.11 6.48L12 17.61l-5.82 3.06 1.11-6.48-4.71-4.59 6.51-.95L12 2.75Z"
            />
          </svg>

          <span> Shortlisted Books </span>
        </button>
      </div>

      <!-- SHORTLISTED COMPONENT -->

      <template v-if="showShortlisted">
        <Shortlisted @goBack="goBack" />
      </template>

      <!-- DISCOVER BOOKS -->

      <template v-else>
        <!-- Page Title -->

        <h1 class="mb-8 text-3xl font-bold text-slate-900">Discover Books</h1>

        <!-- Loading -->

        <div
          v-if="loading"
          class="flex min-h-64 flex-col items-center justify-center"
        >
          <!-- Spinner -->

          <div
            class="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
            aria-label="Loading"
          />

          <p class="mt-4 text-sm text-slate-600">
            Searching for

            <span class="font-semibold text-slate-900">
              "{{ searchValue }}"
            </span>

            ...
          </p>
        </div>

        <!-- Error -->

        <div
          v-else-if="errorMessage"
          class="rounded-xl bg-red-50 p-6 text-center text-red-600 ring-1 ring-red-200"
        >
          <p class="font-medium">
            {{ errorMessage }}
          </p>

          <button
            type="button"
            class="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-red-700"
            @click="loadBooks"
          >
            Try Again
          </button>
        </div>

        <!-- Books -->

        <template v-else-if="books.length">
          <!-- Search Result -->

          <div class="mb-5">
            <p class="text-sm text-slate-500">Search results for</p>

            <h2 class="text-xl font-semibold text-slate-900">
              "{{ searchValue }}"
            </h2>
          </div>

          <!-- Book Grid -->

          <div
            class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
          >
            <BookCard
              v-for="book in books"
              :key="book.id"
              :book="book"
              :is-shortlisted="shortlistedIds.includes(book.id)"
              @shortlist="handleShortlist"
            />
          </div>
        </template>

        <!-- No Results -->

        <div v-else class="py-16 text-center text-slate-500">
          <p class="text-lg font-semibold text-slate-700">No books found</p>

          <p class="mt-2 text-sm">
            No results found for

            <span class="font-medium text-slate-900">
              "{{ searchValue }}"
            </span>
          </p>
        </div>
      </template>
    </div>
  </main>
</template>
